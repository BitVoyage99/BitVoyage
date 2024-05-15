import {
  CandlestickStyleOptions,
  ChartOptions,
  DeepPartial,
  SeriesOptionsCommon,
} from 'lightweight-charts';

export const CHART_OPTIONS: DeepPartial<ChartOptions> = {
  layout: {
    textColor: 'black',
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
};

export const CANDLE_STICK_OPTIONS: DeepPartial<
  CandlestickStyleOptions & SeriesOptionsCommon
> = {
  upColor: '#26a69a',
  downColor: '#ef5350',
  borderVisible: false,
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350',
};
