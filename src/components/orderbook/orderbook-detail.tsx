import { OrderBookDetailData } from '@/types/coin';
import { memo } from 'react';
import OrderbookAskRow from './orderbook-ask-row';
import OrderbookBidRow from './orderbook-bid-row';
import { areEqual } from '@/utils';

interface Props {
  orderbookDetail?: OrderBookDetailData;
}

const OrderbookDetail = ({ orderbookDetail }: Props) => {
  if (!orderbookDetail) return null;

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
          {[...orderbookDetail.orderbook_units].reverse().map((unit, index) => (
            <OrderbookAskRow
              key={index}
              askChangeRate={unit.askChangeRate}
              askSize={unit.ask_size}
              askPrice={unit.ask_price}
              askPriceChangePercent={unit.askPriceChangePercent}
            />
          ))}
          {/* Red */}
          {orderbookDetail.orderbook_units.map((unit, index) => (
            <OrderbookBidRow
              key={index}
              bidChangeRate={unit.bidChangeRate}
              bidSize={unit.bid_size}
              bidPrice={unit.bid_price}
              bidPriceChangePercent={unit.bidPriceChangePercent}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(OrderbookDetail, areEqual);
