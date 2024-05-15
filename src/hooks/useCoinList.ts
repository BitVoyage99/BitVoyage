import { useMemo, useState } from 'react';
import { TickerSocketData } from '@/types/coin';

/* // refactoring
const sortedData = useMemo(() => {
  if (!tickerData) return [];

  const data = [...tickerData];
  // console.log('data?', data);
  if (sortOrder === 'asc') {
    data.sort((a, b) => a.acc_trade_price_24h - b.acc_trade_price_24h);
    console.log();
  } else if (sortOrder === 'desc') {
    data.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);
  }

  return data;
}, [tickerData, sortOrder]);
//
 */
/* export function useSortedData(
  tickerData: TickerSocketData[],
  sortOrder: 'asc' | 'desc' | null
): TickerSocketData[] {
  return useMemo(() => {
    if (!tickerData) return [];

    const data = [...tickerData];
    if (sortOrder === 'asc') {
      return data.sort((a, b) => a.acc_trade_price_24h - b.acc_trade_price_24h);
    } else if (sortOrder === 'desc') {
      return data.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);
    }

    return data;
  }, [tickerData, sortOrder]);
} */

const getImgSrcByOrder = (sortOrder: 'asc' | 'desc' | null): string => {
  return sortOrder === 'asc'
    ? 'https://cdn.upbit.com/upbit-web/images/ico_up_down_2.80e5420.png'
    : 'https://cdn.upbit.com/upbit-web/images/ico_up_down_1.af5ac5a.png';
};
const getSortedData = (
  tickerData: TickerSocketData[],
  sortOrder: 'asc' | 'desc' | null
): TickerSocketData[] => {
  if (!tickerData) return [];

  const data = [...tickerData];
  if (sortOrder === 'asc') {
    return data.sort((a, b) => a.acc_trade_price_24h - b.acc_trade_price_24h);
  } else if (sortOrder === 'desc') {
    return data.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);
  }

  return data;
};

export function useSortedData(tickerData: TickerSocketData[]): {
  imgSrc: string;
  sortedData: TickerSocketData[];
  toggleSortOrder: () => void;
} {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const imgSrc = useMemo(() => getImgSrcByOrder(sortOrder), [sortOrder]);
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedData = useMemo(() => {
    return getSortedData(tickerData, sortOrder);
  }, [tickerData, sortOrder]);

  return { imgSrc, sortedData, toggleSortOrder };
}
