import React, { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import moment from "moment";

import Modal from "react-native-modal";

const windowWidth = Dimensions.get("window").width;

interface DatePickerProps {
  showDatePicker : boolean,
  closeDatePicker : () => void,
  setChooseDate : any,
  style : object
}

export default ({
  showDatePicker,
  closeDatePicker,
  setChooseDate,
  style
} : DatePickerProps) => {
  const [dateNow, setDateNow] = useState(new Date());
  

  const datePickHandler = ( {type} : any, selectedDate: any) => {  
    if (type == "set") {
      const date = selectedDate;
      setDateNow(date);
      if (Platform.OS === "android") {
        closeDatePicker();
        const currentDate = new Date(date);
        const formattedDate = moment(currentDate).format('YYYY/MM/DD');
        setChooseDate(formattedDate);
      }
    } 
    
    if(type === "dismissed") {
      closeDatePicker();
    }
  };


  const confirmIOSDate = () => {    
    const currentDate = new Date(dateNow);
    const formattedDate = moment(currentDate).format('YYYY/MM/DD');
    
    setChooseDate(formattedDate);
    closeDatePicker();
  };
  return (
    <>
      {Platform.OS === "ios" ? (
        <Modal
          isVisible={showDatePicker}
          onBackdropPress={closeDatePicker}
          animationInTiming={500}
          animationOutTiming={500}
          avoidKeyboard={true}
          onBackButtonPress={closeDatePicker}
          style={{
            margin: 0,
            flex: 1,
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.buttonContainer}>
                <Pressable onPress={confirmIOSDate} style={styles.button}>
                  <Text>Done</Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={dateNow}
                mode="date"
                display="spinner"
                onChange={datePickHandler}
                style={style}
                textColor="black"
              />
            </View>
          </View>
        </Modal>
      ) : (
        <DateTimePicker
          value={dateNow}
          mode="date"
          display="spinner"
          onChange={datePickHandler}
          negativeButton={{label: 'Cancel', textColor: 'red'}}
          style={style}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "white",
  },
  modalContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: windowWidth,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
  },
  innerContainer: {
    paddingHorizontal: 20,
  },
});
