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

  //TODO
  // const handleMenuClick = () => {
  //   setUnit(e.key);
  // };
  // const timeUnits = ['minute', 'hour', 'day', 'weeks', 'month'];
  // const menu = (
  //   <menu onClick={handleMenuClick}>
  //     {timeUnits.map(unit => (
  //       <menu.Item key={unit}>{unit}</menu.Item>
  //     ))}
  //   </menu>
  // );

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: 700,
        height: 600,
      });
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineVisible: true,
        lastValueVisible: true,
        //차트의 범위를 지정
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 0.01,
        },
        priceScale: {
          mode: 1, // 상수 또는 계산된 값
          autoScale: false,
          invertScale: false,
          alignLabels: true,
          borderVisible: false,
          borderColor: '#555ffd',
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
          entireTextOnly: true,
          drawTicks: true,
          tickMarkFormatter: price => {
            // 이 함수는 축에 표시될 눈금 값을 커스터마이즈 할 수 있도록 합니다.
            return Math.floor(price).toString();
          },
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
        weeks: { url: 'weeks', count: 24 }, //주 데이터
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
            open: candle.opening_price / 100000,
            high: candle.high_price / 100000,
            low: candle.low_price / 100000,
            close: candle.trade_price / 100000,
          }))
          .sort((a: { time: number }, b: { time: number }) => a.time - b.time);

        candleSeriesRef.current.setData(sortedData);
      } catch (error) {
        //console.error('Error fetching data:', error);
        console.warn('Error fetching data:', error);
      }
    };

    fetchData();
  }, [unit]);

  //tooltip
  // function setupTooltip(chart: IChartApi, series: ISeriesApi<'Candlestick'>) {
  //   const tooltip = document.createElement('div');
  //   tooltip.className = 'floating-tooltip';
  //   document.body.appendChild(tooltip);
  //   chart.subscribeCrosshairMove(function (param) {
  //     if (
  //       !param.time ||
  //       param.point === undefined ||
  //       !param.seriesPrices.get(series)
  //     ) {
  //       tooltip.style.display = 'none';
  //     } else {
  //       const priceData = param.seriesPrices.get(series);
  //       tooltip.innerHTML = `
  //         Date: ${new Date(param.time * 1000).toLocaleString()}<br>
  //         Open: ${priceData.open}<br>
  //         High: ${priceData.high}<br>
  //         Low: ${priceData.low}<br>
  //         Close: ${priceData.close}
  //       `;
  //       tooltip.style.display = 'block';
  //       tooltip.style.left = `${Math.min(param.point.x + 20, window.innerWidth - tooltip.offsetWidth)}px`; // 화면 밖으로 나가지 않도록 조정
  //       tooltip.style.top = `${Math.min(param.point.y + 20, window.innerHeight - tooltip.offsetHeight)}px`; // 화면 밖으로 나가지 않도록 조정
  //     }
  //   });
  // }
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
        tooltip.style.left = `${Math.min(param.point.x + 20, window.innerWidth - tooltip.offsetWidth)}px`;
        tooltip.style.top = `${Math.min(param.point.y + 20, window.innerHeight - tooltip.offsetHeight)}px`;
      }
    });
  }

  //zoomIn, zoomOut;
  const zoomIn = () => {
    if (chartRef.current) {
      const priceScale = chartRef.current.priceScale();
      priceScale.applyOptions({ autoScale: false });
      const range = priceScale.priceRange();
      if (range) {
        const diff = range.maxValue - range.minValue;
        priceScale.setPriceRange({
          minValue: range.minValue + diff * 0.1,
          maxValue: range.maxValue - diff * 0.1,
        });
      }
    }
  };
  const zoomOut = () => {
    if (chartRef.current) {
      const priceScale = chartRef.current.priceScale();
      priceScale.applyOptions({ autoScale: false });
      const range = priceScale.priceRange();
      if (range) {
        const diff = range.maxValue - range.minValue;
        priceScale.setPriceRange({
          minValue: range.minValue - diff * 0.1,
          maxValue: range.maxValue + diff * 0.1,
        });
      }
    }
  };
  // const zoomIn = () => {
  //   if (chartRef.current) {
  //     chartRef.current.timeScale().zoomIn(2);
  //   }
  // };
  // const zoomOut = () => {
  //   if (chartRef.current) {
  //     chartRef.current.timeScale().zoomOut(2);
  //   }
  // };

  return (
    <div>
      <div ref={chartContainerRef} />
      <button onClick={() => setUnit('minute')}>분</button>
      <button onClick={() => setUnit('hour')}>시간</button>
      <button onClick={() => setUnit('day')}>일</button>
      <button onClick={() => setUnit('weeks')}>주</button>
      <button onClick={() => setUnit('month')}>월</button>

      {/* <dropdown overlay={menu} trigger={['click']}>
        <button>
          {unit} <span style={{ marginLeft: 8 }}>▼</span>
        </button>
      </dropdown> */}

      <button onClick={() => console.log('Zooming in') || zoomIn()}>+</button>
      <button onClick={() => console.log('Zooming out') || zoomOut()}>-</button>
    </div>
  );
};

export default App;
