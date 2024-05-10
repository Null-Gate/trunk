import {
    FlatList,
    Pressable,
    StyleSheet
} from "react-native";

import React, { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";

//components
import Layout from "../components/Layout";
import Post from "../components/NewFeed/Post";
import ImageModal from "../components/NewFeed/ImageModal";

//data
import { POST_DATA } from "../config/posts";

interface ImageModalInfo {
    modalVisible: boolean;
    pressedImgIndex: number | null;
    post: any
}

const NewFeedScreen = () => {
    const [imageModalInfo, setImageModalInfo] = useState<ImageModalInfo>({
        modalVisible: false,
        pressedImgIndex: null,
        post: null
    });
    const navigation = useNavigation<any>();

    const closeImageModal = () => {
        setImageModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
                pressedImgIndex: null,
                post: null
            }
            return newInfo;
        })
    }

    const openImageModal = (
        postId: number | string,
        pressedImgIndex: number
    ) => {
        const selectedPost = POST_DATA.filter(post => post.id === postId)[0];
        setImageModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
                pressedImgIndex,
                post: selectedPost
            }
            return newInfo;
        })
    };

    const navigatePostDetail = (id: number | string) => {
        navigation.navigate('PostDetail', {
            postId: id
        })
    }

    useEffect(() => {
        console.log(imageModalInfo)
    }, [imageModalInfo])

    return (
        <>
            <Layout>
                <FlatList
                    style={styles.postListContainer}
                    data={POST_DATA}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <Pressable
                            onPress={() => {
                                navigatePostDetail(item.id);
                            }}
                        >
                            <Post
                                id={item.id}
                                username={item.user}
                                description={item.descirption}
                                imgs={item.imgs}
                                onPressedPostImage={openImageModal}
                            />
                        </Pressable>
                    }}
                    keyExtractor={item => item.id.toString()}
                />
            </Layout>
            <ImageModal
                post={imageModalInfo.post}
                pressedImageIndex={imageModalInfo.pressedImgIndex}
                visible={imageModalInfo.modalVisible}
                close={closeImageModal}
            />
        </>
    )
}

const styles = StyleSheet.create({
    postListContainer: {
        flex: 1
    },
})

export default NewFeedScreen;