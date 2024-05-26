import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import ListItem from "../components/SelfStatus/ListItem";
import { Lists } from "../config/StatusLists";

const SelfStatusScreen = () => {
  const [data, setData] = useState([]);
  const [varient, setVarient] = useState("History");
  const handlePress = (value: string) => {
    setVarient(value);
  };

  const filterList = () => {
    const filtered = Lists.filter((item) => item.varient === varient);
    return setData(filtered);
  };

  useEffect(() => {
    filterList();
  }, [varient]);

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <CustomButton
          title="Current"
          btnStyle={styles.statusButton}
          handlePress={handlePress}
        />
        <CustomButton
          title="History"
          btnStyle={styles.statusButton}
          handlePress={handlePress}
        />
      </View>
      {/* List */}
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flex: 1,
          gap: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      />
    </View>
  );
};

export default SelfStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
});
