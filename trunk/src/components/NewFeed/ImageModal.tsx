import {
    Animated,
    View,
    Image,
    Modal,
    StyleSheet,
    Pressable,
    Dimensions,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent
} from "react-native";

import { useState, useEffect, useRef } from "react";

import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { POST_DATA } from "../../config/posts";

//helper functions
import {
    calculateImageDimensions,
    ImageDimensions,
    calculateAspectRatioHeight
} from "../../utils/helper";

//components
import ImageContainer from "../ImageContainer";
import CustomText from "../CustomText";
import NetworkImage from "./NetworkImage";

const windowWidth = Dimensions.get('window').width;

const findHighestImageHeight = async (images: any): Promise<number> => {
    let maxHeight = 0;

    // Iterate through the array of images
    for (const image of images) {
        try {
            // Fetch the image dimensions
            const dimensions: ImageDimensions = await calculateImageDimensions({ uri: image.url });

            // Update maxHeight if the current image's height is greater
            const aspectRatioHeight = calculateAspectRatioHeight(dimensions.width, dimensions.height, windowWidth);
            if (aspectRatioHeight > maxHeight) {
                maxHeight = aspectRatioHeight;
            }
        } catch (error) {
            console.error(`Error fetching dimensions for image ${image.id}:`, error);
        }
    }

    return maxHeight;
}

type ImageModal = {
    post: any,
    pressedImageIndex: number,
    visible: boolean,
    close: () => void
}

const ImageModal = ({
    post,
    pressedImageIndex,
    visible,
    close
}: ImageModal) => {
    const [maxImageHeight, setMaxImageHeight] = useState<number>(0);
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

    useEffect(() => {
        if (post && post.imgs) {
            findHighestImageHeight(post.imgs)
                .then((maxHeight: number) => {
                    setMaxImageHeight(maxHeight);
                })
                .catch((error: Error) => {
                    console.error('Error finding highest image height:', error);
                });
        }
    }, [post]);

    return (
        <Modal
            animationType="slide"
            visible={visible}
        >
            <View style={styles.modalContainer}>

                {/* start modal header */}
                <View style={styles.modalHeader}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        {/* close btn */}
                        <Pressable onPress={close}>
                            <AntDesign name="close" size={24} color="white" />
                        </Pressable>
                        {/* close btn */}

                        <Pressable>
                            <Entypo name="dots-three-vertical" size={18} color="white" />
                        </Pressable>

                    </View>
                    <View style={styles.pageNumberContainer}>
                        <CustomText textStyle={styles.pageNumber}>
                            {`${index + 1}/${post?.imgs?.length}`}
                        </CustomText>
                    </View>
                </View>
                {/* end modal header */}

                {/* start image slider */}
                {post && (
                    <View style={styles.imageSlider}>
                        <FlatList
                            initialScrollIndex={pressedImageIndex}
                            data={post?.imgs}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{
                                        height: maxImageHeight,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <NetworkImage imageUrl={item.url} />
                                    </View>
                                )
                            }}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            onViewableItemsChanged={handleOnViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            getItemLayout={(data, index) => (
                                { length: windowWidth, offset: windowWidth * index, index }
                            )}
                        />
                    </View>
                )}
                {/* end image slider */}

                {/* start modal footer */}
                <View style={styles.detailContainer}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10
                    }}>
                        <ImageContainer
                            viewImage={
                                <Image
                                    style={styles.viewImage}
                                    source={require("./../../assets/profile.png")}
                                />
                            }
                            imageContainerStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 50
                            }}
                        />
                        <CustomText textStyle={styles.userName}>{post?.user}</CustomText>
                    </View>
                    <CustomText textStyle={styles.description}>
                        {post?.descirption}
                    </CustomText>
                </View>
                {/* end modal footer */}

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#000000",
    },
    modalHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        zIndex: 2
    },
    imageSlider: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    detailContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: "100%",
        position: "absolute",
        left: 0,
        bottom: 10,
        zIndex: 2
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    pageNumberContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: 10
    },
    pageNumber: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold"
    },
    userName: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600"
    },
    description: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold"
    }
})

export default ImageModal;