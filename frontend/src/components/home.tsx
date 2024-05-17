import OrderbookDetail from './orderbook/orderbook-detail';
import CoinList from './coin-list/CoinList';
import { memo } from 'react';
import useUpbitSocket from '@/hooks/useUpbitSocket';
import Chart from '@/Chart';

const Home = () => {
  const { orderbookDetail } = useUpbitSocket();

  return (
    <div className="w-full min-h-screen bg-slate-200">
      <main className="py-16 border-2 w-[80%] mx-auto flex flex-col gap-[20px] items-start relative">
        <div className="w-full">
          <Chart />
        </div>
        <div className="w-full flex gap-[20px]">
          <div className="w-1/2">
            <OrderbookDetail orderbookDetail={orderbookDetail} />
          </div>
          <div className="w-1/2">
            <CoinList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Home);
