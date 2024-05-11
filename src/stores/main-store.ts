import { create } from 'zustand';

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
