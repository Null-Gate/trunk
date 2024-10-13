import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Pressable,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

// react navigation
import { useNavigation } from "@react-navigation/native";

// styles
import { GlobalStyles } from "../constants/styles";

// components
import Slide from "../components/onBoarding/Slide";
import CustomButton from "../components/CustomButton";

import Svg, { Circle, G, Path } from "react-native-svg";
import Delivery from "../components/onBoarding/Delivery";
import CustomText from "../components/CustomText";

const windowWidth = Dimensions.get("window").width;

// dummy data
const slides = [
  {
    id: "1",
    image: require("../assets/images/delivery.png"),
    title: "Kargate",
    content:
      "Stay updated with real-time tracking of your packages from dispatch to delivery.",
  },
  {
    id: "2",
    image: require("../assets/images/location.png"),
    title: "Kargate",
    content:
      "Stay updated with real-time tracking of your packages from dispatch to delivery.",
  },
  {
    id: "3",
    image: require("../assets/images/signup.png"),
    title: "Kargate",
    content: "Keep an eye on your car's journey and status in real-time.",
  },
];

const OnBoardingScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();

  const updateCurrentSlideIndex = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const navigateLogin = () => {
    navigation.navigate("Login");
  };

  const handleNextPress = () => {
    if (currentSlideIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (currentSlideIndex + 1),
        animated: true,
      });
    } else {
      navigateLogin();
    }
  };

  useEffect(() => {
    console.log(currentSlideIndex);
  }, [currentSlideIndex]);

  const indicatorWidth = scrollX.interpolate({
    inputRange: slides.map((_, i) => i * windowWidth),
    outputRange: slides.map((_, i) =>
      i === currentSlideIndex ? windowWidth * 0.34 : windowWidth * 0.29
    ),
  });

  return (
    <View style={styles.container}>
      {/* start slide indicators */}
      <View style={styles.indicatorsContainer}>
        {slides.map((_, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  width: indicatorWidth,
                  backgroundColor: "#fff",
                },
              ]}
            ></Animated.View>
          );
        })}
      </View>
      {/* end slide indicators */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: updateCurrentSlideIndex }
        )}
        scrollEventThrottle={16}
      >
        {slides.map((item, index) => {
          return (
            <View key={index}>
              <Slide
                image={item.image}
                title={item.title}
                content={item.content}
              />
            </View>
          );
        })}
      </ScrollView>
      {/* start footer */}
      <View style={styles.footer}>
        <CustomButton
          title={
            currentSlideIndex === slides.length - 1 ? "Get Started" : "Next"
          }
          onPress={handleNextPress}
          style={styles.btn}
          textStyle={{ fontSize: 16 }}
        />
      </View>
      {/* end footer */}
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primaryColor,
  },
  indicatorsContainer: {
    width: windowWidth,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    top: 50,
    gap: 5,
  },
  indicator: {
    height: 6,
    width: windowWidth * 0.29,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
  },
  footer: {
    width: windowWidth,
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 15,
  },
  btn: {
    height: 50,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
