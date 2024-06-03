import {
    Image,
    Pressable,
    View,
    FlatList,
    Animated,
    StyleSheet,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';

import React, { useRef, useState } from 'react';

//components
import ImageContainer from '../ImageContainer';
import SlidePagination from './SlidePagination';
import CustomText from '../CustomText';

const windowWidth = Dimensions.get('window').width;

type Slide = {
    id: number | string,
    url: string
}

type ImageSlider = {
    postId: number | string,
    slides: Slide[],
    onPressedImage: (postId : number | string, pressedImgIndex : number) => void
}

const ImageSlider = ({
    postId,
    slides,
    onPressedImage
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

    const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
        setIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View>
            <View style={styles.pageNumberContainer}>
                <CustomText textStyle={styles.currentPage}>{`${index + 1}/${slides.length}`}</CustomText>
            </View>
            <FlatList
                data={slides}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <Pressable onPress={() => onPressedImage(postId, index)}>
                                <ImageContainer
                                    imageSource={{ uri: item.url }}
                                    imageContainerStyle={{
                                        width : windowWidth - 30,
                                        height : 380
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
            <SlidePagination data={slides} scrollX={scrollX} index={index} />
        </View>
    )
}

const styles = StyleSheet.create({
    pageNumberContainer: {
        position: "absolute",
        top: 20,
        right: 10,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 2
    },
    currentPage: {
        color: "white",
        fontSize: 12
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
    }
})

export default ImageSlider