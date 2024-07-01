import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native'
import React, { useState } from 'react'

// icons
import { Ionicons } from '@expo/vector-icons';

// components
import CustomText from './CustomText';

interface CustomPasswordInputProps {
    title: string,
    value: string,
    onChangeText: any,
    placeholder: string,
    style?: StyleProp<ViewStyle>
}

const CustomPasswordInput = ({
    title,
    value,
    onChangeText,
    placeholder,
    style = {}
}: CustomPasswordInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisible = () => {
        setIsPasswordVisible(prev => !prev);
    }
    return (
        <View>
            <CustomText 
                text={title}
                textStyle={styles.title}
            />
            <View style={[styles.container, style]}>
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
        </View>
    )
}

export default CustomPasswordInput

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F2F2F2",
        paddingRight: 40,
        borderRadius: 5,
        marginBottom: 15,
        position: "relative",
        overflow: "hidden",
    },
    title: {
        color: "grey",
        marginBottom: 3
    },
    input: {
        height: 60,
        color: "grey",
        fontFamily: "Poppins-Medium",
        letterSpacing: 1,
        paddingLeft: 10
    },
    button: {
        position: "absolute",
        top: 18,
        right: 10,
    }
})