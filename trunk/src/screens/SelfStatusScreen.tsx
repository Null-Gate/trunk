import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ListItem from "../components/SelfStatus/ListItem";
import { Lists } from "../config/StatusLists";
import Button from "../components/Button";

const SelfStatusScreen = () => {
  const [data, setData] = useState([]);
  const [varient, setVarient] = useState("Current");
  const [fakeData, setFakeData] = useState("Current");
  const handlePress = (value: string) => {
    setVarient(value);
  };

  const handleFakePress = (value: string) => {
    setFakeData(value);
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
        <Button
          title="Current"
          btnStyle={styles.statusButton}
          handlePress={handlePress}
          active={varient === "Current"}
        />
        <Button
          title="History"
          btnStyle={styles.statusButton}
          handlePress={handlePress}
          active={varient === "History"}
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

      {/* Fake Data for user, driver, owner */}
      <View style={styles.fakeDataCon}>
        <Button
          title="User"
          btnStyle={styles.fakeButton}
          handlePress={handleFakePress}
          active={fakeData === "User"}
        />
        <Button
          title="Driver"
          btnStyle={styles.fakeButton}
          handlePress={handleFakePress}
          active={fakeData === "Driver"}
        />
        <Button
          title="Owner"
          btnStyle={styles.fakeButton}
          handlePress={handleFakePress}
          active={fakeData === "Owner"}
        />
      </View>
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
  fakeDataCon: {
    width: "100%",
    flexDirection: "row",
    gap: 5,
    padding:5
  },
  fakeButton: {
    flex: 1,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});
