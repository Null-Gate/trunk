import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store and wrap it with the persist middleware
const useUserStore = create(
  persist(
    (set) => ({
      userInfo: {},
      setUserInfo: (data: unknown) => set({ userInfo: data }),
    }),
    {
      name: "user-info-store",
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
