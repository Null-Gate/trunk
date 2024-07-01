import {
    View,
    TextInput,
    StyleSheet,
    StyleProp,
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
    style?: StyleProp<TextStyle>
}

const CustomInput = ({
    title,
    value,
    onChangeText,
    placeholder,
    style
}: CustomInputProps) => {
    return (
        <View>
            <CustomText 
                text={title}
                textStyle={styles.title}
            />
            <TextInput
                style={[styles.input, style]}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="grey"
                autoCapitalize="none"
                autoCorrect={false}
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
        fontFamily: "Poppins-Medium",
        letterSpacing: 1,
        borderRadius: 5
    },
    title: {
        color: "grey",
        marginBottom: 3
    },
})