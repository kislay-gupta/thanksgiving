import { create } from 'zustand'

interface FeedStore {
  shouldRefetch: boolean
  setShouldRefetch: (value: boolean) => void
}

export const useFeedStore = create<FeedStore>((set) => ({
  shouldRefetch: false,
  setShouldRefetch: (value) => set({ shouldRefetch: value }),
}))