import Adapter from '@/adapters/adapter';
import OrderBookAdapter from '@/adapters/orderbook-adapter';
import { UPBIT_SOCKET_URL, getTicker } from '@/api/upbit';
import useWebSocket from '@/hooks/useWebSocket';
import { queryKeys } from '@/lib/query-keys';
import { useMainStore } from '@/stores/main-store';
import { OrderBook, PriceDetailData } from '@/types/coin';
import { useQuery } from '@tanstack/react-query';

const PriceDetail = () => {
  const market = useMainStore(state => state.market);

  const webSocketMessage = [
    {
      ticket: 'test',
    },
    {
      type: 'orderbook',
      codes: [market],
    },
    {
      format: 'DEFAULT',
    },
  ];

  const { data: orderBookData } = useWebSocket<OrderBook, PriceDetailData>({
    url: UPBIT_SOCKET_URL,
    msg: webSocketMessage,
    select: data =>
      Adapter.from(data).to((item: OrderBook) =>
        new OrderBookAdapter(item).adapt()
      ),
  });

  const { data: tickerData } = useQuery({
    queryKey: [queryKeys.ticker, { market: [market] }],
    queryFn: () => getTicker([market]),
  });

  if (!tickerData || !orderBookData) return null;

  return (
    <div>
      <table className="border-2 bg-white text-xs">
        <colgroup>
          <col width="42" />
          <col width="120" />
          <col width="*" />
          <col width="120" />
          <col width="42" />
        </colgroup>
        <tbody>
          {/* Blue */}
          {[...orderBookData.orderbook_units].reverse().map((unit, index) => (
            <tr key={index}>
              <td className="border-2 bg-[rgb(18,97,196)]/20 h-[45px]"></td>
              <td className="border-2 pl-2 bg-[rgb(18,97,196)]/20 text-right">
                <div className="flex justify-end relative w-[100%]">
                  <div
                    className={`bg-[rgb(18,97,196)]/25 h-[26px]`}
                    style={{
                      width: `${unit.askChangeRate}%`,
                    }}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2">
                    {unit.ask_size.toFixed(3)}
                  </span>
                </div>
              </td>
              <td className="border-2 px-2 py-1 bg-[rgb(18,97,196)]/20 text-[#1261c4]">
                <div className="flex justify-end">
                  <strong className="pl-5">
                    {unit.ask_price.toLocaleString()}
                  </strong>
                  <span className="ml-[14px] w-[50px] text-right">
                    {calculatePercentageChange(
                      unit.ask_price,
                      tickerData[0].prev_closing_price
                    )}
                    %
                  </span>
                </div>
              </td>
              <td colSpan={2} />
            </tr>
          ))}
          {/* Red */}
          {orderBookData.orderbook_units.map((unit, index) => (
            <tr key={index}>
              <td colSpan={2} />
              <td className="border-2 px-2 py-1 bg-[rgb(200,74,49)]/20 text-[#c84a31]">
                <div className="flex justify-end">
                  <strong className="pl-5">
                    {unit.bid_price.toLocaleString()}
                  </strong>
                  <span className="ml-[14px] w-[50px] text-right">
                    {calculatePercentageChange(
                      unit.bid_price,
                      tickerData[0].prev_closing_price
                    )}
                    %
                  </span>
                </div>
              </td>
              <td className="border-2 pr-2 bg-[rgb(200,74,49)]/20 text-right">
                <div className="flex justify-start relative">
                  <div
                    className="bg-[rgb(200,74,49)]/25 h-[26px]"
                    style={{
                      width: `${unit.bidChangeRate}%`,
                    }}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2">
                    {unit.bid_size.toFixed(3)}
                  </span>
                </div>
              </td>

              <td className="border-2 bg-[rgb(200,74,49)]/20 h-[45px]"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceDetail;

function calculatePercentageChange(
  currentPrice: number,
  previousClosingPrice: number
): string {
  if (previousClosingPrice === 0) return '0.00'; // 분모가 0인 경우, 변화율을 0으로 처리
  const change =
    ((currentPrice - previousClosingPrice) / previousClosingPrice) * 100;
  return change.toFixed(2); // 결과를 소수점 두 자리로 포맷
}
