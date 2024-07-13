import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native';

// styles
import { GlobalStyles } from '../constants/styles';

// components
import Slide from '../components/onBoarding/Slide';
import CustomButton from '../components/CustomButton';

const windowWidth = Dimensions.get("window").width;

// dummy datas
const slides = [
    {
        id: "1",
        image: require("../assets/images/artist.png"),
        title: "Title Bar Nyar Poh",
        content: "Seemless experience",
    },
    {
        id: "2",
        image: require("../assets/images/artist.png"),
        title: "Monitor Your Ways",
        content: "Stay updated with real-time tracking of your packages from dispatch to delivery.",
    },
    {
        id: "3",
        image: require("../assets/images/artist.png"),
        title: "Track Your Vehicle",
        content: "Keep an eye on your car's journey and status in real-time.",
    },
];

const OnBoardingScreen = () => {
    const ScrollViewRef = useRef<ScrollView>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

    const navigation = useNavigation<any>();

    const updateCurrentSlideIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / windowWidth);
        setCurrentSlideIndex(currentIndex);
    }

    const navigateLogin = () => {
        navigation.navigate("Login");
    }

    useEffect(() => {
        console.log(currentSlideIndex);
    }, [currentSlideIndex])

    return (
        <View style={styles.container}>
            {/* start slide indicators */}
            <View style={styles.indicatorsContainer}>
                {slides.map((_, index) => {
                    return (
                        <View
                            key={index}
                            style={[styles.indicator, currentSlideIndex === index && styles.activeIndicator]}
                        ></View>
                    )
                })}
            </View>
            {/* end slide indicators */}
            <ScrollView
                ref={ScrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScrollEndDrag={updateCurrentSlideIndex}
                onMomentumScrollEnd={updateCurrentSlideIndex}
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
                    )
                })}
            </ScrollView>
            {/* start footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Login"
                    onPress={navigateLogin}
                    style={styles.btn}
                    textStyle={{ fontSize: 16 }}
                />
            </View>
            {/* end footer */}
        </View>
    )
}

export default OnBoardingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.primaryColor
    },
    indicatorsContainer: {
        width: windowWidth,
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        top: 50,
        gap: 5
    },
    indicator: {
        height: 6,
        width: windowWidth * 0.29,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 5
    },
    activeIndicator: {
        backgroundColor: "#bfbfbf",
        width: windowWidth * 0.34
    },
    footer: {
        width: windowWidth,
        position: "absolute",
        bottom: 10,
        paddingHorizontal: 15
    },
    btn: {
        height: 50,
        backgroundColor: "#000",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }
})