/* import { useEffect, useRef } from 'react';
import useStore from './store';

const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

const useWebSocketTicker = () => {
  const socket = useRef(null);
  const { setSocketData, marketCodes } = useStore();

  useEffect(() => {
    if (marketCodes.length === 0) {
      return;
    }

    socket.current = new WebSocket(SOCKET_URL);
    socket.current.binaryType = 'arraybuffer';

    socket.current.onopen = () => {
      const requestMessage = JSON.stringify([
        { ticket: 'test' },
        { type: 'ticker', codes: marketCodes.map(code => code.market) },
        { format: 'DEFAULT' },
      ]);
      socket.current.send(requestMessage);
    };

    socket.current.onmessage = event => {
      const data = new TextDecoder('utf-8').decode(new Uint8Array(event.data));
      setSocketData([JSON.parse(data)]);
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [marketCodes, setSocketData]);

  return {};
};
 */
