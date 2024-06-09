import { Pressable, View, Text, StyleSheet, Platform } from "react-native";

//styles
import { GlobalStyles } from "../constants/styles";

interface CustomButtonEntry {
  title: string;
  btnStyle?: object;
  handlePress?: () => void;
  textStyle?: object;
}

const CustomButton = ({
  title,
  btnStyle = {},
  textStyle = {},
  handlePress = () => {},
}: CustomButtonEntry) => {

    return (
        <View>
            <Pressable
                android_ripple={{ color: "#ccc" }}
                style={[styles.buttonContainer, btnStyle]}
                onPress={handlePress}
            >
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            </Pressable>
        </View>
    )
}

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
        paddingHorizontal: 10
    },
    buttonText: {
        fontSize: 14,
        color: "white",
        fontWeight: "bold",
        alignSelf: "center",
    }
})


export default CustomButton;
