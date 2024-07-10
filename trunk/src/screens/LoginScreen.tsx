import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";

// react navigation
import { useNavigation } from "@react-navigation/native";

// styles
import { GlobalStyles } from "../constants/styles";

// components
import ImageContainer from "../components/ImageContainer";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { FieldValues, useForm } from "react-hook-form";
import useUserStore from "../store/userStore";
import { User } from "../utils/types";

const windowHeight = Dimensions.get("window").height;

// 20 + 150
const LoginScreen = () => {
  const { setUserData } = useUserStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "Wai",
      password: "12345",
    },
  });

  const onSubmit = async (data: Partial<FieldValues>) => {
    const result = await login(data);
    if (result.msg) {
      Alert.alert(result.msg);
      return;
    }
    setUserData(result);
    navigation.navigate("BottomTab");
  };

  const navigation = useNavigation<any>();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <ImageContainer
              imageSource={require("../assets/images/logo.jpg")}
              imageContainerStyle={{
                width: 150,
                height: 150,
              }}
            />
            <CustomText
              text="Welcome Back"
              textStyle={{
                color: "#fff",
                fontSize: 25,
                letterSpacing: 2,
              }}
            />
          </View>
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              paddingVertical: 50,
              paddingHorizontal: 20,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              position: "absolute",
              bottom: 0,
            }}
          >
            <CustomInput
              title="Username"
              name="username"
              control={control}
              rules={{
                required: "Username is required",
              }}
              placeholder="John Doe"
              style={{ marginBottom: 20 }}
            />
            <CustomInput
              title="Password"
              name="password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              placeholder="XXXXXX"
              style={{ marginBottom: 25 }}
              secureTextEntry
            />
            <CustomButton
              title="LOG IN"
              onPress={handleSubmit(onSubmit)}
              style={styles.loginButton}
            />
            <CustomText
              text="Forgot Password?"
              textStyle={{
                color: "#424242",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 15,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primaryColor,
  },
  loginButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
