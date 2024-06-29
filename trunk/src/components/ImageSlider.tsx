import {
    Image,
    Pressable,
    View,
    FlatList,
    Animated,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ViewToken,
} from 'react-native';

import React, { useRef, useState, useEffect } from 'react';

//components
import ImageContainer from './ImageContainer';
import CustomText from './CustomText';
import SlidePagination from './SlidePagination';

const windowWidth = Dimensions.get('window').width;

type Slide = {
    id: string,
    url: string
}

type ImageSlider = {
    slides: Slide[],
    imageSliderWidth?: number,
    imageSliderHeight?: number
}

const ImageSlider = ({
    slides,
    imageSliderWidth = windowWidth - 22,
    imageSliderHeight = windowWidth - 22
}: ImageSlider) => {
    const [index, setIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;

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
            <View style={styles.pageNumberContainer}>
                <CustomText textStyle={{
                    color: "#fff",
                    fontSize: 12
                }} text={`${index + 1}/${slides.length}`} />
            </View>
            <FlatList
                data={slides}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <Pressable>
                                <ImageContainer
                                    imageSource={{ uri: item.url }}
                                    imageContainerStyle={{
                                        width: imageSliderWidth,
                                        height: imageSliderHeight
                                    }}
                                />
                            </Pressable>
                        </View>
                    )
                }}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onViewableItemsChanged={handleOnViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            <SlidePagination data={slides} scrollX={scrollX} />
        </View>
    )
}

const styles = StyleSheet.create({
    pageNumberContainer: {
        position: "absolute",
        top: 15,
        right: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 2
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
    }
})

export default ImageSlider