import { getTicker } from '@/api/upbit';
import { queryKeys } from '@/lib/query-keys';
import { useMainStore } from '@/stores/main-store';
import { useQuery } from '@tanstack/react-query';

const useGetPrevClosingPrice = () => {
  const market = useMainStore(state => state.market);

  const { data: tickerData } = useQuery({
    queryKey: [queryKeys.ticker, { market: [market] }],
    queryFn: () => getTicker([market]),
  });

  return tickerData?.[0].prev_closing_price;
};

export default useGetPrevClosingPrice;
