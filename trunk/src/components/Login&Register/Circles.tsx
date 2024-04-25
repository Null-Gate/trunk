import { 
    StyleSheet,
    Dimensions
} from "react-native";

import Circle from "./Circle";

const windowWidth = Dimensions.get('window').width;

const topRightCircleDiameter = windowWidth * .8;
const topLeftCircleDiameter = windowWidth * .5;
const bottomLeftCircleDiameter = windowWidth * .25;
const bottomRightCircleDiameter = windowWidth * .1;

const Circles = () => {
    return (
        <>
            <Circle
                diameter={topRightCircleDiameter}
                circleStyle={styles.topRightCircle}
            />
            <Circle
                diameter={topLeftCircleDiameter}
                circleStyle={styles.topLeftCircle}
            />
            <Circle
                diameter={bottomLeftCircleDiameter}
                circleStyle={styles.bottomLeftCircle}
            />
            <Circle
                diameter={bottomRightCircleDiameter}
                circleStyle={styles.bottomRightCircle}
            />
        </>
    )
};

const styles = StyleSheet.create({
    topRightCircle: {
        position: "absolute",
        top: -(topRightCircleDiameter * 0.4),
        right: -(topRightCircleDiameter * 0.2),
        zIndex: 2
    },
    topLeftCircle: {
        position: "absolute",
        top: -(topLeftCircleDiameter * 0.4),
        left: -(topLeftCircleDiameter * 0.4)
    },
    bottomLeftCircle: {
        position: "absolute",
        bottom: -(bottomLeftCircleDiameter * 0.2),
        left: -(bottomLeftCircleDiameter * 0.2)
    },
    bottomRightCircle: {
        position: "absolute",
        bottom: bottomLeftCircleDiameter * 0.8,
        left: bottomLeftCircleDiameter * 0.8
    },
})

export default Circles;