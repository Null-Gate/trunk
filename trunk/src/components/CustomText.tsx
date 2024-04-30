import { 
    Text,
    StyleSheet
} from "react-native";

interface CustomTextProps {
    children: string,
    textStyle?: object
}
const CustomText = ({
    children,
    textStyle = {}
} : CustomTextProps) => {
    return (
        <Text style={[styles.text, textStyle]}>{children}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#000",
        fontSize: 16
    }
})

export default CustomText;