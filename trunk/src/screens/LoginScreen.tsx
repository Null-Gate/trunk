import React, { useEffect } from "react";
import {

	View,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
         Alert,
	Platform,
	Pressable
} from 'react-native'
import React, { useState, useEffect } from 'react'


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
import { useForm } from "react-hook-form";
import useUserStore from "../store/userStore";
import { loginProps } from "../utils/types";

const windowHeight = Dimensions.get("window").height;

// 20 + 150
const LoginScreen = () => {
  const { setUserData } = useUserStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<loginProps>();

  const { mutateAsync: loginMutation, isPending } = useMutation({
    mutationFn: login,
  });

  const onSubmit = async (data: loginProps) => {
    try {
      const loginData = await loginMutation(data);
      setUserData(loginData);
      navigation.navigate("BottomTab");
    } catch (error: any) {
      Alert.alert(error.msg);
    }
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

						<View style={{
							flexDirection: "row",
							justifyContent: "flex-end",
							marginBottom: 20
						}}>
							<Pressable
								onPress={() => { navigation.navigate("PasswordForgot") }}
							>
								<CustomText
									text='forgot Password ?'
									textStyle={{
										fontSize: 13,
										color: "#424242",
										textDecorationLine: "underline",
										textDecorationColor: GlobalStyles.colors.softGrey
									}}
								/>
							</Pressable>
						</View>

            <View>
              {/* start login btn */}
              <CustomButton
                title={isPending ? "Loading..." : "LOG IN"}
                onPress={handleSubmit(onSubmit)}
                style={styles.button}
              />
              {/* end login btn */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.line}></View>
                <CustomText
                  text="OR"
                  textStyle={{
                    fontSize: 12,
                    marginVertical: 5,
                  }}
                />
                <View style={styles.line}></View>
              </View>
              {/* start signup btn */}
              <CustomButton
                title="SIGN UP"
                onPress={() => {
                  navigation.navigate("Signup");
                }}
                style={[styles.button, styles.signupBtn]}
                textStyle={{ color: GlobalStyles.colors.primaryColor }}
              />
              {/* end signup btn */}
            </View>
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
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  signupBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primaryColor,
  },
  line: {
    width: "40%",
    height: 1,
    backgroundColor: GlobalStyles.colors.softGrey,
  },
});
