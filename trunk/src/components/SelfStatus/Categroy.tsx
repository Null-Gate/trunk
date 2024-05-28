import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Categroy = ({category}) => {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
};

export default Categroy;

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: "#9B1806",
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  categoryText: {
    color: "#FFFBE8",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});
