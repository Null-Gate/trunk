import {
    View,
    Modal,
    StyleSheet,
    Pressable,
    Platform,
    TextInput,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import React, { useState } from 'react';

//icons
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

//helpers
import { 
    ImageDimensions,
    calculateImageDimensions,
    calculateAspectRatioHeight
} from '../../utils/helper';

//components
import CustomText from '../CustomText';
import ImageContainer from '../ImageContainer';

//styles
import { GlobalStyles } from '../../constants/styles';

type SelectedImage = {
    uri : string,
    dimensions : ImageDimensions
}

type CommentModal = {
    visible : boolean,
    title : string,
    close : () => void
}

const CommentModal = ({
    visible,
    title,
    close
} : CommentModal) => {
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>();

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const imageUrl = result.assets[0].uri;
            const dimensions: ImageDimensions = await calculateImageDimensions({ uri : imageUrl})
            const aspectRatioHeight = calculateAspectRatioHeight(
                dimensions.width,
                dimensions.height,
                120
            );
            setSelectedImage({
                uri : imageUrl,
                dimensions : {
                    width : 120,
                    height: aspectRatioHeight
                }
            })
        }
    }

    const cancelSelectedImage = () => {
        setSelectedImage(null);
    }

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
                        alignItems: "center",
                        gap: 20
                    }}>
                        <Pressable onPress={close}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                        <Pressable>
                            <CustomText textStyle={{
                                fontWeight: "bold",
                            }}>
                                Add comment
                            </CustomText>
                        </Pressable>
                    </View>
                    <Pressable>
                        <CustomText textStyle={{
                            color: "#3b58ff",
                            fontSize: 14
                        }}>Post</CustomText>
                    </Pressable>
                </View>
                {/* end modal header */}

                <View style={{
                    paddingHorizontal: 15,
                    flex: 1,
                }}>
                    <View style={styles.titleContainer}>
                        <CustomText textStyle={{
                            fontSize: 14
                        }}>
                            {title}
                        </CustomText>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Your comment here'
                        multiline={true}
                    />
                </View>

                {/* start selected image container */}
                {selectedImage && (
                    <View style={styles.selectedImageContainer}>
                        <ImageContainer
                            viewImage={<Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />}
                            imageContainerStyle={{
                                width: selectedImage.dimensions.width, 
                                height: selectedImage.dimensions.height,
                                borderRadius: 10,
                            }}
                        />
                        <Pressable
                            onPress={cancelSelectedImage}
                        >
                            <Entypo name="circle-with-cross" size={24} color="grey" />
                        </Pressable>
                    </View>
                )}
                {/* end selected image container */}

                {/* start modal footer */}
                <View style={styles.modalFooter}>
                    <Pressable>
                        <Entypo name="link" size={20} color="#8a8a8a" />
                    </Pressable>
                    <Pressable
                        onPress={pickImageAsync}
                    >
                        <Feather name="image" size={20} color="#3b58ff" />
                    </Pressable>
                </View>
                {/* end modal footer */}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    modalHeader: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    titleContainer: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ededed"
    },
    input: {
        flex: 1,
        textAlignVertical: "top",
        paddingTop: 15
    },
    modalFooter: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ededed"
    },
    selectedImageContainer: {
        padding: 10,
        flexDirection: "row",
        gap: 10
    },
    selectedImage: {
        position: "absolute",
        width: "100%",
        height: "100%"
    }

})

export default CommentModal