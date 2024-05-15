import { memo } from 'react';

interface Props {
  askChangeRate: number;
  askSize: string;
  askPrice: string;
  askPriceChangePercent: string;
}

const OrderbookAskRow = ({
  askChangeRate,
  askSize,
  askPrice,
  askPriceChangePercent,
}: Props) => {
  return (
    <tr>
      <td className="border-2 bg-[rgb(18,97,196)]/20 h-[45px]"></td>
      <td className="border-2 pl-2 bg-[rgb(18,97,196)]/20 text-right">
        <div className="flex justify-end relative w-[100%]">
          <div
            className={`bg-[rgb(18,97,196)]/25 h-[26px]`}
            style={{
              width: `${askChangeRate}%`,
            }}
          />
          <span className="absolute top-1/2 -translate-y-1/2">{askSize}</span>
        </div>
      </td>
      <td className="border-2 px-2 py-1 bg-[rgb(18,97,196)]/20 text-[#1261c4]">
        <div className="flex justify-end">
          <strong className="pl-5">{askPrice}</strong>
          <span className="ml-[14px] w-[50px] text-right">
            {askPriceChangePercent}%
          </span>
        </div>
      </td>
      <td colSpan={2} />
    </tr>
  );
};

export default memo(OrderbookAskRow);
