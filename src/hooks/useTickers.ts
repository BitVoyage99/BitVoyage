import { useEffect, useState } from 'react';
import useGetMarketCode from './useGetMarketCode';
import { TickerSocketData } from '@/types/coin';

const useTickers = () => {
  const { data } = useGetMarketCode();

  const [tickers, setTickers] = useState<{
    [key: string]: TickerSocketData | null;
  }>();

  useEffect(() => {
    if (!data) return;

    // 문자열 배열을 받아서, 각 문자열을 객체의 키로 초기화.
    const initializeObjectKeys = (keys: string[]) => {
      return keys.reduce<{ [key: string]: null }>((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});
    };

    const initTickers = initializeObjectKeys(data);

    setTickers(initTickers);
  }, [data]);

  const updateTicker = (key: string, tickerData: TickerSocketData) => {
    setTickers(prev => ({
      ...prev,
      [key]: tickerData,
    }));
  };

  return { tickers, updateTicker };
};

export default useTickers;
