import { create } from 'zustand';

interface Coin {
  market: string;
  korean_name: string;
  english_name: string;
}

interface StoreState {
  marketCodes: Coin[];
  selectedCoin: Coin[]; // 객체 맞는지 확인 필요!
}

interface StoreActions {
  setMarketCodes: (codes: Coin[]) => void;
  setSelectedCoin: (coin: Coin[]) => void;
}

const useStore = create<StoreState & StoreActions>(set => ({
  marketCodes: [],
  selectedCoin: [
    {
      //객체 맞는지 확인 필요!
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ],
  setMarketCodes: codes => set({ marketCodes: codes }),
  setSelectedCoin: coin => set({ selectedCoin: coin }),
}));
/* const useStore = create<StoreState & StoreActions>(set => ({
  marketCodes: [],
  socketData: [],
  selectedCoin: [
    {
      //객체 맞는지 확인 필요!
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ],
  setMarketCodes: codes => set({ marketCodes: codes }),
  setSocketData: data =>
    set(state => ({ socketData: [...state.socketData, ...data] })),
  setSelectedCoin: coin => set({ selectedCoin: coin }),
})); */

export default useStore;
