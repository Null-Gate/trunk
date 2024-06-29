import { 
    Text, 
    StyleSheet,
    TextStyle,
    StyleProp
} from 'react-native';
import React from 'react';

interface CustomTextProps {
    text: string,
    textStyle?: StyleProp<TextStyle>
}

const CustomText = ({
    text,
    textStyle = {}
}: CustomTextProps) => {
  return (
    <Text style={[styles.customText, textStyle]}>
        {text}
    </Text>
  )
}

export default CustomText;

const styles = StyleSheet.create({
    customText: {
        fontFamily: "Poppins-Medium",
        color: "#000",
        fontSize: 14,
        flexWrap: "wrap"
    }
})