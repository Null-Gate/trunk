import {
    FlatList,
    Modal,
    StyleSheet
} from "react-native";
import { useEffect, useState } from "react";

import React from "react";

//components
import Layout from "../components/Layout";
import Post from "../components/NewFeed/Post";
import ImageModal from "../components/NewFeed/ImageModal";
import ImageSlider from "../components/NewFeed/ImageSlider";

//data
import { POST_DATA } from "../config/posts";

interface ImageModalInfo {
    modalVisible: boolean;
    postId: number | string | null;
    pressedImgIndex: number | null;
}


const NewFeedScreen = () => {
    const [imageModalInfo, setImageModalInfo] = useState<ImageModalInfo>({
        modalVisible: false,
        postId: null,
        pressedImgIndex: null,
      });

    const closeImageModal = () => {
        setImageModalInfo( prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
                postId: null,
                pressedImgIndex: null
            }
            return newInfo;
        })
    }

    const openImageModal = (
        postId: number | string,
        pressedImgIndex: number
    ) => {
        setImageModalInfo( prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
                postId: postId,
                pressedImgIndex
            }
            return newInfo;
        })
    };

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
                        return <Post
                            id={item.id}
                            username={item.user}
                            description={item.descirption}
                            imgs={item.imgs}
                            onPressedPostImage={openImageModal}
                        />
                    }}
                    keyExtractor={item => item.id.toString()}
                /> 
            </Layout> 
            <ImageModal
                postId={imageModalInfo.postId}
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