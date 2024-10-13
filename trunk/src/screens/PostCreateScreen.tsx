import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useForm, FieldValues } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import DatePicker from "../components/DatePicker";
import ImageContainer from "../components/ImageContainer";
import CustomButton from "../components/CustomButton";
import CustomImagePicker from "../components/CustomImagePicker";

import useLocationStore from "../store/locations";
import useUserStore from "../store/userStore";
import { createPost } from "../api/postCreate";

const PostCreateScreen = () => {
  const navigation = useNavigation<any>();
  const { origin, destination, resetLocationData } = useLocationStore();
  const { token, setToken } = useUserStore();
  const { control, handleSubmit, setValue, reset } = useForm();
  const [resetImage, setResetImage] = useState(false); // when submit is success reset the image input

  // Create Post Function
  const { mutateAsync: createPackageForm, isPending } = useMutation({
    mutationFn: createPost,
  });

  const resetFormData = () => {
    reset(); // Form inputs in create tab
    setResetImage(true); // Image input
    resetLocationData(); // store data
  };

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    try {
      const formData = new FormData();
      // Assuming data.package_pic contains an image file
      formData.append("package_pic", {
        uri: data.package_pic[0].uri, // For React Native (file uri)
        type: data.package_pic[0].mimeType || "image/jpeg", // Image MIME type
        name: data.package_pic[0].fileName || `image_${Date.now()}.jpg`, // File name
      });
      formData.append("package_name", data.package_name);
      formData.append("pkg_details", data.pkg_details);
      formData.append("cper_weight", data.cper_weight);
      formData.append("cper_amount", data.cper_amount);
      formData.append("date_to_go", data.date_to_go);
      formData.append("to_where_town", data.to_where.description);
      formData.append("to_where_lat", data.to_where.lat);
      formData.append("to_where_lng", data.to_where.lng);
      formData.append("from_where_town", data.from_where.description);
      formData.append("from_where_lat", data.from_where.lat);
      formData.append("from_where_lng", data.from_where.lng);

      const result = await createPackageForm({
        token,
        body: formData,
      });

      // If success
      if (result) {
        setToken(result.msg); // change token for another route
        resetFormData();
        navigation.navigate("NewFeed");
        setResetImage(false);
        console.log("success");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  // set the value for location from store
  useEffect(() => {
    setValue("from_where", origin);
    setValue("to_where", destination);
  }, [origin, destination]);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        {/* Image Picker */}
        <CustomImagePicker
          name="package_pic"
          control={control}
          resetImage={resetImage}
          title="Photos"
        />

        {/* Locations */}
        <View style={styles.section}>
          <CustomText text="Locations" textStyle={styles.sectionTitle} />
          {/* Warning text */}
          <View style={styles.iconRow}>
            <Ionicons
              name={
                origin && destination
                  ? "checkmark-circle-outline"
                  : "alert-circle-outline"
              }
              size={18}
              color={origin && destination ? "green" : "orange"}
            />
            <CustomText
              text={
                origin && destination
                  ? "Location is selected"
                  : "Please select a location to proceed"
              }
              textStyle={{
                fontSize: 12,
                color: origin && destination ? "green" : "orange",
              }}
            />
          </View>

          {/* Location Image */}
          <TouchableOpacity
            style={[
              styles.locationButton,
              { borderColor: !origin ? "#a6a6a6" : "green" },
            ]}
            onPress={() => navigation.navigate("ChooseLocations")}
          >
            <ImageContainer
              imageSource={require("../assets/images/map.png")}
              imageContainerStyle={styles.imageContainer}
            />
          </TouchableOpacity>
        </View>

        {/* Package Name */}
        <CustomInput
          title="Package Name"
          name="package_name"
          control={control}
          rules={{ required: "Package Name is required" }}
          placeholder="Myint Chin"
          style={styles.input}
        />

        <View style={styles.row}>
          {/* Weight */}
          <CustomInput
            title="Weight"
            name="cper_weight"
            control={control}
            rules={{ required: "Weight is required" }}
            placeholder="0"
            style={styles.halfInput}
          />
          {/* Amount */}
          <CustomInput
            title="Amount"
            name="cper_amount"
            control={control}
            rules={{ required: "Amount is required" }}
            placeholder="0"
            style={styles.halfInput}
          />
        </View>

        {/* Date Picker */}
        <DatePicker
          labelName="Date"
          control={control}
          setValue={setValue}
          name="date_to_go"
          rules={{ required: "Date is required" }}
          style={styles.input}
        />

        {/* Description */}
        <CustomInput
          title="Description"
          name="pkg_details"
          control={control}
          rules={{ required: "Description is required" }}
          placeholder="Package Ka Bar Nyar Poh"
          style={styles.input}
          inputStyle={styles.textArea}
        />

        {/* Submit Btn */}
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          textStyle={styles.buttonText}
          title={isPending ? "Loading..." : "Create"}
          disabled={isPending}
        />
      </ScrollView>
    </SafeAreaProvider>
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
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: "grey",
    marginBottom: 2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  locationButton: {
    borderRadius: 5,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 100,
  },
  input: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInput: {
    width: "48%",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    marginBottom: 30,
    paddingVertical: 10,
  },
  buttonText: {
    textAlign: "center",
  },
});
