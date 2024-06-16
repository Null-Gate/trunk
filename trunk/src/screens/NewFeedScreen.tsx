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
import PostModal from "../components/NewFeed/PostModal";

//data
import { POST_DATA } from "../config/posts";

interface ImageModalInfo {
    modalVisible: boolean;
    pressedImgIndex: number | null;
    post: any
}

interface PostModalInfo {
    modalVisible: boolean
}

const NewFeedScreen = () => {
    const [imageModalInfo, setImageModalInfo] = useState<ImageModalInfo>({
        modalVisible: false,
        pressedImgIndex: null,
        post: null
    });
    const [postModalInfo, setPostModalInfo] = useState<PostModalInfo>({
        modalVisible: false
    })
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

    const openPostModal = () => {
        setPostModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
            }
            return newInfo;
        })
    }

    const closePostModal = () => {
        setPostModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
            }
            return newInfo;
        })
    }

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
                                onPressedPostOptions={openPostModal}
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
            <PostModal 
                visible={postModalInfo.modalVisible}
                closeModal={closePostModal}
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