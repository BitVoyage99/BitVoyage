import React, { useEffect, useRef, useState, memo } from 'react';
import useFetchMarketCode from '@/hooks/useFetchMarketCode.ts';
import useUpbitSocket from '@/hooks/useUpbitSocket';
import { useSortedData } from '@/hooks/useCoinList.ts';
import { useMainStore } from '../../stores/main-store.ts';

/* interface MarketCode {
  market: string;
  korean_name: string;
  english_name?: string;
}
 */
/* interface Ticker {
  type: string;
  code: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  acc_trade_price: number;
  change: 'RISE' | 'FALL';
  signed_change_price: number;
  change_rate: number;
  signed_change_rate: number;
  ask_bid: 'ASK' | 'BID';
  trade_volume: number;
  acc_trade_volume: number;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  acc_ask_volume: number;
  acc_bid_volume: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  market_state: 'ACTIVE' | 'INACTIVE';
  is_trading_suspended: boolean;
  delisting_date?: string;
  market_warning: 'NONE' | string;
  timestamp: number;
  acc_trade_price_24h: number;
  acc_trade_volume_24h: number;
  stream_type: 'REALTIME';
} */

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const CoinList: React.FC = () => {
  const { isLoading, marketCodes } = useFetchMarketCode({ debug: true });
  // const { isConnected, tickerData } = useWebSocketTicker(marketCodes);
  // console.log('marketCodes???? ', marketCodes);
  // const { setSelectedCoin, selectedCoin } = useStore<Ticker[]>();
  // const { market, updateMarket } = useMainStore<Ticker[]>();
  const { market, updateMarket } = useMainStore();
  const { tickerData } = useUpbitSocket();
  // console.log('새로운 tickerData? ', tickerData);

  const prevTickerData = usePrevious(tickerData);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(
    'https://cdn.upbit.com/upbit-web/images/ico_up_down_2.80e5420.png'
  );

  const sortedData = useSortedData(tickerData, sortOrder);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => {
      return prevOrder === 'asc' ? 'desc' : 'asc';
    });

    if (sortOrder === 'asc') {
      setImgSrc(
        'https://cdn.upbit.com/upbit-web/images/ico_up_down_1.af5ac5a.png'
      );
    } else if (sortOrder === 'desc') {
      setImgSrc(
        'https://cdn.upbit.com/upbit-web/images/ico_up_down_2.80e5420.png'
      );
    }
  };

  if (isLoading) {
    return <div>Loading market codes...</div>;
  }

  function formatTradePriceToMillions(tradePrice) {
    const MILLION = 1000000;
    const tradePriceInMillions = Math.floor(tradePrice / MILLION);

    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    });

    const formattedPrice = formatter.format(tradePriceInMillions);

    return `${formattedPrice}`;
  }

  function handleClickCoin(e) {
    console.log('coin clicked!');
    const currentTarget = marketCodes.filter(
      code => code.market === e.currentTarget.id
    );
    // console.log('currentTarget?? ', currentTarget[0].market);

    updateMarket(currentTarget[0].market);
    // console.log(market, 'in event ??');
  }

  function getColorClass(changeType) {
    switch (changeType) {
      case 'RISE':
        return 'text-red-500';
      case 'FALL':
        return 'text-blue-500';
      default:
        return 'text-black';
    }
  }

  function getChangeDirection(currentTicker, prevTicker) {
    if (!prevTicker) return null;

    const currentSignedChange = currentTicker.signed_change_price;
    const prevSignedChange = prevTicker.signed_change_price;

    // console.log(
    //   `Current: ${currentSignedChange}, Previous: ${prevSignedChange}`
    // );

    if (currentSignedChange > prevSignedChange) {
      return 'increased';
    } else if (currentSignedChange < prevSignedChange) {
      return 'decreased';
    } else {
      return 'unchanged';
    }
  }

  return (
    <div className="sticky top-18 bg-white h-screen w-full overflow-hidden max-w-xl mx-auto">
      <h3 className="sr-only">코인 리스트</h3>
      <div className="flex w-full border-b border-gray-200">
        <input
          type="search"
          className="flex-1 border-none p-1 pl-3 text-sm placeholder-gray-500 font-bold"
          placeholder="코인명/심볼검색"
        />
        <button className="w-8 h-8 bg-no-repeat bg-[url('https://cdn.upbit.com/images/bg.e801517.png')] bg--83px_2px" />
      </div>
      <div className="flex justify-between items-center bg-slate-50 w-full h-8 text-xs font-bold text-gray-600  border-y-zinc-300">
        <div className="w-12 pl-2 text-left">한글명</div>
        <div className="flex-1 text-right pr-2">현재가</div>
        <div className="flex-1 text-right pr-2">전일 대비</div>
        <div
          className="w-1/4 text-right pr-3 flex justify-end gap-4 h-3 items-center cursor-pointer"
          onClick={toggleSortOrder}>
          <span>거래대금</span>
          <img src={imgSrc} alt="정렬 아이콘" />
        </div>
      </div>

      <ul className="h-5/6 overflow-y-auto">
        {sortedData.map((ticker, index) => {
          const prevTicker = prevTickerData?.find(t => t.code === ticker.code);
          const changeDirection = getChangeDirection(ticker, prevTicker);
          const changeClass =
            changeDirection === 'increased'
              ? 'border border-solid border-rose-500'
              : changeDirection === 'decreased'
                ? 'border border-solid border-blue-500'
                : '';

          const selectedClass = market === ticker.code ? 'bg-gray-200' : '';

          return (
            <li
              className={`py-1 px-3 border-b-[0.5px] border-solid border-y-zinc-200 ${selectedClass} hover:bg-gray-200`}
              key={index}
              id={ticker.code}
              onClick={handleClickCoin}>
              <button className="flex justify-between items-center w-full h-full text-left">
                <div className="flex flex-col justify-center w-1/5 min-w-[55px]">
                  <strong className="block text-sm font-bold">
                    {/* {
                      marketCodes.filter(code => code.market === ticker.code)[0]
                        .korean_name
                    } */}
                    {marketCodes.find(code => code.market === ticker.code)
                      ?.korean_name || ''}
                  </strong>
                  <span className="block text-xs text-gray-600">
                    {ticker.code}
                  </span>
                </div>
                <div className={`${changeClass}`}>
                  <strong
                    className={`block w-1/5 min-w-[55px] text-right align-middle text-sm font-bold ${getColorClass(ticker.change)}  `}>
                    {ticker.trade_price?.toLocaleString('ko-KR') || '-'}
                  </strong>
                </div>
                <div
                  className={`flex flex-col justify-center w-1/5 min-w-[55px] text-right ${getColorClass(ticker.change)}`}>
                  <span className={`text-xs `}>
                    {ticker.signed_change_rate > 0 ? '+' : null}
                    {(ticker.signed_change_rate * 100).toFixed(2)}%
                  </span>
                  <span className="text-xs">
                    {ticker.signed_change_price?.toLocaleString('ko-KR') || '-'}
                  </span>
                </div>
                <span className="text-xs w-1/4 text-right">
                  {formatTradePriceToMillions(ticker.acc_trade_price_24h)}
                  <span className="text-gray-500">백만</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(CoinList);
