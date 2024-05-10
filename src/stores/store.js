// import create from 'zustand';
import { create } from 'zustand';

const useStore = create(set => ({
  marketCodes: [],
  setMarketCodes: codes => set({ marketCodes: codes }),
  socketData: [],
  setSocketData: data =>
    set(state => ({ socketData: [...state.socketData, ...data] })),
  selectedCoin: [
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ],
  // selectedCoin: null,
  setSelectedCoin: coin => set({ selectedCoin: coin }),
}));

/* [
  {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  },
]; */
export default useStore;

/* import create from 'zustand';

const useStore = create(set => ({
  marketCodes: [],
  setMarketCodes: codes => set({ marketCodes: codes }),
  socketData: [],
  setSocketData: data => set({ socketData: data }),
  selectedMarket: 'KRW-BTC',
  updateSelectedMarket: selectedMarket =>
    set(() => {
      selectedMarket;
    }),
}));

export default useStore;
 */
/* import { create } from 'zustand';

type State = {
  market: string;
};

type Actions = {
  updateMarket: (market: string) => void;
};

export const useMainStore = create<State & Actions>(set => ({
  market: 'KRW-BTC',
  updateMarket: (market: string) => set(() => ({ market })),
}));
 */
