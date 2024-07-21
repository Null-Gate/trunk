import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";

// react navigation
import { useNavigation } from "@react-navigation/native";

// components
import ImageContainer from "../components/ImageContainer";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

// styles
import { GlobalStyles } from "../constants/styles";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { signUpProps } from "../utils/types";

const SignupScreen = () => {
  const { handleSubmit, control } = useForm<signUpProps>();

  const { mutateAsync: signUpMutation, isPending } = useMutation({
    mutationFn: signUp,
  });

  const onSubmit = async (data: signUpProps) => {
    try {
      await signUpMutation(data);
      navigation.navigate("Login");
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
              text="Create Account"
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
              paddingVertical: 35,
              paddingHorizontal: 20,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              position: "absolute",
              bottom: 0,
            }}
          >
            {/* start username */}
            <CustomInput
              title="Username"
              name="username"
              control={control}
              rules={{
                required: "Username is required",
              }}
              placeholder="Linus"
              style={{ marginBottom: 20 }}
            />
            {/* end username */}

            {/* start fullname */}
            <CustomInput
              title="Fullname"
              name="fullname"
              control={control}
              rules={{
                required: "Fullname is required",
              }}
              placeholder="Linus Walker"
              style={{ marginBottom: 20 }}
            />
            {/* end fullname */}

            {/* start password */}
            <CustomInput
              title="Password"
              name="password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              secureTextEntry
              placeholder="XXXXXX"
              style={{ marginBottom: 20 }}
            />
            {/* end password */}

            <View>
              {/* start login btn */}
              <CustomButton
                title={isPending ? "Loading..." : "SIGN UP"}
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
                title="LOG IN"
                onPress={() => {
                  navigation.navigate("Login");
                }}
                style={[styles.button, styles.loginBtn]}
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

export default SignupScreen;

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
  loginBtn: {
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
