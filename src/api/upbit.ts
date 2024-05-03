import { upbitInstance } from '@/lib/axios';
import { TickerData } from '@/types/coin';

export const UPBIT_SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

export const getTicker = async (markets: string[]) => {
  try {
    const response = await upbitInstance.get<TickerData[]>(
      `ticker?markets=${markets.join()}`
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
