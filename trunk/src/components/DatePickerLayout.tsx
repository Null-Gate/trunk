import {
    View,
    StyleSheet,
    Pressable,
    Platform,
    TextInput
} from "react-native";

// components
import CustomText from "./CustomText";
import DatePicker from "./DatePicker";

interface DatePickerLayoutProps {
    labelName: string,
    placeHolder?: string,
    closeDatePicker: () => void,
    openDatePicker: () => void,
    selectDate: string,
    showDatePicker: boolean,
    setChooseDate: any
}

export default function DatePickerLayout({
    labelName,
    openDatePicker,
    closeDatePicker,
    selectDate,
    showDatePicker,
    setChooseDate
}: DatePickerLayoutProps) {
    return (
        <View style={styles.inputContainer}>
            <CustomText textStyle={styles.label}>{labelName}</CustomText>
            <Pressable onPress={openDatePicker}>
                <TextInput
                    value={selectDate}
                    secureTextEntry={false}
                    keyboardType="default"
                    style={styles.inputBox}
                    editable={false}
                    placeholderTextColor={null}
                    onPressIn={Platform.OS === "ios" ? openDatePicker : () => { }}
                />
            </Pressable>

            {showDatePicker && (
                <DatePicker
                    showDatePicker={showDatePicker}
                    style={styles.datePicker}
                    setChooseDate={setChooseDate}
                    closeDatePicker={closeDatePicker}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        marginBottom: 15
    },
    label: {
        fontSize: 14,
        fontWeight: "semibold",
        marginBottom: 5
    },
    datePicker: {
        height: 200,
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginVertical: 12,
    },
    inputBox: {
        backgroundColor: "white",
        color: "black",
        borderRadius: 2,
        padding: 10,
        elevation: 3,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
