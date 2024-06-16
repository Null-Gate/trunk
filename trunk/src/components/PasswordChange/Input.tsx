import {
    View,
    TextInput,
    Pressable,
    StyleSheet
} from 'react-native'
import React from 'react'

//components
import CustomText from '../CustomText';

// icons
import { Ionicons } from '@expo/vector-icons';

type Input = {
    title: string,
    value: string,
    onChangeText: any,
    placeholder?: string,
    inputStyle?: object
}

const Input = ({
    title,
    value,
    onChangeText,
    placeholder = "",
    inputStyle = {}
}: Input) => {
    return (
        <View style={inputStyle}>
            <CustomText textStyle={styles.title}>{title}</CustomText>
            <View style={styles.inputContainer}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.input}
                    placeholder={placeholder}
                    multiline={true}
                    secureTextEntry={true}
                    textAlignVertical='top'
                />
                <Pressable style={styles.eyeIconBtn}>
                    <Ionicons name="eye" size={22} color="#636363" />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        position: "relative"
    },
    eyeIconBtn: {
        position: "absolute",
        right: 10,
        top: 12
    },
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
        letterSpacing: 1,
        paddingRight: 30
    },
    title: {
        fontSize: 14,
        fontWeight: "semibold",
        marginBottom: 5
    }
})

export default Input;