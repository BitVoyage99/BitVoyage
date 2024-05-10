import { useEffect } from 'react';

type BinaryType = 'arraybuffer' | 'blob';

type DataType = string | ArrayBufferLike | Blob | ArrayBufferView;

interface Params<T> {
  url: string;
  data: DataType;
  binaryType?: BinaryType;
  onMessage?: (e: MessageEvent<T>) => void;
  onError?: (event: Event) => void;
}

const useSocket = <T>(params: Params<T>) => {
  const { url, data, binaryType = 'blob', onError, onMessage } = params;

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socket.binaryType = binaryType;

    socket.onopen = () => {
      socket.send(data);
    };

    socket.onmessage = (event: MessageEvent<T>) => {
      onMessage && onMessage(event);
    };

    socket.onerror = event => {
      onError && onError(event);
    };

    return () => socket.close();
  }, [url, data]);
};

export default useSocket;
