import {
    View,
    Pressable,
    TextInput,
    StyleSheet,
    Dimensions,
    ScrollView,
    Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import React, { useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

//components
import Layout from '../components/Layout';
import CustomButton from '../components/CustomButton';

//icons
import { AntDesign } from '@expo/vector-icons';

//style
import { GlobalStyles } from '../constants/styles';
import CustomText from '../components/CustomText';
import ImageContainer from '../components/ImageContainer';
import ImageSlider from '../components/PostCreate/ImageSlider';
import SelectBox from '../components/PostCreate/SelectBox';
import CustomInput from '../components/CustomInput';
import DatePickerLayout from '../components/DatePickerLayout';

// icons
import { FontAwesome6 } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Dummy Data
const postTypeData = [
    { label: "package", value: "0" },
    { label: "owner", value: "1" },
];

interface SelectedImage {
    id: number | string;
    url: string;
}

type SelectedImages = SelectedImage[];
const PostCreateScreen = () => {
    const [postType, setPostType] = useState<string>("1");
    const [selectedImages, setSelectedImages] = useState<SelectedImages | []>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [weight, setWeight] = useState<string>("0");
    const [amount, setAmoung] = useState<string>("0");
    const [dateToGo, setDateToGo] = useState<any>();
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const navigation = useNavigation<any>();

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

    const removeImage = (id: number | string) => {
        setSelectedImages((prevImages: SelectedImages) => {
            const newImages = prevImages.filter(image => image.id != id);
            return newImages;
        })
    }

    const navigateNewFeedScreen = () => {
        navigation.navigate("NewFeed")
    }

    const openDatePicker = () => {
        setShowDatePicker(true);
    }

    const closeDatePicker = () => {
        setShowDatePicker(false);
    }


    return (
        <Layout>
            <View style={styles.container}>
                {/* start header */}
                <View style={styles.header}>
                    <View>
                        {/* close btn */}
                        <Pressable onPress={navigateNewFeedScreen}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                        {/* close btn */}
                    </View>
                    <CustomButton
                        title='Post'
                        btnStyle={styles.postButton}
                        textStyle={{ color: "grey" }}
                    />
                </View>
                {/* end header */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.formContainer}
                >
                    {/* start userInfo Container */}
                    <View style={styles.userInfoContainer}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2
                        }}>
                            <ImageContainer
                                imageSource={require("./../assets/profile.png")}
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
                        <SelectBox
                            selectedValue={postType}
                            item={postTypeData}
                            onChange={setPostType}
                            isDisabled={false}
                        />
                    </View>
                    {/* end userInfo Container */}

                    {/* start Image slider */}
                    {selectedImages.length > 0 ? (
                        <View style={{
                            marginBottom: 15
                        }}>
                            <ImageSlider
                                images={selectedImages}
                                pickImage={pickImageAsync}
                                removeImage={removeImage}
                            />
                        </View>
                    ) : (
                        <Pressable
                            onPress={pickImageAsync}
                        >
                            <View
                                style={{
                                    width: windowWidth - 30,
                                    height: 100,
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 15,
                                    elevation: 3,
                                    shadowColor: "gray",
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 3,
                                }}
                            >
                                <FontAwesome6 name="image" size={50} color="grey" />
                                <CustomText textStyle={{
                                    fontSize: 14,
                                    fontWeight: "semibold",
                                }}>Select Image</CustomText>
                            </View>
                        </Pressable>
                    )}
                    {/* end image slider */}

                    {/* start title */}
                    {postType == "0" && (
                        <CustomInput
                            value={title}
                            onChangeText={setTitle}
                            title="Package Name"
                            inputStyle={{
                                marginBottom: 15
                            }}
                        />
                    )}
                    {/* end title */}

                    {/* start package weight */}
                    <CustomInput
                        value={weight}
                        onChangeText={setWeight}
                        title="Package Weight"
                        inputStyle={{
                            marginBottom: 15
                        }}
                    />
                    {/* end package weight */}

                    {/* start package amount */}
                    <CustomInput
                        value={amount}
                        onChangeText={setAmoung}
                        title="Package Amount"
                        inputStyle={{
                            marginBottom: 15
                        }}
                    />
                    {/* end package amount */}

                    {/* start date to go */}
                    <DatePickerLayout
                        labelName="Date To Go"
                        showDatePicker={showDatePicker}
                        openDatePicker={openDatePicker}
                        closeDatePicker={closeDatePicker}
                        selectDate={dateToGo}
                        setChooseDate={setDateToGo}
                    />
                    {/* end date to go */}

                    {/* start package description */}
                    {postType == "0" && (
                        <CustomInput
                            value={description}
                            onChangeText={setDescription}
                            title="Package Details"
                            numberOfLines={12}
                        />
                    )}
                    {/* end package description */}
                </ScrollView>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        position: "relative",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    postButton: {
        elevation: 0,
        borderRadius: 20,
        backgroundColor: GlobalStyles.colors.softGrey,
        paddingVertical: 3
    },
    formContainer: {
        paddingBottom: 20
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 5,
        marginBottom: 20
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    titleInput: {
        fontSize: 18,
        fontWeight: "semibold",
        paddingVertical: 10,
        maxHeight: 200,
        marginTop: 20
    },
    bodyTextInput: {
        fontSize: 16,
        paddingVertical: 10
    },
})

export default PostCreateScreen