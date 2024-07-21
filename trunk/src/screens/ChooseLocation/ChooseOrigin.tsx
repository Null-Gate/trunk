import React from "react";

// Global Store
import useLocationStore from "../../store/locations";

// Components
import ChooseLocationLayout from "../../components/postCreate/ChooseLocationLayout";

const ChooseOrigin = () => {
  const { origin, setOrigin } = useLocationStore();
  return (
    <ChooseLocationLayout
      type="origin"
      setStoreData={setOrigin}
      storeData={origin}
    />
  );
};

export default ChooseOrigin;
