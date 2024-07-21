import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import React, { ReactNode } from "react";

// components
import CustomText from "./CustomText";

// styles
import { GlobalStyles } from "../constants/styles";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  disabled?: boolean;
}

const CustomButton = ({
  title,
  onPress = () => {},
  style,
  textStyle = {},
  children,
  disabled,
}: CustomButtonProps) => {

  return (
    <Pressable
      disabled={disabled}
      android_ripple={{ color: "#ccc" }}
      style={[styles.buttonContainer, style]}
      onPress={onPress}
    >
      <CustomText textStyle={[{ color: "#fff" }, textStyle]} text={title} />
      {children}
    </Pressable>
  );
};


export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: GlobalStyles.colors.primaryColor,
    borderRadius: 5,
  },
});
