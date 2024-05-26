import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const StatusDetail = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text>{item.category}</Text>
        </View>
        <Text>{item.date}</Text>
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
  },
});
