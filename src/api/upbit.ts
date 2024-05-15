import { upbitInstance } from '@/lib/axios';
import { MarketData, PeriodType, TickerData } from '@/types/coin';

export const UPBIT_SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

type GetCandleParams = {
  market: string;
  period: PeriodType;
  count?: number;
};

export const getAllMarket = async () => {
  try {
    const response = await upbitInstance.get<MarketData[]>('market/all');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTicker = async (markets: string[]) => {
  try {
    const response = await upbitInstance.get<TickerData[]>(
      `ticker?markets=${markets.join()}`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCandle = async ({
  period,
  market,
  count = 1,
}: GetCandleParams) => {
  try {
    const response = await upbitInstance.get(
      `candles/${period}/1?market=${market}&count=${count}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error');
    }
  } catch (error) {
    console.error(error);
  }
};
