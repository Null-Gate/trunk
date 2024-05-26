import { Pressable, View, Text, StyleSheet, Platform } from "react-native";

//styles
import { GlobalStyles } from "../constants/styles";

interface CustomButtonEntry {
  title: string;
  btnStyle?: object;
  handlePress: (value:string) => void;
}

const CustomButton = ({
  title,
  btnStyle = {},
  handlePress,
}: CustomButtonEntry) => {
  return (
    <View style={[styles.buttonContainer, btnStyle]}>
      <Pressable
        onPress={()=>handlePress(title)}
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) =>
          pressed && Platform.OS === "ios"
            ? styles.buttonPressed
            : styles.button
        }
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
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
  button: {
    width: "100%",
    borderRadius: 2,
  },
  buttonPressed: {
    width: "100%",
    opacity: 0.5,
    borderRadius: 2,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default CustomButton;
