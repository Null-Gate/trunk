import {
    Image,
    Pressable,
    View,
    FlatList,
    Animated,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';

import React, { useRef, useState } from 'react';

//components
import ImageContainer from '../ImageContainer';
import SlidePagination from './SlidePagination';

const windowWidth = Dimensions.get('window').width;


type SlideProps = {
    id: string,
    url: string
}

type ImageSliderProps = {
    slides: SlideProps[],
}

const ImageSlider = ({
    slides
}: ImageSliderProps) => {
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
            <FlatList
                data={slides}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable>
                            <ImageContainer
                                imageSource={{ uri: item.url }}
                                imageContainerStyle={{
                                    width: windowWidth - 20,
                                    height: windowWidth - 20
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
            <SlidePagination data={slides} scrollX={scrollX} index={index} />
        </View>
    )
}

export default ImageSlider