import { UpbitCandle, ChartData } from '../types/types';

class ChartDataAdapter {
  private candles: UpbitCandle[];

  constructor(candles: UpbitCandle[]) {
    this.candles = candles;
  }

  //   public adapt(): ChartData[] {
  //     return this.candles
  //       .map(candle => ({
  //         time: Math.floor(
  //           new Date(candle.candle_date_time_utc).getTime() / 1000
  //         ),
  //         open: candle.opening_price / 100000,
  //         high: candle.high_price / 100000,
  //         low: candle.low_price / 100000,
  //         close: candle.trade_price / 100000,
  //         volume: candle.candle_acc_trade_volume,
  //       }))
  //       .sort((a, b) => a.time - b.time); // Ensure data is sorted by time
  //   }

  // const sortedData = response.data
  //   //TODO lightweight 차트 플립현상(소켓들어온 데이터가 가공되지 않고 적용후 약 0.2초정도 차트에 표시된다음 다시 정상으로 돌아옴.)
  //   .map((candle: UpbitCandle) => ({
  //     time: Math.floor(
  //       new Date(candle.candle_date_time_utc).getTime() / 1000
  //     ),
  //     open: candle.opening_price / 100000,
  //     high: candle.high_price / 100000,
  //     low: candle.low_price / 100000,
  //     close: candle.trade_price / 100000,
  //     //24.05.04 volume을 추가
  //     volume: candle.candle_acc_trade_volume,
  //   }))
  //   .sort((a: { time: number }, b: { time: number }) => a.time - b.time);
  public adapt(): ChartData[] {
    return this.candles
      .map(candle => ({
        time: Math.floor(
          new Date(candle.timestamp).getTime() / 1000
        ),
        // time: candle.candle_date_time_utc,
         open: candle.opening_price / 100000,
        high: candle.high_price / 100000,
        low: candle.low_price / 100000,
        close: candle.trade_price / 100000,
        //24.05.04 volume을 추가
        volume: candle.candle_acc_trade_volume,
      }))
      //.sort((a, b) => a.time - b.time); // Ensure data is sorted by time
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }
}
export default ChartDataAdapter;

// Helper to format the time
// function formatTime(timestamp: number): Time {
//   const date = new Date(timestamp * 1000); // Convert from Unix timestamp in seconds to milliseconds
//   return {
//     year: date.getUTCFullYear(),
//     month: date.getUTCMonth() + 1, // getUTCMonth returns 0-11, add 1 for 1-12
//     day: date.getUTCDate(),
//   };
// }
