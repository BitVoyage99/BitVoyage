import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
} from 'lightweight-charts';
import useNewData from './hooks/useNewData';
import ChartDataAdapter from './adapters/chartDataAdapter';

const App: React.FC = () => {
  const [unit, setUnit] = useState('minute'); // 'minute', 'hour', 'day', 'month'
  const [marketCode, setMarketCode] = useState(['KRW-BTC']);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  //24.05.04 volume histogramSeries를 추가한다.
  const histogramSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null); // 거래량 시리즈 참조 추가
  //추세선 추가
  const trendLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null); // Added for trend line
  //소켓, url 요청시 종목(market)을 전역변수화시키자.
  //const newData = useNewData();
  const newData = useNewData(marketCode);

  const lastRangeRef = useRef({ from: 0, to: 0 });

  //상단에 배너 작업할때 테스트용
  // const handleMenuClick = () => {
  //   setUnit(e.key);x
  // };
  // const timeUnits = ['minute', 'hour', 'day', 'weeks', 'month'];
  // const menu = (
  //   <menu onClick={handleMenuClick}>
  //     {timeUnits.map(unit => (
  //       <menu.Item key={unit}>{unit}</menu.Item>
  //     ))}z
  //   </menu>
  // );

  //차트 생성
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: 700,
        height: 600,
      });

      //pricescaleId를 생성
      const candleScaleId = 'candle-price-scale';
      const priceScaleId = 'upbit-price-scale';
      const volumeScaleId = 'volume-price-scale';

      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineVisible: true,
        lastValueVisible: true,
        priceFormat: { type: 'price', precision: 0, minMove: 0.01 },
        priceScaleId: candleScaleId,
      });

      //24.05.04 volume
      histogramSeriesRef.current = chartRef.current.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        //추세선 추가
        priceScaleId: volumeScaleId,
        // priceScaleId: 'right',
        // scaleMargins: {
        // top: 0.8,
        //   bottom: 0,
        // },
      });

      //추세선 추가
      trendLineSeriesRef.current = chartRef.current.addLineSeries({
        color: 'black',
        lineWidth: 1,
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

      chartRef.current.timeScale().subscribeVisibleTimeRangeChange(handleZoom);

      fetchData(200);
    }
  }, [unit]); // Ensure formatter updates when unit changes

  //1. fetchData

  //2, 소켓통신 결과 newData를 적용
  useEffect(() => {
    if (
      newData &&
      candleSeriesRef.current &&
      histogramSeriesRef.current &&
      trendLineSeriesRef.current
    ) {
      console.log('New data in component:', newData);
      candleSeriesRef.current.update({
        time: newData.timestamp,
        open: newData.open / 100000,
        high: newData.high / 100000,
        low: newData.low / 100000,
        close: newData.close / 100000,
      });

      histogramSeriesRef.current.update({
        time: newData.timestamp,
        value: newData.trade_volume,
        color: newData.close > newData.open ? '#0000FF' : '#FFC0CB',
      });
    }
  }, [newData]);

  // function prepareHistogramData(data: UpbitCandle[]): HistogramData[] {
  //   return data.map(candle => ({
  //     time: candle.candle_date_time_utc,
  //     value: candle.candle_acc_trade_volume,
  //     color: candle.trade_price > candle.opening_price ? '#0000FF' : '#FFC0CB',
  //   }));
  // }

  // histogramSeriesRef.current.setData(
  //   sortedData.map(data => ({
  //     time: data.time,
  //     value: data.volume, // 데이터 검증: volume이 정의되지 않았다면 0을 사용
  //     color: data.close > data.open ? '#0000FF' : '#FFC0CB',
  //   }))
  // );

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

  const fetchData = async (count: number) => {
    if (!candleSeriesRef.current) return;

    // const urlParams = {
    //   minute: { url: 'minutes/1', count: 60 }, // 분 데이터
    //   hour: { url: 'minutes/60', count: 48 }, // 시간 데이터
    //   day: { url: 'days', count: 30 }, // 일 데이터
    //   weeks: { url: 'weeks', count: 24 }, //주 데이터
    //   month: { url: 'months', count: 12 }, // 월 데이터
    // };
    // const selectedParam = urlParams[unit];
    //newData 로 넘어올때 parsing이 되었는지를 판단해야된다면? - 데이터 정합성
    //typeof 이나 instanceOf 으로 구분하는 함수 하나, 이에 대해 parsing 변경해줘야되는 값으로 구분 피료. - 에러 처리
    //에러 처리 또한 필요하고, 에러 처리할때 사용자가 월/주/일/시간/분 중에 어떤값을 선택했는지도 필요함. - 일관성과 가독성

    const urlParams = {
      minute: { url: 'minutes/1', count: count }, // 분 데이터
      hour: { url: 'minutes/60', count: count }, // 시간 데이터
      day: { url: 'days', count: count }, // 일 데이터
      weeks: { url: 'weeks', count: count }, //주 데이터
      month: { url: 'months', count: count }, // 월 데이터
    };

    const selectedParam = urlParams[unit];
    try {
      const response = await axios.get(
        `https://api.upbit.com/v1/candles/${selectedParam.url}?market=${marketCode}&count=${selectedParam.count}`
      );

      const adapter = new ChartDataAdapter(response.data);
      const chartData = adapter.adapt();
      candleSeriesRef.current.setData(chartData);

      // const histogramData = prepareHistogramData(sortedData);
      // histogramSeriesRef.current?.setData(histogramData);

      histogramSeriesRef.current?.setData(
        chartData.map(data => ({
          time: data.time,
          value: data.volume, // 데이터 검증: volume이 정의되지 않았다면 0을 사용
          color: data.close > data.open ? '#0000FF' : '#FFC0CB',
        }))
      );

      //추세선 추가
      trendLineSeriesRef.current?.setData(
        chartData.map(data => ({
          time: data.time,
          value: data.open / 100000,
        }))
      );
      // trendLineSeriesRef.current.setData([
      //   { time: newData.timestamp - 1, value: newData.open / 100000 },
      //   { time: newData.timestamp, value: newData.close / 100000 },
      // ]);
    } catch (error) {
      //console.error('Error fetching data:', error);
      console.warn('Error fetching data:', error);
    }
  };

  const handleZoom = () => {
    if (chartRef.current) {
      const range = chartRef.current?.timeScale().getVisibleLogicalRange();
      console.log('책정된 range:', range);
      if (
        range &&
        (range.from !== lastRangeRef.current.from ||
          range.to !== lastRangeRef.current.to)
      ) {
        const count = Math.ceil((range.to - range.from) * 1.5);
        //TODO updateData 로 변경 필요
        fetchData(count);
        lastRangeRef.current = { from: range.from, to: range.to };
      }
    }
  };

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

      <button onClick={() => setMarketCode(['KRW-ETH'])}>Load Ethereum</button>
      <button onClick={() => setMarketCode(['KRW-XRP'])}>Load Ripple</button>
      <button onClick={() => setMarketCode(['KRW-ADA'])}>Load Cardano</button>
    </div>
  );
};

export default App;
