import axios from 'axios'; // HTTP 요청을 위해 axios를 가져옵니다.
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

//하드코딩된 업비트 분캔들 response를 lightweight-charts에 연결 테스트
interface UpbitCandle {
  market: string;
  candle_date_time_utc: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  unit: number;
}
/*
// Hardcoded data array
const data: UpbitCandle[] = [
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T05:00:00',
    opening_price: 95385000,
    high_price: 95500000,
    low_price: 95210000,
    trade_price: 95210000,
    timestamp: 1713679199649,
    candle_acc_trade_price: 5662004340.05579,
    candle_acc_trade_volume: 59.36954697,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T06:00:00',
    opening_price: 95213000,
    high_price: 95460000,
    low_price: 95120000,
    trade_price: 95230000,
    timestamp: 1713682798017,
    candle_acc_trade_price: 7690354527.12303,
    candle_acc_trade_volume: 80.70167268,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T07:00:00',
    opening_price: 95235000,
    high_price: 95309000,
    low_price: 95000000,
    trade_price: 95250000,
    timestamp: 1713686399671,
    candle_acc_trade_price: 11639306840.51962,
    candle_acc_trade_volume: 122.33718961,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T08:00:00',
    opening_price: 95250000,
    high_price: 95400000,
    low_price: 94944000,
    trade_price: 94944000,
    timestamp: 1713689999107,
    candle_acc_trade_price: 9957928361.93603,
    candle_acc_trade_volume: 104.68674247,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T09:00:00',
    opening_price: 94942000,
    high_price: 95000000,
    low_price: 94622000,
    trade_price: 94903000,
    timestamp: 1713693599977,
    candle_acc_trade_price: 13963034149.43408,
    candle_acc_trade_volume: 147.27755886,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T10:00:00',
    opening_price: 94903000,
    high_price: 94990000,
    low_price: 94549000,
    trade_price: 94853000,
    timestamp: 1713697199206,
    candle_acc_trade_price: 14911361444.09317,
    candle_acc_trade_volume: 157.38345045,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T11:00:00',
    opening_price: 94849000,
    high_price: 95485000,
    low_price: 94827000,
    trade_price: 95420000,
    timestamp: 1713700797318,
    candle_acc_trade_price: 16109661422.40164,
    candle_acc_trade_volume: 169.12329111,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T12:00:00',
    opening_price: 95329000,
    high_price: 95520000,
    low_price: 94910000,
    trade_price: 94998000,
    timestamp: 1713704399412,
    candle_acc_trade_price: 12407876311.58096,
    candle_acc_trade_volume: 130.24680872,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T13:00:00',
    opening_price: 94998000,
    high_price: 95412000,
    low_price: 94793000,
    trade_price: 94866000,
    timestamp: 1713707999609,
    candle_acc_trade_price: 10816360034.52755,
    candle_acc_trade_volume: 113.77984311,
    unit: 60,
  },
  {
    market: 'KRW-BTC',
    candle_date_time_utc: '2024-04-21T14:00:00',
    opening_price: 94855000,
    high_price: 95000000,
    low_price: 94844000,
    trade_price: 94846000,
    timestamp: 1713711043743,
    candle_acc_trade_price: 4602189190.86122,
    candle_acc_trade_volume: 48.48780662,
    unit: 60,
  },
];

// const App: React.FC = () => {
//   const chartContainerRef = useRef<HTMLDivElement>(null); // Reference to the div where the chart will be rendered

//   useEffect(() => {
//     if (chartContainerRef.current) {
//       // Ensures the div is mounted before attempting to create a chart
//       const chart = createChart(chartContainerRef.current, {
//         width: 700,
//         height: 400,
//       }); // Creates the chart with specified dimensions
//       const candleSeries = chart.addCandlestickSeries(); // Adds a candlestick series to the chart
//       //Maps over the data array to format it for the candlestick series
//       const chartData = data.map(candle => ({
//         //이렇게 할지 일자 데이터가 제대로 안들어가 빈화면이 표시가 됨.
//         //time: candle.candle_date_time_utc as unknown as Time, // Converts UTC string to Time type (make sure to handle time conversion appropriately)
//         time: Math.floor(
//           new Date(candle.candle_date_time_utc).getTime() / 1000
//         ),
//         open: candle.opening_price,
//         high: candle.high_price,
//         low: candle.low_price,
//         close: candle.trade_price,
//       }));
//       candleSeries.setData(chartData); // Sets the formatted data to the series
//     }
//   }, []);

//   return <div ref={chartContainerRef} />; // Renders a div that will contain the chart
// };
// export default App;
*/

