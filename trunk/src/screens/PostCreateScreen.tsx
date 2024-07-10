import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";

// icons
import { Ionicons } from "@expo/vector-icons";

// components
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import { useForm } from "react-hook-form";
import CustomButton from "../components/CustomButton";

const windowWidth = Dimensions.get("window").width;

const PostCreateScreen = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data)
    console.log("submit");
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <CustomText
          text="Package Photos"
          textStyle={{
            color: "grey",
            marginBottom: 3,
          }}
        />
        <View
          style={{
            height: windowWidth - 80,
            borderWidth: 1.8,
            borderRadius: 15,
            borderColor: "#696969",
            borderStyle: "dashed",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="add" size={70} color="#696969" />
        </View>
      </View>

      <CustomInput
        title="Package Name"
        name="package_name"
        control={control}
        rules={{ required: true }}
        placeholder="Myint Chin"
        style={{ marginBottom: 15 }}
      />

      <CustomInput
        title="Date"
        name="date_to_go"
        control={control}
        rules={{ required: true }}
        placeholder="Myint Chin"
        style={{ marginBottom: 15 }}
      />

      <CustomInput
        title="Weight"
        name="cper_weight"
        control={control}
        rules={{ required: true }}
        placeholder="Myint Chin"
        style={{ marginBottom: 15 }}
      />

      <CustomInput
        title="Amount"
        name="cper_amount"
        control={control}
        rules={{ required: true }}
        placeholder="Myint Chin"
        style={{ marginBottom: 15 }}
      />

      <CustomInput
        title="Package Description"
        name="pkg_details"
        control={control}
        rules={{ required: true }}
        placeholder="Package Ka Bar Nyar Poh"
        style={{ marginBottom: 15 }}
        inputStyle={{
          height: 120,
          textAlignVertical: "top",
        }}
      />

      <CustomButton
        title="Create"
        style={{ marginBottom: 50 }}
        textStyle={{ textAlign: "center" }}
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  );
};

export default PostCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
});
