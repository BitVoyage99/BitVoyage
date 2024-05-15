import { getAllMarket } from '@/api/upbit';
import { queryKeys } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

const useGetMarketCode = () => {
  return useQuery({
    queryKey: [queryKeys.market],
    queryFn: () => getAllMarket(),
    select: data => data?.map(item => item.market),
  });
};

export default useGetMarketCode;
