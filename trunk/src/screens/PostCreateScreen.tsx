import {
    View,
    Pressable,
    Image,
    TextInput,
    FlatList,
    StyleSheet,
    Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import React, { useState, useEffect } from 'react';

//components
import Layout from '../components/Layout';
import CustomButton from '../components/CustomButton';

//icons
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

//style
import { GlobalStyles } from '../constants/styles';
import CustomText from '../components/CustomText';
import ImageContainer from '../components/ImageContainer';
import ImageSlider from '../components/PostCreate/ImageSlider';

import { POST_DATA } from '../config/posts';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface SelectedImage {
    id: number | string;
    url: string;
}

type SelectedImages = SelectedImage[];
const PostCreateScreen = () => {
    // const [imageIndex, setImageIndex]
    const [selectedImages, setSelectedImages] = useState<SelectedImages | []>([]);
    const [postTitle, setPostTitle] = useState<string>("");
    const [postBodyText, setPostBodyText] = useState<string>("");

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const imageUrl = result.assets[0].uri;
            const fileNmae = result.assets[0].fileName;
            const random = Math.random();
            const selectedImage = {
                id: fileNmae + random,
                url: imageUrl
            }

            setSelectedImages(prevImages => {
                const newImages = [...prevImages, selectedImage];
                return newImages;
            })
        }
    }

    const removeImage = (id: number) => {
        setSelectedImages(prevImages => {
            const newImages = prevImages.filter(image => image.id !== id);
            return newImages;
        })
    }

    useEffect(() => {
        console.log(selectedImages);
    }, [selectedImages])

    return (
        <Layout>
            <View style={styles.container}>

                {/* start header */}
                <View style={styles.header}>
                    {/* close btn */}
                    <Pressable>
                        <AntDesign name="close" size={24} color="black" />
                    </Pressable>
                    {/* close btn */}
                    <CustomButton
                        title='Post'
                        btnStyle={styles.postButton}
                        textStyle={{ color: "grey" }}
                    />
                </View>
                {/* end header */}

                {/* start userInfo Container */}
                <View style={styles.userInfoContainer}>
                    <ImageContainer
                        viewImage={<Image
                            style={styles.viewImage}
                            source={require("./../assets/profile.png")}
                        />}
                        imageContainerStyle={{
                            width: 30,
                            height: 30,
                            borderRadius: 50
                        }}
                    />
                    <CustomText textStyle={{
                        fontSize: 14,
                        fontWeight: "bold"
                    }}>Otto Anderson</CustomText>
                </View>
                {/* end userInfo Container */}

                {/* start title container */}
                <TextInput
                    value={postTitle}
                    onChangeText={text => setPostTitle(text)}
                    style={styles.titleInput}
                    placeholder='Title'
                    multiline={true}
                />
                {/* end title container */}

                {/* start Image slider */}
                {selectedImages.length > 0 && (
                    <ImageSlider
                        images={selectedImages}
                        pickImage={pickImageAsync}
                        removeImage={removeImage}
                    />
                )}
                {/* end image slider */}

                {/* start body text container */}
                <TextInput
                    value={postBodyText}
                    onChangeText={text => setPostBodyText(text)}
                    style={styles.bodyTextInput}
                    placeholder='body text (optional)'
                    multiline={true}
                />
                {/* end body text container */}

                {/* start footer */}
                <View style={styles.footer}>
                    <Pressable>
                        <Entypo name="link" size={20} color="#8a8a8a" />
                    </Pressable>
                    <Pressable
                        onPress={pickImageAsync}
                    >
                        <Feather name="image" size={20} color="#3b58ff" />
                    </Pressable>
                </View>
                {/* end footer */}


            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        position: "relative"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    postButton: {
        elevation: 0,
        borderRadius: 20,
        backgroundColor: GlobalStyles.colors.softGrey
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 10
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    titleInput: {
        fontSize: 20,
        fontWeight: "bold",
        paddingVertical: 10,
        maxHeight: 200,
        marginTop: 20
    },
    bodyTextInput: {
        fontSize: 16,
        paddingVertical: 10
    },
    footer: {
        width: windowWidth,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ededed",
        position: "absolute",
        bottom: 0,
        left: 0
    }
})

export default PostCreateScreen