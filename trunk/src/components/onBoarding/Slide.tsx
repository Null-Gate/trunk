import {
  View,
  ImageSourcePropType,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import React from "react";

// components
import ImageContainer from "../ImageContainer";
import CustomText from "../CustomText";

const windowWidth = Dimensions.get("window").width;

interface SlideProps {
  image: ImageSourcePropType;
  title: string;
  content: string;
}

const Slide = ({ image, title, content }: SlideProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={require("../../assets/images/icon.png")} />
        <View>
          <CustomText text={title} textStyle={styles.title} />
          <CustomText text={content} textStyle={styles.content} />
        </View>
      </View>
      <ImageContainer
        imageSource={image}
        imageContainerStyle={{
          width: windowWidth - 60,
          height: "30%",
          marginHorizontal: "auto",
          paddingTop: 20,
        }}
      />
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    flexDirection: "column",
    justifyContent: "center",
  },
  topContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 60,
  },
  content: {
    color: "#ffffff",
    fontSize: 18,
  },
});
