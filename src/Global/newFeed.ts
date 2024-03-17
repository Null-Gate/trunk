import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store and wrap it with the persist middleware
const useUserStore = create(
  persist(
    (set) => ({
      newFeed: [],
      setNewFeed: (data: unknown) => set({ newFeed: data }),
    }),
    {
      name: "user-info-store",
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
