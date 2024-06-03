import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalStyles } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";

const MapScreen = () => {
  const navigation = useNavigation();
  const [sheetIndex, setIndex] = useState<number>();
  // ref
  const MapRef = useRef<MapView>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    setIndex(index);
  }, []);

  const INITIAL_REGION = {
    latitude: 16.826111566733648,
    longitude: 96.13035812250988,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const focusMap = () => {
    MapRef.current.animateCamera(
      { center: INITIAL_REGION, zoom: 15 },
      { duration: 2000 }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={[styles.map]}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        ref={MapRef}
      >
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude,
            longitude: INITIAL_REGION.longitude,
          }}
        />
      </MapView>

      <TouchableOpacity onPress={focusMap} style={styles.focusBtn}>
        <Entypo name="location" size={20} color={"black"} />
      </TouchableOpacity>

      <BottomSheet
        index={1}
        snapPoints={["12%", "30%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Destination */}
          <View style={styles.destinationContainer}>
            <View>
              <Entypo name="location-pin" size={20} />
              <View
                style={{
                  borderRightWidth: 2,
                  borderStyle: "dotted",
                  height: 25,
                  width: 11,
                }}
              ></View>
              <Entypo name="location-pin" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Yangon</Text>
              </View>
              <View style={{ height: 20 }}></View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Mandalay
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>2d</Text>
            </View>
          </View>
          {/* Driver Profile */}
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
          {/* Car Status */}
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
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  focusBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 100,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 5,
  },
  profileContainer: {
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
});
