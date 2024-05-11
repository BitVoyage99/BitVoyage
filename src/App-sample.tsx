import { useEffect } from 'react';
import './App.css';

//TradingView 위젯 테스트
function App() {
  useEffect(() => {
    // TradingView 위젯 스크립트를 동적으로 추가합니다.
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: 'NASDAQ:AAPL', // 표시하고 싶은 주식 심볼
      width: '100%',
      height: '100%',
      locale: 'kr', // 언어 설정 (한국어)
      dateRange: '24M', // 날짜 범위
      colorTheme: 'light', // 테마 색상
      trendLineColor: 'rgba(41, 98, 255, 1)',
      underLineColor: 'rgba(41, 98, 255, 0.3)',
      isTransparent: false,
      autosize: true,
      largeChartUrl: '',
    });
    document.body.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </>
  );
}

export default App;
