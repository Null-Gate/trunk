import { StyleSheet } from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// Fake Data for Driver and Owner
const Location = [
  {
    type: "Owner",
    coordinate: {
      latitude: 16.826111566733648,
      longitude: 96.13035812250988,
    },
    title: "Origin",
    description: "Start Point",
  },
  {
    type: "Owner",
    coordinate: {
      latitude: 21.94893745302357,
      longitude: 96.08852235463286,
    },
    title: "Destination",
    description: "End Point",
  },
  {
    type: "User1",
    coordinate: {
      latitude: 17.042428710919555,
      longitude: 96.12878120397383,
    },
    title: "User1Origin",
    description: "Start Point",
  },
  {
    type: "User1",
    coordinate: {
      latitude: 20.881312699222843,
      longitude: 95.86086683066863,
    },
    title: "User1Destination",
    description: "End Point",
  },
  {
    type: "User2",
    coordinate: {
      latitude: 21.433729341389252,
      longitude: 96.10751692235945,
    },
    title: "User2Origin",
    description: "Start Point",
  },
  {
    type: "User2",
    coordinate: {
      latitude: 21.7359429298148,
      longitude: 96.10394794148395,
    },
    title: "User2Destination",
    description: "End Point",
  },
];

const MapContainer = ({ sheetIndex, MapRef }) => {
  const INITAIL_REGION = {
    latitude: 16.826111566733648,
    longitude: 96.13035812250988,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const getPinColor = (type: string) => {
    switch (type) {
      case "Owner":
        return "#9B1806";
      case "User1":
        return "#FFFBE8";
      case "User2":
        return "#0000ff";
    }
  };

  return (
    <>
      <MapView
        style={[styles.map, { height: sheetIndex === 1 ? "85%" : "90%" }]}
        initialRegion={INITAIL_REGION}
        provider={PROVIDER_GOOGLE}
        toolbarEnabled={false}
        ref={MapRef}
      >
        {Location.map((data) => (
          <Marker
            key={`${data.coordinate.latitude}-${data.coordinate.longitude}-${data.type}`}
            title={data.title}
            description={data.description}
            coordinate={data.coordinate}
            identifier={data.title}
            pinColor={getPinColor(data.type)}
          />
        ))}
      </MapView>

      {/* <TouchableOpacity onPress={focusMap} style={styles.focusBtn}>
        <Entypo name="location" size={20} color={"black"} />
      </TouchableOpacity> */}
    </>
  );
};

export default MapContainer;

const styles = StyleSheet.create({
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
});
