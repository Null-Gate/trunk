import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import CustomButton from "../components/CustomButton";
import MapViewDirections from "react-native-maps-directions";
import { mapStyle } from "../constants/mapStyle";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChooseOrigin from "../components/Directions/ChooseOrigin";
import { useStore } from "../store/locationStore";
import ChooseDesti from "../components/Directions/ChooseDesti";
import { useNavigation } from "@react-navigation/native";

const ChooseDestination = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation<any>();
  const MapRef = useRef<MapView>(null);

  const [location, setLocation] = useState(null); // User loaction
  const [errorMsg, setErrorMsg] = useState("");

  const { origin, destination } = useStore();

  // Request Permission for user loaction
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  // Fit The Screen to two Marker point
  useEffect(() => {
    if (!origin || !destination) return;
    // Delay to ensure state updates
    setTimeout(() => {
      if (MapRef.current) {
        MapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
          edgePadding: { top: 20, bottom: 20, right: 20, left: 20 },
          
        });
      }
    }, 100); // Adjust the timeout duration as needed
  }, [origin, destination]);

  return (
    <>
      {/* Map */}
      <MapView
        ref={MapRef}
        style={styles.mapView}
        customMapStyle={mapStyle}
        showsUserLocation
        initialRegion={
          location && {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 1000,
            longitudeDelta: 1000,
          }
        }
        toolbarEnabled={false}
      >
        {/*  Origin Marker */}
        {origin && origin.location && (
          <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            identifier="origin"
            description={origin.description}
            title="Origin"
          />
        )}

        {/* Destination Marker */}
        {destination && destination.location && (
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            identifier="destination"
            description={destination.description}
            title="Destination"
          />
        )}

        {/* Direction for two Markers */}
        {origin && origin.location && destination && destination.location && (
          <MapViewDirections
            origin={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            destination={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            apikey={process.env.GOOGLE_MAP_KEY}
            strokeColor="#991602"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Show Origin and Destination */}
      <View style={{ padding: 10 }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>Origin</Text>
          <Text>{!origin.description ? "-- --" : `${origin.description}`}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Destination</Text>
          <Text>{!destination.description ? "-- --" : `${destination.description}`}</Text>
        </View>
      </View>

      {/* Stack Screen for ChooseOrigin and ChooseDesti */}
      <View style={styles.controlsContainer}>
        <Stack.Navigator>
          <Stack.Screen
            name="Origin"
            component={ChooseOrigin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Destination"
            component={ChooseDesti}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </View>
    </>
  );
};

export default ChooseDestination;

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  mapView: {
    height: "50%",
  },
  controlsContainer: {
    height: "50%",
    gap: 20,
    padding: 10,
  },
  controlGroup: {
    gap: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    paddingVertical: 8,
  },
  confirmButton: {
    paddingVertical: 10,
    width: "100%",
  },
});
