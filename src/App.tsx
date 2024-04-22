import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface UpbitCandle {
  market: string;
  candle_date_time_utc: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
}

const App: React.FC = () => {
  const [unit, setUnit] = useState('minute'); // 'minute', 'hour', 'day', 'month'
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: 700,
        height: 600,
      });
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineVisible: true,
        lastValueVisible: true,
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 0.01,
        },
      });
      setupTooltip(chartRef.current, candleSeriesRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!candleSeriesRef.current) return;

      const urlParams = {
        minute: { url: 'minutes/1', count: 60 }, // 분 데이터
        hour: { url: 'minutes/60', count: 48 }, // 시간 데이터
        day: { url: 'days', count: 30 }, // 일 데이터
        month: { url: 'months', count: 12 }, // 월 데이터
      };

      const selectedParam = urlParams[unit];

      try {
        const response = await axios.get(
          `https://api.upbit.com/v1/candles/${selectedParam.url}?market=KRW-BTC&count=${selectedParam.count}`
        );
        const sortedData = response.data
          .map((candle: UpbitCandle) => ({
            time: Math.floor(
              new Date(candle.candle_date_time_utc).getTime() / 1000
            ),
            open: candle.opening_price,
            high: candle.high_price,
            low: candle.low_price,
            close: candle.trade_price,
          }))
          .sort((a: { time: number }, b: { time: number }) => a.time - b.time);

        candleSeriesRef.current.setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [unit]);

  function setupTooltip(chart: IChartApi, series: ISeriesApi<'Candlestick'>) {
    const tooltip = document.createElement('div');
    tooltip.className = 'floating-tooltip';
    document.body.appendChild(tooltip);
    chart.subscribeCrosshairMove(function (param) {
      if (
        !param.time ||
        param.point === undefined ||
        !param.seriesPrices.get(series)
      ) {
        tooltip.style.display = 'none';
      } else {
        const priceData = param.seriesPrices.get(series);
        tooltip.innerHTML = `
          Date: ${new Date(param.time * 1000).toLocaleString()}<br>
          Open: ${priceData.open}<br>
          High: ${priceData.high}<br>
          Low: ${priceData.low}<br>
          Close: ${priceData.close}
        `;
        tooltip.style.display = 'block';
        tooltip.style.left = `${Math.min(param.point.x + 20, window.innerWidth - tooltip.offsetWidth)}px`; // 화면 밖으로 나가지 않도록 조정
        tooltip.style.top = `${Math.min(param.point.y + 20, window.innerHeight - tooltip.offsetHeight)}px`; // 화면 밖으로 나가지 않도록 조정
      }
    });
  }

  return (
    <div>
      <div ref={chartContainerRef} />
      <button onClick={() => setUnit('minute')}>분</button>
      <button onClick={() => setUnit('hour')}>시간</button>
      <button onClick={() => setUnit('day')}>일</button>
      <button onClick={() => setUnit('month')}>월</button>
    </div>
  );
};

export default App;
