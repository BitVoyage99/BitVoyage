import React, { useEffect, useRef, useState } from 'react';
import useFetchMarketCode from '../hook/useFetchMarketCode';
import useStore from '../stores/store';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

const useWebSocketTicker = targetMarketCodes => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    if (targetMarketCodes.length === 0) {
      return;
    }

    socket.current = new WebSocket(SOCKET_URL);
    socket.current.binaryType = 'arraybuffer';

    const socketOpenHandler = () => {
      setIsConnected(true);
      const requestMessage = JSON.stringify([
        { ticket: 'test' },
        { type: 'ticker', codes: targetMarketCodes.map(code => code.market) },
        { format: 'DEFAULT' },
      ]);
      socket.current.send(requestMessage);
    };

    const socketMessageHandler = event => {
      const newData = JSON.parse(
        new TextDecoder('utf-8').decode(new Uint8Array(event.data))
      );

      setTickerData(prevData => {
        const existingIndex = prevData.findIndex(
          item => item.code === newData.code
        );
        if (existingIndex > -1) {
          // Replace the existing data with the new data
          const updatedData = [...prevData];
          updatedData[existingIndex] = newData;
          return updatedData;
        }
        // If it's a new data, add it to the array
        return [...prevData, newData];
      });
    };

    socket.current.addEventListener('open', socketOpenHandler);
    socket.current.addEventListener('message', socketMessageHandler);

    return () => {
      if (socket.current) {
        socket.current.close();
        setIsConnected(false);
      }
    };
  }, [targetMarketCodes]);

  return { isConnected, tickerData };
};

