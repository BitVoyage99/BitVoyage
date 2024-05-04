import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
} from 'lightweight-charts';
import useNewData from './hooks/useNewData';

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
  const newData = useNewData();

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

      //pricescaleId를 생성
      const priceScaleId = 'upbit-price-scale';

      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineVisible: true,
        lastValueVisible: true,
        priceFormat: { type: 'price', precision: 0, minMove: 0.01 },
        priceScaleId: priceScaleId,
      });

      // 해당 가격 축의 설정을 조정
      chartRef.current.priceScale(priceScaleId).applyOptions({
        autoScale: true,
        invertScale: false,
        alignLabels: true,
        borderVisible: true,
        borderColor: '#555ffd',
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        entireTextOnly: true,
        tickMarkFormatter: price => (price / 100000).toFixed(1),
      });

      //setup time scale formatter
      chartRef.current.timeScale().applyOptions({
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const date = new Date(time * 1000);
          switch (unit) {
            case 'minute':
            case 'hour':
              return date.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            default:
              return date.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
              });
          }
        },
      });
      setupTooltip(chartRef.current, candleSeriesRef.current);
    }
  }, [unit]); // Ensure formatter updates when unit changes

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
      //newData 로 넘어올때 parsing이 되었는지를 판단해야된다면? - 데이터 정합성
      //typeof 이나 instanceOf 으로 구분하는 함수 하나, 이에 대해 parsing 변경해줘야되는 값으로 구분 피료. - 에러 처리
      //에러 처리 또한 필요하고, 에러 처리할때 사용자가 월/주/일/시간/분 중에 어떤값을 선택했는지도 필요함. - 일관성과 가독성

      try {
        const response = await axios.get(
          `https://api.upbit.com/v1/candles/${selectedParam.url}?market=KRW-BTC&count=${selectedParam.count}`
        );
        const sortedData = response.data
          //TODO lightweight 차트 플립현상(소켓들어온 데이터가 가공되지 않고 적용후 약 0.2초정도 차트에 표시된다음 다시 정상으로 돌아옴.)
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
    //1.
    fetchData();
    //2.
    if (newData && candleSeriesRef.current) {
      console.log('New data in component:', newData);
      candleSeriesRef.current.update({
        time: newData.time,
        open: newData.open / 100000,
        high: newData.high / 100000,
        low: newData.low / 100000,
        close: newData.close / 100000,
      });
    }
  }, [newData, unit]);

  function setupTooltip(chart: IChartApi, series: ISeriesApi<'Candlestick'>) {
    const tooltip = document.createElement('div');
    tooltip.className = 'floating-tooltip';
    tooltip.style.position = 'fixed';
    document.body.appendChild(tooltip);

    chart.subscribeCrosshairMove(function (
      param: MouseEventParams<'Candlestick'>
    ) {
      if (
        !param.time ||
        param.point === undefined ||
        !param.seriesPrices ||
        !param.seriesPrices.get(series)
      ) {
        tooltip.style.display = 'none';
        return;
      }
      const priceData = param.seriesPrices.get(series);
      if (!priceData) {
        tooltip.style.display = 'none';
        return;
      }
      tooltip.innerHTML = `
        Date: ${param.time ? new Date(param.time * 1000).toLocaleString() : 'N/A'}<br>
        Open: ${priceData.open}<br>
        High: ${priceData.high}<br>
        Low: ${priceData.low}<br>
        Close: ${priceData.close}
      `;
      tooltip.style.display = 'block';
      tooltip.style.left = `${param.point.x + 20}px`;
      tooltip.style.top = `${param.point.y + 20}px`;
    });
  }

  const zoomIn = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const range = timeScale.getVisibleLogicalRange();
      if (range) {
        const barsToZoom = (range.to - range.from) * 0.2; // Adjust zoom factor to 20%
        timeScale.setVisibleLogicalRange({
          from: range.from + barsToZoom,
          to: range.to - barsToZoom,
        });
      }
    }
  };
  const zoomOut = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const range = timeScale.getVisibleLogicalRange();
      if (range) {
        const barsToZoom = (range.to - range.from) * 0.5; // Adjust zoom factor to 50%
        timeScale.setVisibleLogicalRange({
          from: range.from - barsToZoom,
          to: range.to + barsToZoom,
        });
      }
    }
  };
  const zoomReset = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      // Reset to default zoom
      timeScale.resetTimeScale();
      timeScale.fitContent();
    }
  };

  const setChartRange = (event: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to midnight
    const timeScale = chartRef.current?.timeScale();
    if (timeScale) {
      let from, to;
      switch (event) {
        case 'day':
          from = now;
          to = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weeks':
          from = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
          to = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        default:
          from = now;
          to = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 1 day range
          break;
      }
      timeScale.setVisibleRange({
        from: from.getTime() / 1000,
        to: to.getTime() / 1000,
      });
    }
  };

  return (
    <div>
      <div ref={chartContainerRef} />
      <button
        onClick={() => {
          setUnit('minute');
          setChartRange('minute');
        }}>
        분
      </button>
      <button
        onClick={() => {
          setUnit('hour');
          setChartRange('hour');
        }}>
        시간
      </button>
      <button
        onClick={() => {
          setUnit('day');
          setChartRange('day');
        }}>
        일
      </button>
      <button
        onClick={() => {
          setUnit('weeks');
          setChartRange('weeks');
        }}>
        주
      </button>
      <button
        onClick={() => {
          setUnit('month');
          setChartRange('month');
        }}>
        월
      </button>

      {/* <dropdown overlay={menu} trigger={['click']}>
        <button>
          {unit} <span style={{ marginLeft: 8 }}>▼</span>
        </button>
      </dropdown> */}

      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => zoomReset()}>초기화</button>
    </div>
  );
};

export default App;
