import { UPBIT_SOCKET_URL } from '@/api/upbit';
import useSocket from './useSocket';
// import useGetMarketCode from './useGetMarketCode';
import { useState } from 'react';
import { useMainStore } from '@/stores/main-store';
import useTickers from './useTickers';
import {
  OrderBookDetailData,
  OrderBookSocketData,
  TickerSocketData,
} from '@/types/coin';
import Adapter from '@/adapters/adapter';
import OrderBookAdapter from '@/adapters/orderbook-adapter';
import useGetPrevClosingPrice from './useGetPrevClosingPrice';
import useFetchMarketCode from '@/hooks/useFetchMarketCode';

type UpbitSocketData = TickerSocketData | OrderBookSocketData;

const useUpbitSocket = () => {
  const selectedMarket = useMainStore(state => state.market);

  const [selectedTicker, setSelectedTicker] = useState<TickerSocketData>();
  const [orderbookDetail, setOrderbookDetail] = useState<OrderBookDetailData>();
  const { tickerData, updateTicker } = useTickers();

  const { marketCodes } = useFetchMarketCode({ debug: true });

  // const { data: allMarketCode } = useGetMarketCode();
  const prevClosingPrice = useGetPrevClosingPrice();

  const parseArrayBuffer = (arrayBuffer: ArrayBuffer) => {
    const unit8Array = new Uint8Array(arrayBuffer);
    const stringData = new TextDecoder('utf-8').decode(unit8Array);
    return JSON.parse(stringData);
  };

  const setUpbitDataByType = (upbitSocketData: UpbitSocketData) => {
    if (upbitSocketData.type === 'orderbook') {
      const orderbookDetail = Adapter.from(upbitSocketData).to(
        (data: OrderBookSocketData) =>
          new OrderBookAdapter(data, prevClosingPrice).adapt()
      );
      setOrderbookDetail(orderbookDetail);
    } else if (
      upbitSocketData.type === 'ticker' &&
      upbitSocketData.code === selectedMarket
    ) {
      setSelectedTicker(upbitSocketData as TickerSocketData);
    } else if (upbitSocketData.type === 'ticker') {
      updateTicker(upbitSocketData as TickerSocketData);
    }
  };

  const handleMessage = (event: MessageEvent<ArrayBuffer>) => {
    const parsedData: UpbitSocketData = parseArrayBuffer(event.data);
    setUpbitDataByType(parsedData);
  };

  const message = [
    { ticket: 'UNIQUE_TICKET' },
    { type: 'orderbook', codes: [selectedMarket] },
    { type: 'ticker', codes: marketCodes.map(code => code.market) },
    // { type: 'ticker', codes: allMarketCode },
  ];

  useSocket({
    binaryType: 'arraybuffer',
    url: UPBIT_SOCKET_URL,
    data: JSON.stringify(message),
    onMessage: handleMessage,
  });

  return { selectedTicker, tickerData, orderbookDetail };
};

export default useUpbitSocket;
