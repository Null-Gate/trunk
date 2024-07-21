import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";

// Icons
import Entypo from "@expo/vector-icons/Entypo";

// Plugin
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { ChooseLoationsProps } from "../utils/types";

type GoolgePlaceAutoCompleteProps = {
  setStoreData: (data: ChooseLoationsProps) => void;
  searchDisabled: boolean;
};

const GooglePlaceAutoCompleteInput: React.FC<GoolgePlaceAutoCompleteProps> = ({
  setStoreData,
  searchDisabled,
}) => {
  const inputRef = useRef<GooglePlacesAutocompleteRef>(null);

  return (
    <GooglePlacesAutocomplete
      ref={inputRef}
      placeholder="Search"
      nearbyPlacesAPI="GooglePlacesSearch"
      fetchDetails
      textInputHide={searchDisabled} // When we hit choose from map text input will hide
      debounce={400}
      enablePoweredByContainer={false}
      minLength={2}
      // If input is not empty Cross icon will appear and click it will remove text
      renderRightButton={() =>
        inputRef.current?.getAddressText() !== "" ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              backgroundColor: "#ffffff80",
              paddingHorizontal: 5,
            }}
            onPress={() => inputRef.current?.setAddressText("")}
          >
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <></>
        )
      }
      onPress={(data, details = null) => {
        if (details) {
          // It will change origin or destination store
          setStoreData({
            location: details.geometry.location,
            description: data.description,
          });
        }
      }}
      query={{
        key: process.env.GOOGLE_MAP_API,
        language: "en",
      }}
      styles={{
        flex: 1,
        position: "absolute",
      }}
      onFail={(error) => console.log(error)}
    />
  );
};

export default GooglePlaceAutoCompleteInput;
