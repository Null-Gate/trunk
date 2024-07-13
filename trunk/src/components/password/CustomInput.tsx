import {
    View,
    TextInput,
    StyleSheet
} from 'react-native'
import React from 'react'

interface InputProps {
    value: string,
    onChangeText: any,
    placeholder: string
}

const CustomInput = ({
    value,
    onChangeText,
    placeholder
}: InputProps) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
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
    container: {
        backgroundColor: "#ededed",
        paddingRight: 40,
        borderRadius: 10,
        marginBottom: 15,
        position: "relative",
        overflow: "hidden",
    },
    input: {
        height: 60,
        color: "grey",
        fontFamily: "Poppins-Medium",
        letterSpacing: 1,
        paddingLeft: 10,
    },
})