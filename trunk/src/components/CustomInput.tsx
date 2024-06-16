import {
    View,
    TextInput,
    StyleSheet
} from 'react-native'
import React from 'react'

//components
import CustomText from './CustomText';

type CustomInput = {
    title: string,
    value: string,
    onChangeText: any,
    placeholder?: string,
    inputStyle?: object,
    numberOfLines?: number
}

const CustomInput = ({
    title,
    value,
    onChangeText,
    placeholder = "",
    inputStyle = {},
    numberOfLines = 1
}: CustomInput) => {
    return (
        <View style={inputStyle}>
            <CustomText textStyle={styles.title}>{title}</CustomText>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
                placeholder={placeholder}
                multiline={true}
                numberOfLines={numberOfLines}
                textAlignVertical='top'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
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
    title: {
        fontSize: 14,
        fontWeight: "semibold",
        marginBottom: 5
    }
})

export default CustomInput;