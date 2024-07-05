import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
//import useNewData from './hooks/useNewData';
import ChartDataAdapter from '@/adapters/chartDataAdapter';
import { TickerData } from '@/types/coin';

interface Props {
  selectedTicker?: TickerData;
}

const Chart = ({ selectedTicker }: Props) => {
  const [unit, setUnit] = useState('minute'); // 'minute', 'hour', 'day', 'month'
  const [marketCode, setMarketCode] = useState(['KRW-BTC']);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  //24.05.04 volume histogramSeries를 추가한다.
  const histogramSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null); // 거래량 시리즈 참조 추가
  //추세선 추가
  const trendLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null); // Added for trend line
  const previousMinuteRef = useRef<number | null>(null); // 이전 분 단위 타임스탬프 저장
  const newData = selectedTicker;
  console.log('data: ' + selectedTicker);

  const lastRangeRef = useRef({ from: 0, to: 0 });

  //pricescaleId를 생성
  const candleScaleId = 'candle-price-scale';
  const volumeScaleId = 'volume-price-scale';
  const trendScaleId = 'trend-price-scale';

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
        width: 0,
        height: 600,
      });

      // 캔들 축
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        priceLineVisible: true,
        lastValueVisible: true,
        //tickMarkFormatter 오류로 인한 수정
        //priceFormat: { type: 'price', precision: 0, minMove: 0.01 },
        priceFormat: {
          type: 'custom',
          formatter: (price: number) => `${price.toFixed(2)}` // 가격 포맷을 달러와 소수점 두 자리로 설정
        },
        priceScaleId: candleScaleId,
      });

      //거래량 축
      //24.05.04 volume
      histogramSeriesRef.current = chartRef.current.addHistogramSeries({
        color: '#26a69a',
                //tickMarkFormatter 오류로 인한 수정
        priceFormat: {type: 'volume'},
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
        priceScaleId: trendScaleId,
        //tickMarkFormatter 오류로 인한 수정
      });

      // 캔들 축 설정
      chartRef.current.priceScale(candleScaleId).applyOptions({
        autoScale: true,
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: true,
        borderColor: '#555ffd',
      });
      // 거래량 축 설정
      chartRef.current.priceScale(volumeScaleId).applyOptions({
        autoScale: true,
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      //추세선 가격 축 설정
      chartRef.current.priceScale(trendScaleId).applyOptions({
        autoScale: true,
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: true,
        borderColor: '#555ffd',
      });

      //timeScale 축 설정
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

      //=> 각 candle, volume, trend별로 설정해야됨.
      //=>> 이렇게 설정하면 setuptooltip 마우스 Hover시 오류발생. 각각 다르게 설정해야됨 
      setupPriceScales(chartRef.current);
      //setupTooltip(chartRef.current, candleSeriesRef.current);
      setupTooltip(chartRef.current, candleSeriesRef.current as ISeriesApi<'Candlestick'>);
      setupTooltip(chartRef.current, histogramSeriesRef.current as ISeriesApi<'Histogram'>);
      setupTooltip(chartRef.current, trendLineSeriesRef.current as ISeriesApi<'Line'>);
      
      chartRef.current.timeScale().subscribeVisibleTimeRangeChange(handleZoom);
      //charthandler 설정
      fetchData(200);
    }
  }, [unit]);

  //1. fetchData
  //=> chathandler 설정
  //2, 소켓통신 결과 newData를 적용
  useEffect(() => {
    
  if (
    newData &&
    candleSeriesRef.current &&
    histogramSeriesRef.current &&
    trendLineSeriesRef.current
  ) {

    const formatTimestamp = (timestamp:number) => {
      const date = new Date(Math.floor(timestamp / 1000)); // 밀리초 단위로 변환하여 Date 객체 생성
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`; // 시간 포맷 변경
    };

  const currentMinute = Math.floor(newData.timestamp / (1000 * 60)); // 분 단위로 변환

      // 처음 데이터이거나 분이 변경된 경우 업데이트
      if (previousMinuteRef.current === null || previousMinuteRef.current !== currentMinute) {
        previousMinuteRef.current = currentMinute;


    console.log('New data in component:', newData);
    candleSeriesRef.current.update({
      //정상
      time: Math.floor(new Date(newData.timestamp).getTime() / 1000),
      //time: formatTimestamp(newData.timestamp),
      //time: new Date(newData.timestamp).toLocaleTimeString(),
      open: newData.opening_price / 100000,
      high: newData.high_price / 100000,
      low: newData.low_price / 100000,
      close: newData.trade_price / 100000,
    });

      histogramSeriesRef.current.update({
      //정상
      time: Math.floor(new Date(newData.timestamp).getTime() / 1000),
      //time: formatTimestamp(newData.timestamp),
      //time: new Date(newData.timestamp).toLocaleTimeString(),
      value: newData.trade_volume,
      color: newData.trade_price > newData.opening_price ? '#0000FF' : '#FFC0CB',
    });
    }
  }
  }, [newData]);

  function setupPriceScales(chart: IChartApi) {
     // 캔들
  chart.priceScale(candleScaleId).applyOptions({
    autoScale: true,
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
    borderVisible: true,
    borderColor: '#FF6347',
    mode: 1,  // Normal mode
  });

  // 거래량
  chart.priceScale(volumeScaleId).applyOptions({
    autoScale: true,
    scaleMargins: {
      top: 0.8,
      bottom: 0.1,
    },
    borderVisible: true,
    borderColor: '#4682B4',
    mode: 2,  // Percentage mode
  });

  // 추세선
  chart.priceScale(trendScaleId).applyOptions({
    autoScale: true,
    scaleMargins: {
      top: 0.4,
      bottom: 0.15,
    },
    borderVisible: true,
    borderColor: '#3CB371',
    mode: 1,  // Normal mode
  });
  }

  //setuptooltip 다형성 지원
  function setupTooltip(
    chart: IChartApi,
    series: ISeriesApi<'Candlestick'> | ISeriesApi<'Histogram'> | ISeriesApi<'Line'>
  ) {
    const tooltip = document.createElement('div');
    tooltip.className = 'floating-tooltip';
    tooltip.style.position = 'fixed';
    document.body.appendChild(tooltip);
  
    chart.subscribeCrosshairMove(param => {
      if (!param.time || param.point === undefined || !param.seriesPrices || !series) {
        tooltip.style.display = 'none';
        return;
      }
  
      const priceData = param.seriesPrices.get(series);
      if (!priceData) {
        tooltip.style.display = 'none';
        return;
      }
  
      let content = `Date: ${param.time ? new Date(param.time * 1000).toLocaleString() : 'N/A'}<br>`;
      if (series.seriesType() === 'Candlestick') {
        content += `Open: ${priceData.open.toFixed(2)}<br>
                    High: ${priceData.high.toFixed(2)}<br>
                    Low: ${priceData.low.toFixed(2)}<br>
                    Close: ${priceData.close.toFixed(2)}<br>`;
      } else if (series.seriesType() === 'Histogram' || series.seriesType() === 'Line') {
        content += `Value: ${priceData.value.toFixed(2)}<br>`;
      }
  
      tooltip.innerHTML = content;
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


    const selectedParam = {
      minute: { url: 'minutes/1', count: count }, // 분 데이터
      hour: { url: 'minutes/60', count: count }, // 시간 데이터
      day: { url: 'days', count: count }, // 일 데이터
      weeks: { url: 'weeks', count: count }, //주 데이터
      month: { url: 'months', count: count }, // 월 데이터
    }[unit];
    try {
      const response = await axios.get(
        `https://api.upbit.com/v1/candles/${selectedParam.url}?market=${marketCode}&count=${selectedParam.count}`
      );

      const adapter = new ChartDataAdapter(response.data);
      const chartData = adapter.adapt();
      const adjustedData = chartData.map(data => ({
        time: data.time,
        value: data.volume * 100000,  // Adjusting the volume data
        color: data.close > data.open ? '#0000FF' : '#FFC0CB',
      }));
      candleSeriesRef.current.setData(chartData);
      histogramSeriesRef.current?.setData(adjustedData);

      // histogramSeriesRef.current?.setData(
      //   chartData.map(data => ({
      //     time: data.time,
      //     value: data.volume * 1000, // 데이터 검증: volume이 정의되지 않았다면 0을 사용
      //     color: data.close > data.open ? '#0000FF' : '#FFC0CB',
      //   }))
      // );

      //추세선 추가
      trendLineSeriesRef.current?.setData(
        chartData.map(data => ({
          time: data.time,
          value: data.open,
        })) 
      );

    } catch (error) {
      //console.error('Error fetching data:', error);
      console.warn('Error fetching data:', error);
    }
  };

  const handleZoom = () => {

    const range = chartRef.current?.timeScale().getVisibleLogicalRange();
    console.log('책정된 range:', range);
    if (
      range &&
      (range.from !== lastRangeRef.current.from ||
        range.to !== lastRangeRef.current.to)
    ) {
      const count = Math.ceil((range.to - range.from) * 1.5);
      //TODO updateData 로 변경 필요
      //charthandler 설정
      fetchData(count);
      lastRangeRef.current = { from: range.from, to: range.to };
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

  const handleUnitChange = (event: string) => {
    setUnit(event);
    setChartRange(event);
  };
  const setTimeScaleFormatter = (event: string) => {
    if (chartRef.current) {
      chartRef.current.timeScale().applyOptions({
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: time => {
          const date = new Date(time * 1000);
          if (['day', 'weeks', 'month'].includes(event)) {
            return date.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
            // } else {
            //   // minute or hour
            //   return date.toLocaleTimeString(undefined, {
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     hour12: false,
            //   });
            // }
          } else if (['hour'].includes(event)) {
            return date.toLocaleTimeString(undefined, {
              hour: '2-digit',
              hour12: false,
            });
          } else if (['minute'].includes(event)) {
            return date.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          } else {
            return date.toLocaleString();
          }
        },
      });
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
        case 'hour':
          // 예제대로 2시간 값만 표시하게 설정
          // For minute and hour, just set a range from now to 2 hours later as example
          // from = new Date();
          // to = new Date(now.getTime() + 2 * 3600 * 1000);
          //24시간으로 설정
          // Set range for the next 24 hours
          from = new Date(); // Current time
          to = new Date(from.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
          break;
        case 'minute':
          from = new Date(); // Current time
          to = new Date(from.getTime() + 60 * 60 * 1000); // 60 minutes later
          break;
        default:
          from = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
          to = new Date(from.getTime() + 24 * 60 * 60 * 1000 - 1); // Just before midnight
          break;
      }

      // if (chartRef.current) {
      //   chartRef.current.timeScale().setVisibleRange({
      //     from: from.getTime() / 1000,
      //     to: to.getTime() / 1000,
      //   });
      //   // Adjust the time scale to show each tick as one day
      //   chartRef.current.timeScale().applyOptions({
      //     timeVisible: true,
      //     tickMarkFormatter: time => {
      //       const date = new Date(time * 1000);
      //       return date.toLocaleDateString(undefined, {
      //         month: 'short',
      //         day: 'numeric',
      //       });
      //     },
      //   });
      // }
      if (chartRef.current) {
        chartRef.current.timeScale().setVisibleRange({
          from: from.getTime() / 1000,
          to: to.getTime() / 1000,
        });
        setTimeScaleFormatter(event);
      }
    }
  };
  return (
    <div>
      <div ref={chartContainerRef} />
      <button onClick={() => handleUnitChange('minute')}>Minute</button>
      <button onClick={() => handleUnitChange('hour')}>Hour</button>
      <button onClick={() => handleUnitChange('day')}>Day</button>
      <button onClick={() => handleUnitChange('weeks')}>Week</button>
      <button onClick={() => handleUnitChange('month')}>Month</button>

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
export default Chart;
