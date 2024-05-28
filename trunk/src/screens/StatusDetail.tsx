import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Categroy from "../components/SelfStatus/Categroy";
import { Entypo } from "@expo/vector-icons";

const ScreenWidth = Dimensions.get("screen").width;
const ScreenHeight = Dimensions.get("screen").height;

const StatusDetail = ({ route }) => {
  const { category, title, date, destination, desc, driver } =
    route.params.item;

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Categroy category={category} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>

        <View style={styles.cardBottomContainer}>
          {/* Destination */}
          <View>
            <Text style={styles.cardInfoTitle}>From</Text>
            <Text>{destination.from}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Entypo name="location-pin" size={20} />
            <View
              style={{
                width: 100,
                height: 1,
                borderStyle: "dotted",
                borderTopWidth: 2,
              }}
            ></View>
            <Entypo name="location-pin" size={20} />
          </View>

          <View>
            <Text style={styles.cardInfoTitle}>To</Text>
            <Text>{destination.to}</Text>
          </View>
        </View>
        {/* Detail */}
        <Text style={{ fontSize: 20, fontWeight: "600", color: "#9B1806" }}>
          Detail Info
        </Text>
        <View style={styles.cardBottomContainer}>
          <Text style={styles.cardInfoTitle}>Package List</Text>
          <Text style={{ textAlign: "right", width: "60%" }}>{desc}</Text>
        </View>
        <View style={styles.cardBottomContainer}>
          <Text style={styles.cardInfoTitle}>Driver Name</Text>
          <Text style={{ textAlign: "right" }}>{driver.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default StatusDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9B1806",
  },
  cardContainer: {
    width: ScreenWidth - 30,
    height: ScreenHeight - 100,
    backgroundColor: "#FFFBE8",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
  },
  date: {
    fontWeight: "600",
    fontSize: 20,
  },
  cardBottomContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  cardInfoTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
