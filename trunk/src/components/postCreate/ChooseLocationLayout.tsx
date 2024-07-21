import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Global styles
import { GlobalStyles } from "../../constants/styles";

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";

// Components
import MapContainer from "./MapContainer";
import GooglePlaceAutoCompleteInput from "../GooglePlaceAutoCompleteInput";
import CustomButton from "../CustomButton";
import CustomText from "../CustomText";
import { ChooseLoationsProps } from "../../utils/types";

type ChooseLocationLayoutProps = {
  type: "origin" | "destination";
  storeData: ChooseLoationsProps | null;
  setStoreData: (data: ChooseLoationsProps) => void;
};

const windowHeight = Dimensions.get("window").height;

const ChooseLocationLayout: React.FC<ChooseLocationLayoutProps> = ({
  setStoreData,
  type,
  storeData,
}) => {
  const navigation = useNavigation<any>();
  const [searchDisabled, setSearchDisabled] = useState(false);
  const isOrigin = type === "origin";

  const navigateNextRoute = () => {
   return navigation.navigate(isOrigin ? "ChooseDestination" : "Create");
  };

  return (
    <>
      <View style={styles.topContainer}>
        {/* Back Btn */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </Pressable>
        {/* google input */}
        <GooglePlaceAutoCompleteInput
          setStoreData={setStoreData}
          searchDisabled={searchDisabled}
        />
      </View>

      <MapContainer isChooseFromMap={searchDisabled} type={type} />

      <View style={styles.bottomContainer}>
        {/* Choose from map btn */}
        <TouchableOpacity
          onPress={() => {
            setSearchDisabled(!searchDisabled);
          }}
          style={styles.chooseMapContainer}
        >
          <CustomText
            text={searchDisabled ? "Back to Search" : "Choose from map"}
            textStyle={{ textAlign: "center", fontSize: 14, fontWeight: "100" }}
          />
          <Fontisto
            name={searchDisabled ? "search" : "map"}
            size={14}
            color="black"
          />
        </TouchableOpacity>
        {/* Submit Btn */}
        <View style={{ paddingHorizontal: 10 }}>
          {/* Title and Desc */}
          <View>
            <CustomText text={isOrigin ? "From" : "To"} />
            <ScrollView horizontal contentContainerStyle={{paddingVertical:5}}>
              <CustomText
                text={
                  storeData?.description ===
                  `${isOrigin ? "Start" : "End"} of location`
                    ? "Location is selected"
                    : storeData?.description
                    ? storeData.description
                    : `Choose ${type}`
                }
                textStyle={{ color: "gray",width:'auto' }}
              />
            </ScrollView>
          </View>
          <CustomButton
            style={[
              styles.customBtn,
              {
                backgroundColor: storeData
                  ? GlobalStyles.colors.primaryColor
                  : "#ddd",
              },
            ]}
            textStyle={{ textAlign: "center" }}
            disabled={!storeData}
            title={`Confirm ${type}`}
            onPress={navigateNextRoute}
          />
        </View>
      </View>
    </>
  );
};

export default ChooseLocationLayout;

const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  chooseMapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#33333320",
  },
  customBtn: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bottomContainer: {
    height: windowHeight * 0.20,
    paddingBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    gap: 10,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
