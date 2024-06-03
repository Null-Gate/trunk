import {
    View,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Animated,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Pressable
} from 'react-native';
import React, { useState, useRef } from 'react';

//components
import ImageContainer from '../ImageContainer';
import CustomText from '../CustomText';
import SlidePagination from './SlidePagination';

//icons
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;

interface SelectedImage {
    id: number | string;
    url: string;
}

type ImageSlider = {
    images: SelectedImage[] | [],
    pickImage: () => void,
    removeImage: (id: number | string) => void
};

const ImageSlider = ({
    images,
    pickImage,
    removeImage
}: ImageSlider) => {
    const [index, setIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const sliderRef = useRef(null);

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

    const removeImageHandler = () => {
        const removeableImage = images.filter((_, idx) => {
            return idx == index;
        })[0];
        const removeableId = removeableImage.id;
        removeImage(removeableId);
    }

    const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
        setIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View>
            <View style={{
                position: "absolute",
                top: 10,
                right: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 15
            }}>
                <View style={styles.container}>
                    <CustomText textStyle={styles.currentPage}>{`${index + 1}/${images.length}`}</CustomText>
                </View>
                <Pressable onPress={removeImageHandler} style={styles.container}>
                    <Entypo name="cross" size={18} color="white" />
                </Pressable>
            </View>
            <FlatList
                ref={sliderRef}
                data={images}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <ImageContainer
                                imageSource={{ uri: item.url }}
                                imageContainerStyle={{
                                    width: windowWidth - 30,
                                    height: 380
                                }}
                            />
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
            <SlidePagination data={images} scrollX={scrollX} index={index} />
            <Pressable onPress={pickImage}>
                <View style={[styles.container, styles.addImageContainer]}>
                    <Ionicons name="images" size={16} color="white" />
                    <CustomText textStyle={{
                        color: "white",
                        fontSize: 12
                    }}>Add</CustomText>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 2
    },
    currentPage: {
        color: "white",
        fontSize: 12
    },
    addImageContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: "row",
        gap: 5
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
})

export default ImageSlider