const App: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (chartContainerRef.current) {
        const chart = createChart(chartContainerRef.current, {
          width: 700,
          height: 400,
        });
        const candleSeries = chart.addCandlestickSeries();

        try {
          const response = await axios.get(
            'https://api.upbit.com/v1/candles/minutes/60?market=KRW-BTC&count=10'
          );
          console.log('API Response:', response.data); // API 응답 로그

          const chartData = response.data
            .map((candle: UpbitCandle) => ({
              time: Math.floor(
                new Date(candle.candle_date_time_utc).getTime() / 1000
              ),
              open: candle.opening_price,
              high: candle.high_price,
              low: candle.low_price,
              close: candle.trade_price,
            }))
            .sort((a, b) => a.time - b.time); // 시간 순으로 데이터 정렬

          candleSeries.setData(chartData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData(); // fetchData 함수 실행
  }, []);

  return <div ref={chartContainerRef} />;
};

export default App;

// import { createChart } from 'lightweight-charts';
// import './App.css'; // TradingView의 lightweight-charts 라이브러리에서 createChart를 가져옵니다.

// interface CoinoneTrade {
//   timestamp: string; // Coinone에서 거래 항목의 구조를 정의합니다.
//   price: string;
// }

// const App: React.FC = () => {
//   const chartContainerRef = React.useRef<HTMLDivElement>(null); // 차트가 렌더링될 div 요소를 담을 ref를 생성합니다.

//   useEffect(() => {
//     // 컴포넌트가 마운트될 때 데이터를 가져오고 차트를 설정하기 위해 useEffect를 사용합니다.
//     if (chartContainerRef.current) {
//       // ref가 요소에 연결되었는지 확인합니다.
//       const chart = createChart(chartContainerRef.current, {
//         width: 800,
//         height: 600,
//       }); // 지정된 크기로 차트를 초기화합니다.
//       const lineSeries = chart.addLineSeries(); // 데이터를 나타낼 선 시리즈를 추가합니다.

//       axios.get('https://api.coinone.co.kr/trades/?currency=BTC') // Coinone에서 BTC에 대한 거래 데이터를 가져옵니다.
//         .then(response => {
//           const data = response.data.completeOrders as CoinoneTrade[]; // 응답에서 거래 데이터를 추출합니다.
//           const chartData = data.map(trade => ({
//             time: trade.timestamp as unknown as number, // TradingView에서 필요한 형식으로 데이터를 매핑하고, 타임스탬프를 변환합니다.
//             value: parseFloat(trade.price), // 문자열 가격을 부동 소수점 숫자로 변환합니다.
//           }));
//           lineSeries.setData(chartData); // 차트의 선 시리즈에 형식화된 데이터를 설정합니다.
//         })
//         .catch(error => console.error('Coinone 데이터 가져오기 오류:', error)); // 요청이 실패하면 오류를 로그합니다.
//     }
//   }, []); // 빈 의존성 배열은 이 효과가 초기 렌더링 후 한 번만 실행되도록 보장합니다.

//   return (
//     <div ref={chartContainerRef} /> // TradingView 차트를 포함할 div를 렌더링합니다.
//   );
// };

// export default App; // 다른 애플리케이션 부분에서 사용할 수 있도록 컴포넌트를 내보냅니다.
