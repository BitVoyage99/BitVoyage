import React, { useEffect, useRef, useState, memo } from 'react';
import useFetchMarketCode from '../hook/useFetchMarketCode';
import useStore from '../stores/store';

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
      const data = JSON.parse(
        new TextDecoder('utf-8').decode(new Uint8Array(event.data))
      );
      setTickerData(prevData => [...prevData, data]);
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
  const { socketData, setSelectedCoin, selectedCoin } = useStore();

  //   console.log(tickerData);
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
    console.log('selectedCoin', selectedCoin);
  }

  /* 
    const clickCoinHandler = (evt) => {
    const currentTarget = marketCodes.filter(
      (code) => code.market === evt.currentTarget.id
    );
    setSelectedCoin(currentTarget);
  };

  */

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
        <div className="flex-1 text-right pr-2">상승률</div>
        <div className="w-1/4 text-right pr-3">거래대금</div>
      </div>
      {/* <ul>
        {tickerData.map((ticker, index) => (
          <li key={index}>
            <strong>{ticker.code}:</strong>{' '}
            {ticker.trade_price.toLocaleString()} KRW
            <div>Change: {ticker.change_rate.toFixed(2)}%</div>
            <div>Volume: {ticker.trade_volume.toLocaleString()}</div>
          </li>
        ))}
      </ul> */}
      <ul className="overflow-y-auto">
        {tickerData.map((ticker, index) => (
          <li
            className="border-b border-gray-200 bg-gray-200"
            key={index}
            id={ticker.code}
            onClick={handleClickCoin}
            selected={selectedCoin === ticker.code}>
            <button className="flex justify-between items-center w-full h-full text-left">
              {/* 아이콘 */}
              {/* <i
              className={`inline-block w-5 h-5 bg-[url('https://static.upbit.com/logos/${enCoinName.split('/')[0]}.png')] bg-cover ml-1 mr-4`}>

              </i> */}
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
              <strong
                className={`block w-1/5 min-w-[55px] text-right align-middle text-sm font-bold `}>
                {ticker.trade_price.toLocaleString('ko-KR')}
              </strong>
              <div className="flex flex-col justify-center w-1/5 min-w-[55px] text-right">
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
        ))}
      </ul>
      {/* <ul>
        <li className="w-full h-11 border-b-2 border-gray-100">
          <button className="flex justify-center items-center w-full h-full ">
            hello
          </button>
          <div className="flex  h-11">
            <strong>coin</strong>
          </div>
        </li>
      </ul> */}
    </div>
  );
};

export default React.memo(CoinList);
