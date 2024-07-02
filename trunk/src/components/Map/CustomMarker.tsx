import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";
import { GlobalStyles } from "../../constants/styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const CustomMarker = ({ coordinate, text, postType }) => {
  const bgColor =
    text === "Destination"
      ? GlobalStyles.colors.primaryColor
      : GlobalStyles.colors.activeGreen;
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.markerContainer} {...Marker}>
        <View style={[styles.markerLabel, { backgroundColor: bgColor }]}>
          <Text style={styles.markerLabelText}>{text}</Text>
        </View>
        {postType === "0" ? (
          <MaterialCommunityIcons name="package-down" size={28} color="black" />
        ) : (
          <FontAwesome6 name="location-dot" size={24} color="black" />
        )}
      </View>
    </Marker>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerLabel: {
    padding: 5,
    borderRadius: 5,
  },
  markerLabelText: {
    color: "white",
  },
});
