// 한국 마켓만 필터링하기

import { useState, useEffect } from 'react';

function useFetchMarketCode(option = { debug: false }) {
  const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

  const [isLoading, setIsLoading] = useState(true);
  const [marketCodes, setMarketCodes] = useState([]);

  const fetchMarketCodes = async () => {
    try {
      const response = await fetch(REST_API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch market codes');
      }

      const json = await response.text();
      const allMarketCodes = JSON.parse(json);

      const krwMarketCodes = allMarketCodes.filter(code =>
        code.market.startsWith('KRW')
      );

      setMarketCodes(krwMarketCodes);

      if (option.debug) {
        console.log('Market codes fetched:', krwMarketCodes);
      }
    } catch (error) {
      console.error('Error fetching market codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketCodes().catch(error => {
      console.error('Error fetching market codes:', error);
    });
  }, []);

  return { isLoading, marketCodes };
}

export default useFetchMarketCode;

/* import { useState, useEffect } from 'react';

function useFetchMarketCode(option = { debug: false }) {
  const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

  const [isLoading, setIsLoading] = useState(true);
  const [marketCodes, setMarketCodes] = useState([]);

  const fetchMarketCodes = async () => {
    try {
      const response = await fetch(REST_API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch market codes');
      }

      const json = await response.text();
      const result = JSON.parse(json);
      setMarketCodes(result);
      if (option.debug) {
        console.log('Market codes fetched:', result);
      }
    } catch (error) {
      console.error('Error fetching market codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketCodes().catch(error => {
      console.error('Error fetching market codes:', error);
    });
  }, []);

  return { isLoading, marketCodes };
}

export default useFetchMarketCode;
 */
