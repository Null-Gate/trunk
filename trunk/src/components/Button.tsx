import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";

interface ButtonProps {
  title: string;
  btnStyle?: object;
  active: boolean;
  handlePress?: (value: string) => void;
}

const Button: React.FC<ButtonProps> = ({
  active,
  handlePress,
  title,
  btnStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress(title)}
      style={[styles.default, !active && styles.inActive, btnStyle]}
    >
      <Text style={[styles.defaultText, !active && styles.inActiveText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  default: {
    elevation: 8,
    backgroundColor: GlobalStyles.colors.primaryColor,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    borderRadius: 2,
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  defaultText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  inActive: {
    backgroundColor: "#eeeff3",
  },
  inActiveText: {
    color: "black",
  },
});
