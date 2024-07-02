import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useStore } from "../../store/locationStore";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../CustomButton";

const ChooseDesti = () => {
  const { destination, setDestination } = useStore();
  const navigation = useNavigation<any>();

  return (
    <View>
      <Text>Choose The Destination</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          setDestination({
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

      <View style={{ flexDirection: "row" }}>
        <CustomButton
          title="Back"
          handlePress={() => navigation.navigate("Origin")}
        />

        <CustomButton
          title="Confirm"
          handlePress={() => navigation.navigate("PostCreate")}
        />
      </View>
    </View>
  );
};

export default ChooseDesti;

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: "black",
    marginVertical: 10,
  },
});
