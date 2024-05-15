import useUpbitSocket from '@/hooks/useUpbitSocket';
import OrderbookDetail from './orderbook/orderbook-detail';
import Chart from '@/Chart';
import CoinList from './coin-list/CoinList';

const Home = () => {
  const { orderbookDetail, selectedTicker } = useUpbitSocket();
  console.log('data: ' + selectedTicker);

  return (
    <div className="w-full min-h-screen bg-slate-200">
      <header className="bg-blue-700 h-16 fixed w-full z-10">Header</header>
      <main className="pt-16 border-green-300 border-2 w-[95%] mx-auto flex justify-between items-start relative ">
        <div className="w-1/2">
          <OrderbookDetail orderbookDetail={orderbookDetail} />
          <Chart selectedTicker={selectedTicker} />
        </div>
        <div className="w-1/2">
          <CoinList />
        </div>
        <div className="sticky top-16"></div>
      </main>
    </div>
  );
};

export default Home;
