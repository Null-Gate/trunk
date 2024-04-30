import React from "react";
import {
    View,
    StyleSheet,
    Dimensions
} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type ImageContainer = {
    imageContainerStyle?: object,
    viewImage: React.JSX.Element,
}

const ImageContainer = ({
    imageContainerStyle = {
        width : windowWidth,
        height : windowHeight
    },
    viewImage
}: ImageContainer) => {
    return (
        <View style={[styles.imageContainer, imageContainerStyle]}>
            {viewImage}
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        // borderRadius: 5,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
});

export default ImageContainer;