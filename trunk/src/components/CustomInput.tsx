import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState } from "react";

// icons
import { Ionicons } from "@expo/vector-icons";

// components
import CustomText from "./CustomText";
import { Control, Controller } from "react-hook-form";

interface CustomInputProps {
  control: Control<any>;
  title: string;
  name: string;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  secureTextEntry?: boolean;
  rules?: {};
  editable?: boolean;
}

const CustomInput = ({
  control,
  title,
  name,
  rules,
  placeholder,
  style,
  inputStyle,
  multiline = false,
  editable = true,
  secureTextEntry,
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<
    boolean | undefined
  >(secureTextEntry);

  const togglePasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        return (
          <View style={style}>
            <CustomText text={title} textStyle={styles.title} />

            <TextInput
              style={[
                styles.input,
                inputStyle,
                error && { borderColor: "red" },
              ]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={placeholder}
              placeholderTextColor="grey"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={multiline}
              editable={editable}
              secureTextEntry={isPasswordVisible}
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={togglePasswordVisible}
                style={styles.button}
              >
                {isPasswordVisible ? (
                  <Ionicons name="eye-off" size={24} color="grey" />
                ) : (
                  <Ionicons name="eye" size={24} color="grey" />
                )}
              </TouchableOpacity>
            )}

            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  title: {
    color: "grey",
    marginBottom: 3,
  },
  input: {
    backgroundColor: "#F2F2F2",
    paddingRight: 40,
    borderRadius: 5,
    marginBottom: 15,
    position: "relative",
    overflow: "hidden",
    height: 60,
    color: "grey",
    fontFamily: "Poppins-Medium",
    letterSpacing: 1,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  button: {
    position: "absolute",
    top: 45,
    right: 10,
  },
  errorText: {
    color: "red",
  },
});
