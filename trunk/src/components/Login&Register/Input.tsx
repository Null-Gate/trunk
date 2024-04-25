import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";

import React from "react";

interface InputEntry {
    title: string;
    value: string;
    onChangeValue: any;
    icon: React.JSX.Element;
    inputStyle?: object;
    [key: string]: any; 
}

const Input = ({
    title,
    value,
    onChangeValue,
    icon,
    inputStyle = {},
    ...props
}: InputEntry) => {
    return (
        <View style={[styles.inputContainer, inputStyle]}>
            <View style={styles.titleContainer}>
                {icon}
                <Text>{title}</Text>
            </View>
            <TextInput
                style={styles.input}
                onChangeText={onChangeValue}
                value={value}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: "white",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: "black",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
    },
    titleContainer: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10
    },
    input: {
        marginTop: 8
    },
})

export default Input;