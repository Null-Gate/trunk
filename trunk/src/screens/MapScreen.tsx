import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalStyles } from "../constants/styles";

const MapScreen = () => {
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
        style={[
          styles.map,
          sheetIndex === 0 ? { height: "95%" } : { height: "55%" },
        ]}
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
        snapPoints={["10%", "50%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
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
          <View>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View style={styles.imageContainer}>
                <FontAwesome5 name={"truck"} size={25} />
              </View>
              <Text style={{ fontWeight: "bold" }}>Fujo 22003399</Text>
            </View>
          </View>
          <View style={styles.profileContainer}>
            <View style={{ gap: 3 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="location-pin" size={20} />
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Yangon</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 2,
                  borderStyle: "dotted",
                  height: 25,
                  width: 11,
                }}
              ></View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="location-pin" size={20} />
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  Mandalay
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>2d</Text>
            </View>
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
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  imageContainer: {
    padding: 5,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: GlobalStyles.colors.softGrey,
  },
});
