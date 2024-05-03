import { useEffect, useRef, useState } from 'react';
import useThrottle from './useThrottle';

interface Params<T, R> {
  url: string;
  msg: unknown;
  select?: (data: T) => R;
}

const useWebSocket = <T, R = T>({ url, msg, select }: Params<T, R>) => {
  const [data, setData] = useState<R | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const throttledUpdateData = useThrottle((data: T) => {
    const selectedData = select ? select(data) : (data as unknown as R);
    setData(selectedData);
  }, 500);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;

    socket.onmessage = event => {
      const data = new Uint8Array(event.data);
      const stringData = new TextDecoder('utf-8').decode(data);
      const parsedData = JSON.parse(stringData) as T;
      throttledUpdateData(parsedData);
    };

    socket.onopen = () => {
      socket.send(JSON.stringify(msg));
    };

    return () => socket.close();
  }, []);

  return { data };
};

export default useWebSocket;
