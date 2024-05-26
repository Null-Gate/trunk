import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ListItem = ({ item }) => {
  const { category, title, date, desc } = item;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("StatusDetail", { item })}
      activeOpacity={0.6}
      style={styles.container}
    >
      <View style={styles.leftGroup}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
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
