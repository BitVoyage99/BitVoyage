import { memo } from 'react';

interface Props {
  bidChangeRate: number;
  bidSize: string;
  bidPrice: string;
  bidPriceChangePercent: string;
}

const OrderbookBidRow = ({
  bidChangeRate,
  bidSize,
  bidPrice,
  bidPriceChangePercent,
}: Props) => {
  return (
    <tr>
      <td colSpan={2} />
      <td className="border-2 px-2 py-1 bg-[rgb(200,74,49)]/20 text-[#c84a31]">
        <div className="flex justify-end">
          <strong className="pl-5">{bidPrice}</strong>
          <span className="ml-[14px] w-[50px] text-right">
            {bidPriceChangePercent}%
          </span>
        </div>
      </td>
      <td className="border-2 pr-2 bg-[rgb(200,74,49)]/20 text-right">
        <div className="flex justify-start relative">
          <div
            className="bg-[rgb(200,74,49)]/25 h-[26px]"
            style={{
              width: `${bidChangeRate}%`,
            }}
          />
          <span className="absolute top-1/2 -translate-y-1/2">{bidSize}</span>
        </div>
      </td>

      <td className="border-2 bg-[rgb(200,74,49)]/20 h-[45px]"></td>
    </tr>
  );
};

export default memo(OrderbookBidRow);
