import { create } from "zustand";
import { ChooseLoationsProps } from "../utils/types";

interface FormDataState {
  origin: ChooseLoationsProps | null;
  destination: ChooseLoationsProps | null;
  setOrigin: (data: ChooseLoationsProps | null) => void;
  setDestination: (data: ChooseLoationsProps | null) => void;
  resetLocationData: () => void;
}

const useLocationStore = create<FormDataState>((set) => ({
  origin: null,
  destination: null,
  setOrigin: (data) =>
    set(() => ({
      origin: data,
    })),
  setDestination: (data) =>
    set(() => ({
      destination: data,
    })),
  resetLocationData: () => {
    set(() => ({ origin: null, destination: null }));
  },
}));

export default useLocationStore;
