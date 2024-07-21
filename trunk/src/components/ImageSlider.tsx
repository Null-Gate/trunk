import {
    Pressable,
    View,
    FlatList,
    Animated,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ViewToken
} from 'react-native';

import React, { useRef, useState, useEffect } from 'react';

//components
import ImageContainer from './ImageContainer';
import CustomText from './CustomText';
import SlidePagination from './SlidePagination';

// icons
import { Entypo } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

type Slide = {
    id: string,
    url: string
}

type ImageSlider = {
    slides: Slide[],
    option?: boolean,
    removeImage?: (index: number) => void,
    imageSliderWidth?: number,
    imageSliderHeight?: number,
}

const ImageSlider = ({
    slides,
    option,
    removeImage,
    imageSliderWidth = windowWidth - 22,
    imageSliderHeight = windowWidth - 22,
}: ImageSlider) => {
    const [index, setIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList | null>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            x: scrollX
                        }
                    }
                }
            ],
            {
                useNativeDriver: false
            }
        )(event);
    }

    const handleOnViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0) {
            setIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View>
            <View style={{
                position: "absolute",
                top: 15,
                right: 10,
                flexDirection: "row",
                gap: 8
            }}>
                {slides.length > 1 && (
                    <View style={styles.pageNumberContainer}>
                        <CustomText textStyle={{
                            color: "#fff",
                            fontSize: 12
                        }} text={`${index + 1}/${slides.length}`} />
                    </View>
                )}
                {option && (
                    <Pressable
                        style={styles.optionBtn}
                        onPress={() => {
                            if (flatListRef.current && index > 0) {
                                const newIndex = index - 1;
                                flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
                            }
                            removeImage?.(index);
                        }}
                    >
                        <Entypo name="cross" size={20} color="#fff" />
                    </Pressable>
                )}
            </View>
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable>
                            <ImageContainer
                                imageSource={{ uri: item.url }}
                                imageContainerStyle={{
                                    width: imageSliderWidth,
                                    height: imageSliderHeight
                                }}
                            />
                        </Pressable>
                    )
                }}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onViewableItemsChanged={handleOnViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            {slides.length > 1 && <SlidePagination data={slides} scrollX={scrollX} />}
        </View>
    )
}

const styles = StyleSheet.create({
    pageNumberContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        zIndex: 2
    },
    optionBtn: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: 26,
        height: 26,
        borderRadius: 13,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
})

export default ImageSlider