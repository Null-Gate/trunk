import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useStore } from "../../store/locationStore";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../CustomButton";

const ChooseOrigin = () => {
  const { setOrigin, origin } = useStore();
  const navigation = useNavigation<any>();

  return (
    <View>
      <Text>Choose The Origin</Text>

      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        enablePoweredByContainer={false}
        minLength={2}
        onPress={(data, details = null) => {
          setOrigin({
            location: details.geometry.location,
            description: data.description,
          });
        }}
        query={{
          key: process.env.GOOGLE_MAP_KEY,
          language: "en",
        }}
        styles={{
          container: {
            flex: 0,
          },
        }}
      />

      {/* Change Route */}

      <CustomButton
        title="Choose Destination"
        handlePress={() => navigation.navigate("Destination")}
      />
    </View>
  );
};

export default ChooseOrigin;
