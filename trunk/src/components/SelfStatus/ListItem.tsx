import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Categroy from "./Categroy";

const ListItem = ({ item }) => {
  const { category, title, date, desc, varient } = item;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (varient === "Current") {
          return navigation.navigate("Map", { item });
        }
        navigation.navigate("StatusDetail", { item });
      }}
      activeOpacity={0.6}
      style={styles.container}
    >
      <View style={styles.leftGroup}>
        <Categroy category={category} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc} numberOfLines={1}>
          {desc}
        </Text>
      </View>
      <View>
        {category !== "Package" ? (
          <Entypo name="info-with-circle" size={18} />
        ) : date ? (
          <Text style={styles.date}>{date}</Text>
        ) : (
          <Entypo name="map" size={18} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  leftGroup: {
    width: "60%",
    alignItems: "flex-start",
    gap: 3,
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  desc: {
    color: "#b5b5b5",
  },
  date: {
    fontWeight: "500",
    fontSize: 13,
  },
});
