import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store and wrap it with the persist middleware
const useNewFeedStore = create(
  persist(
    (set) => ({
      userInfo: {},
      setUserInfo: (data: unknown) => set({ userInfo: data }),
    }),
    {
      name: "new-feed-store",
      getStorage: () => localStorage,
    }
  )
);

export default useNewFeedStore;
