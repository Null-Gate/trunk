import {
  View,
  TextInput,
  Platform,
  StyleSheet,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";

// components
import CustomText from "./CustomText";
import { Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

interface DatePickerProps {
  labelName: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  control: any;
  rules: {};
  setValue: any;
  name: string;
}

const DatePicker = ({
  labelName,
  placeholder = "",
  style,
  inputStyle,
  control,
  rules,
  setValue,
  name,
}: DatePickerProps) => {
  const [dateNow, setDateNow] = useState<Date>(new Date());
  const [visible, setVisible] = useState<boolean>(false);

  const openDatePicker = () => {
    setVisible(true);
  };

  const closeDatePicker = () => {
    setVisible(false);
  };

  const datePickHandler = ({ type }: any, selectedDate: any) => {
    if (type == "set") {
      const date = selectedDate;
      setDateNow(date);
      if (Platform.OS === "android") {
        closeDatePicker();
        const currentDate = new Date(date);
        const formattedDate = moment(currentDate).format("YYYY/MM/DD");
        setValue(name, formattedDate); // set the value for input
      }
    }

    if (type === "dismissed") {
      closeDatePicker();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setValue(name, moment(new Date()).format("YYYY/MM/DD")); // set the default value
    }, [])
  );
  return (
    <>
      <View style={style}>
        <CustomText text={labelName} textStyle={styles.title} />
        <Pressable onPress={openDatePicker}>
          {/* React Hook Form Input*/}
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[styles.input, inputStyle]}
                onChangeText={onChange}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="grey"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
              />
            )}
          />
        </Pressable>
      </View>
      {visible && (
        <DateTimePicker
          value={dateNow}
          mode="date"
          display="spinner"
          onChange={datePickHandler}
          negativeButton={{ label: "Cancel", textColor: "red" }}
        />
      )}
    </>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  input: {
    height: 60,
    color: "grey",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: "Poppins-Medium",
    letterSpacing: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#a6a6a6",
  },
  title: {
    color: "grey",
    marginBottom: 3,
  },
});
