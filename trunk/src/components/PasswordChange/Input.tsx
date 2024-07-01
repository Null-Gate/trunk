import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import React, { useState } from 'react'

// icons
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
    value: string,
    onChangeText: any,
    placeholder: string
}

const Input = ({
    value,
    onChangeText,
    placeholder
}: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisible = () => {
        setIsPasswordVisible(prev => !prev);
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="grey"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity onPress={togglePasswordVisible} style={styles.button}>
                {isPasswordVisible
                    ? <Ionicons name="eye-off" size={24} color="grey" />
                    : <Ionicons name="eye" size={24} color="grey" />
                }
            </TouchableOpacity>
        </View>
    )
}

export default Input

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
    button: {
        position: "absolute",
        top: 18,
        right: 10,
    }
})