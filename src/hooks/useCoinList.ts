import { useMemo } from 'react';

/* // refactor
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
export function useSortedData(tickerData, sortOrder) {
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
}
