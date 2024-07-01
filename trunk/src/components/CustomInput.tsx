import {
    View,
    TextInput,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle
} from 'react-native'
import React from 'react'

// components
import CustomText from './CustomText'

interface CustomInputProps {
    title: string,
    value: string,
    onChangeText: any,
    placeholder: string,
    style?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
    multiline?: boolean
}

const CustomInput = ({
    title,
    value,
    onChangeText,
    placeholder,
    style,
    inputStyle,
    multiline = false
}: CustomInputProps) => {
    return (
        <View style={style}>
            <CustomText 
                text={title}
                textStyle={styles.title}
            />
            <TextInput
                style={[styles.input, inputStyle]}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="grey"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={multiline}
            />
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    input: {
        height: 60,
        color: "grey",
        backgroundColor: "#F2F2F2",
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontFamily: "Poppins-Medium",
        letterSpacing: 1,
        borderRadius: 5
    },
    title: {
        color: "grey",
        marginBottom: 3
    },
})