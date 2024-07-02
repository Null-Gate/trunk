import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { mapStyle } from "../constants/mapStyle";

const locations = [
  {
    type: "Owner",
    coordinate: { latitude: 16.8261, longitude: 96.1304 },
    title: "Origin",
    description: "Start Point",
  },
  {
    type: "Owner",
    coordinate: { latitude: 21.9489, longitude: 96.0885 },
    title: "Destination",
    description: "End Point",
  },
  {
    type: "User1",
    coordinate: { latitude: 17.0424, longitude: 96.1288 },
    title: "User1Origin",
    description: "Start Point",
  },
  {
    type: "User1",
    coordinate: { latitude: 20.8813, longitude: 95.8609 },
    title: "User1Destination",
    description: "End Point",
  },
  {
    type: "User2",
    coordinate: { latitude: 21.4337, longitude: 96.1075 },
    title: "User2Origin",
    description: "Start Point",
  },
  {
    type: "User2",
    coordinate: { latitude: 21.7359, longitude: 96.1039 },
    title: "User2Destination",
    description: "End Point",
  },
];

const routes = {
  MainRoute: [
    { latitude: 16.8261, longitude: 96.1304 },
    { latitude: 21.9489, longitude: 96.0885 },
  ],
  User1Route: [
    { latitude: 17.0424, longitude: 96.1288 },
    { latitude: 20.8813, longitude: 95.8609 },
  ],
  User2Route: [
    { latitude: 21.4337, longitude: 96.1075 },
    { latitude: 21.7359, longitude: 96.1039 },
  ],
};

const MapContainer = ({ sheetIndex, MapRef }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  const getPinColor = (type) => {
    switch (type) {
      case "Owner":
        return "#9B1806";
      case "User1":
        return "#FFFBE8";
      case "User2":
        return "#0000ff";
      default:
        return "#000";
    }
  };

  const MapDirections = ({ origin, destination }) => (
    <MapViewDirections
      origin={origin}
      destination={destination}
      apikey={process.env.GOOGLE_MAP_KEY}
      strokeWidth={3}
      strokeColor="hotpink"
    />
  );

  return (
    <>
      <MapView
        style={[styles.map, { height: sheetIndex === 1 ? "85%" : "90%" }]}
        initialRegion={
          location && {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        customMapStyle={mapStyle}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
        ref={MapRef}
      >
        {locations.map((loc, i) => (
          <Marker
            key={`${loc.coordinate.latitude}-${loc.coordinate.longitude}-${loc.type}`}
            title={loc.title}
            description={loc.description}
            coordinate={loc.coordinate}
            identifier={loc.title}
            pinColor={getPinColor(loc.type)}
          />
        ))}
        {Object.values(routes).map((route, i) => (
          <MapDirections
            key={`${route[0].latitude}-${route[0].longitude}-${route[1].latitude}-${route[1].longitude}`}
            origin={route[0]}
            destination={route[1]}
          />
        ))}
      </MapView>
    </>
  );
};

export default MapContainer;

const styles = StyleSheet.create({
  map: {
    width: "100%",
  },
});
