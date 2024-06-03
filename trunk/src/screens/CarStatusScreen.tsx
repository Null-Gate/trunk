import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CarStatusScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left-circle" size={28} color={"white"} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.text, styles.title]}>
            Ashok Leyland 2820-6x4
          </Text>
          <Text style={[styles.text, styles.para]}>Power 200 hp</Text>
          <Text style={[styles.text, styles.para]}>Engine 5660</Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        
      </View>
    </View>
  );
};

export default CarStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primaryColor,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },
  text: {
    color: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 24,
  },
  para: {
    fontSize: 12,
    fontWeight: "400",
  },
  detailContainer: {
    flex: 1,
    backgroundColor: "#FFFBE8",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
});
