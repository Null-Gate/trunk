import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type ImageContainer = {
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageSource: ImageSourcePropType;
};

const ImageContainer = ({
  imageContainerStyle = {},
  imageSource,
}: ImageContainer) => {
  return (
    <View style={[styles.imageContainer, imageContainerStyle]}>
      <Image style={styles.image} source={imageSource} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit:'contain'
  },
});

export default ImageContainer;
