import { 
    View,
    StyleSheet
} from "react-native";

import { GlobalStyles } from "../../constants/styles";

interface CircleProps {
    diameter: number,
    circleStyle: object
}

const Circle = ({ diameter, circleStyle }: CircleProps) => {
    const radius = diameter / 2;
    const cStyle = {
        width: diameter,
        height: diameter,
        borderRadius: radius,
        ...circleStyle
    }
    return (
        <View style={[styles.circle, cStyle]} />
    );
};

const styles = StyleSheet.create({
    circle: {
        backgroundColor: GlobalStyles.colors.primaryColor,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
    },
});

export default Circle;