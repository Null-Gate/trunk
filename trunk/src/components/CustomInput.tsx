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
    multiline?: boolean,
    editable?: boolean
}

const CustomInput = ({
    title,
    value,
    onChangeText,
    placeholder,
    style,
    inputStyle,
    multiline = false,
    editable = true
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
                editable={editable}
            />
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({
    input: {
        height: 60,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontFamily: "Poppins-Medium",
        letterSpacing: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#a6a6a6"
    },
    title: {
        color: "grey",
        marginBottom: 3
    },
})