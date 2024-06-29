import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    ImageSourcePropType,
    ViewStyle, 
    StyleProp
} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type ImageContainer = {
    imageContainerStyle?: StyleProp<ViewStyle>,
    imageSource: ImageSourcePropType
}

const ImageContainer = ({
    imageContainerStyle = {},
    imageSource
}: ImageContainer) => {
    return (
        <View style={[styles.imageContainer, imageContainerStyle]}>
            <Image
                style={styles.iamge}
                source={imageSource}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
    },
    iamge: {
        position: "absolute",
        width: "100%",
        height: "100%",
    }
});

export default ImageContainer;