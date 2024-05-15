import { create } from 'zustand';

interface MarketState {
  market: string;
}

interface MarketActions {
  updateMarket: (market: string) => void;
}

export const useMainStore = create<MarketState & MarketActions>(set => ({
  market: 'KRW-BTC',
  updateMarket: (market: string) => set(() => ({ market })),
}));
