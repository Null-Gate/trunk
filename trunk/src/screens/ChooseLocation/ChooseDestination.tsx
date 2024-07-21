import React from "react";
// Global store
import useLocationStore from "../../store/locations";

// Component
import ChooseLocationLayout from "../../components/postCreate/ChooseLocationLayout";

const ChooseOrigin = () => {
  const { destination, setDestination } = useLocationStore();
  return (
    <ChooseLocationLayout
      type="destination"
      storeData={destination}
      setStoreData={setDestination}
    />
  );
};

export default ChooseOrigin;
