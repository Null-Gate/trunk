import { create } from "zustand";

type locationData = {
  location: null | { lat: number; lng: number };
  description: string;
};

type locationState = {
  origin: locationData;
  destination: locationData;
  setOrigin: (data: locationData) => void;
  setDestination: (data: locationData) => void;
};

export const useStore = create<locationState>((set) => ({
  origin: {
    location: null,
    description: "",
  },
  destination: {
    location: null,
    description: "",
  },
  setOrigin: (data) => set((state) => ({ origin: data })),
  setDestination: (data) => set((state) => ({ destination: data })),
}));