const CoinList = () => {
  const { isLoading, marketCodes } = useFetchMarketCode({ debug: true });
  const { isConnected, tickerData } = useWebSocketTicker(marketCodes);
  // console.log('marketCodes???? ', marketCodes);
  const { socketData, setSelectedCoin, selectedCoin } = useStore();
  // console.log(selectedCoin);

  // console.log('???tickerData??? ', tickerData);

  const prevTickerData = usePrevious(tickerData);

  if (isLoading) {
    return <div>Loading market codes...</div>;
  }

  function formatTradePriceToMillions(tradePrice) {
    const MILLION = 1000000;
    const tradePriceInMillions = Math.floor(tradePrice / MILLION);

    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    });

    const formattedPrice = formatter.format(tradePriceInMillions);

    return `${formattedPrice} 백만`;
  }

  function handleClickCoin(e) {
    console.log('coin clicked!');
    const currentTarget = marketCodes.filter(
      code => code.market === e.currentTarget.id
    );
    setSelectedCoin(currentTarget);
    // console.log('selectedCoin', selectedCoin[0].market);
    // console.log('selectedCoin', selectedCoin);
  }

  /* 
    const clickCoinHandler = (evt) => {
    const currentTarget = marketCodes.filter(
      (code) => code.market === evt.currentTarget.id
    );
    setSelectedCoin(currentTarget);
  };

  */

  /*  
// 아이콘 용 임시
const LogoImage = marketCode => {
    // console.log('marketCode??? ', marketCode);
    const coinSymbol = marketCode.split('-')[1];
    const logoImageUrl = `https://static.upbit.com/logos/${coinSymbol}.png`;

    // return <img src={logoImageUrl} alt={`${coinSymbol} 로고`} />;
    return logoImageUrl;
  };
 */

  function getColorClass(changeType) {
    switch (changeType) {
      case 'RISE':
        return 'text-red-500';
      case 'FALL':
        return 'text-blue-500';
      default:
        return 'text-black';
    }
  }

  function getChangeDirection(currentTicker, prevTicker) {
    if (!prevTicker) return null; // No previous data, can't compare

    const currentSignedChange = currentTicker.signed_change_price;
    const prevSignedChange = prevTicker.signed_change_price;

    // console.log(
    //   `Current: ${currentSignedChange}, Previous: ${prevSignedChange}`
    // );

    if (currentSignedChange > prevSignedChange) {
      return 'increased';
    } else if (currentSignedChange < prevSignedChange) {
      return 'decreased';
    } else {
      return 'unchanged';
    }
  }

  return (
    <div className="sticky top-18 bg-white h-screen w-full overflow-hidden max-w-xl mx-auto">
      <h1>{isConnected ? 'Connected' : 'Disconnected'}</h1>
      <h3 className="sr-only">코인 리스트</h3>
      <div className="flex w-full border-b border-gray-200">
        <input
          type="search"
          className="flex-1 border-none p-1 pl-3 text-sm placeholder-gray-500 font-bold"
          placeholder="코인명/심볼검색"
        />
        <button className="w-8 h-8 bg-no-repeat bg-[url('https://cdn.upbit.com/images/bg.e801517.png')] bg--83px_2px" />
      </div>
      <div className="flex justify-between items-center bg-white w-full h-8 border-b border-gray-200 text-sm font-bold text-gray-600">
        <div className="w-12 pl-2 text-left">한글명</div>
        <div className="flex-1 text-right pr-2">현재가</div>
        <div className="flex-1 text-right pr-2">전일 대비</div>
        <div className="w-1/4 text-right pr-3">거래대금</div>
      </div>

      <ul className="h-5/6 overflow-y-auto">
        {tickerData.map((ticker, index) => {
          const prevTicker = prevTickerData?.find(t => t.code === ticker.code);
          const changeDirection = getChangeDirection(ticker, prevTicker);
          const changeClass =
            changeDirection === 'increased'
              ? 'border border-solid border-rose-500'
              : changeDirection === 'decreased'
                ? 'border border-solid border-blue-500'
                : '';

          const selectedClass =
            selectedCoin[0].market === ticker.code ? 'bg-gray-200' : '';

          return (
            <li
              className={`border-b border-gray-200 ${selectedClass} hover:bg-gray-200`}
              key={index}
              id={ticker.code}
              onClick={handleClickCoin}>
              <button className="flex justify-between items-center w-full h-full text-left">
                {/* 아이콘 */}
                {/* <img src={LogoImage(ticker.code)} alt={` 로고`} /> */}
                {/* <i
                className={`inline-block w-5 h-5 bg-[url(${LogoImage(ticker.code)})] bg-cover ml-1 mr-4`}></i> */}
                {/* <i
                className={`inline-block w-5 h-5 bg-[url('https://static.upbit.com/logos/${ticker.market.split('/')[0]}.png')] bg-cover ml-1 mr-4`}></i> */}
                <div className="flex flex-col justify-center w-1/5 min-w-[55px]">
                  <strong className="block text-sm font-bold">
                    {
                      marketCodes.filter(code => code.market === ticker.code)[0]
                        .korean_name
                    }
                  </strong>
                  <span className="block text-xs">
                    {/* {
                    marketCodes.filter(code => code.market === ticker.code)[0]
                      .market
                  } */}
                    {ticker.code}
                  </span>
                </div>
                <div className={`${changeClass}`}>
                  {/* <div className={`border border-solid ${changeClass}`}> */}
                  {/* <div className={`border-b border-sky-500  ${changeClass}`}> */}
                  <strong
                    className={`block w-1/5 min-w-[55px] text-right align-middle text-sm font-bold ${getColorClass(ticker.change)}  `}>
                    {ticker.trade_price.toLocaleString('ko-KR')}
                  </strong>
                </div>
                <div
                  className={`flex flex-col justify-center w-1/5 min-w-[55px] text-right ${getColorClass(ticker.change)}`}>
                  <span className={`text-xs `}>
                    {ticker.signed_change_rate > 0 ? '+' : null}
                    {(ticker.signed_change_rate * 100).toFixed(2)}%
                  </span>
                  <span className="text-xs">
                    {ticker.signed_change_price.toLocaleString('ko-KR')}
                  </span>
                </div>
                <span className="flex flex-col justify-center text-xs w-1/4 text-right">
                  {formatTradePriceToMillions(ticker.acc_trade_price_24h)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(CoinList);
