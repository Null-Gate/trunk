import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    ImageSourcePropType
} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type ImageContainer = {
    imageContainerStyle?: object,
    imageSource: ImageSourcePropType
}

const ImageContainer = ({
    imageContainerStyle = {
        width: windowWidth,
        height: windowHeight
    },
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
        elevation: 4,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    iamge: {
        position: "absolute",
        width: "100%",
        height: "100%",
    }
});

export default ImageContainer;