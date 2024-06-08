import React, { useCallback, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalStyles } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import MapContainer from "../components/MapContainer";

const MapScreen = () => {
  const navigation = useNavigation();
  const [sheetIndex, setSheetIndex] = useState(1);
  const bottomSheetRef = useRef(null);
  const MapRef = useRef(null);

  const focusDestination = useCallback(
    (origin: string, destination: string) => {
      MapRef.current.fitToSuppliedMarkers([origin, destination], {
        edgePadding: { top: 80, bottom: 50, right: 50, left: 50 },
      });
      setSheetIndex(0);
    },
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapContainer sheetIndex={sheetIndex} MapRef={MapRef} />
      <BottomSheet
        index={sheetIndex}
        snapPoints={["13%", "30%", "50%"]}
        ref={bottomSheetRef}
        onChange={(index) => setSheetIndex(index)}
        style={{ paddingHorizontal: 10 }}
      >
        <TouchableOpacity
          onPress={() => focusDestination("Origin", "Destination")}
          style={styles.destinationContainer}
        >
          <View>
            <Entypo name="location-pin" size={20} />
            <View
              style={{
                borderRightWidth: 2,
                borderStyle: "dotted",
                height: 25,
                width: 11,
              }}
            />
            <Entypo name="location-pin" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Yangon</Text>
            </View>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Mandalay</Text>
            </View>
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>2d</Text>
          </View>
        </TouchableOpacity>
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.profileContainer}>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/profile.png")}
                  style={{ width: 35, height: 35 }}
                  resizeMode="cover"
                />
              </View>
              <Text style={{ fontWeight: "bold" }}>U Wai Linn</Text>
            </View>
            <View>
              <View
                style={[
                  styles.imageContainer,
                  { backgroundColor: GlobalStyles.colors.activeGreen },
                ]}
              >
                <Entypo name="message" size={25} color={"white"} />
              </View>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View style={styles.imageContainer}>
                <FontAwesome5 name={"truck-moving"} size={25} />
              </View>
              <Text style={{ fontWeight: "bold" }}>Ashok Leyland 2820-6x4</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("CarStatus")}>
              <View
                style={[
                  styles.imageContainer,
                  { backgroundColor: GlobalStyles.colors.activeGreen },
                ]}
              >
                <Ionicons name="settings" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => focusDestination("User1Origin", "User1Destination")}
            style={styles.packageContainer}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Package 1</Text>
            <Text>User 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => focusDestination("User2Origin", "User2Destination")}
            style={styles.packageContainer}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Package 2</Text>
            <Text>User 2</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: "100%",
    gap: 5,
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    padding: 5,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: GlobalStyles.colors.softGrey,
  },
  destinationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "#e9e9e9",
  },
  packageContainer: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});
