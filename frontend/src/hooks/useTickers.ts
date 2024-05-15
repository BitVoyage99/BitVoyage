import { useState } from 'react';
// import useGetMarketCode from './useGetMarketCode';
import { TickerSocketData } from '@/types/coin';

interface Ticker {
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
}

const useTickers = () => {
  const [tickerData, setTickerData] = useState<Ticker[]>([]);

  const updateTicker = (newTickerData: TickerSocketData) => {
    setTickerData(prev => {
      const index = prev.findIndex(
        ticker => ticker.code === newTickerData.code
      );
      if (index !== -1) {
        // 기존 배열에서 해당 코드의 티커 데이터를 찾은 경우
        const updatedTickers = [...prev];
        updatedTickers[index] = { ...updatedTickers[index], ...newTickerData };
        return updatedTickers;
      } else {
        // 기존 배열에 해당 코드의 티커 데이터가 없는 경우
        return [...prev, newTickerData];
      }
    });
  };

  return { tickerData, updateTicker };
};
export default useTickers;
