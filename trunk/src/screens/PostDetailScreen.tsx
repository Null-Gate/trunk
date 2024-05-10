import {
    View,
    StyleSheet,
    ScrollView,
} from "react-native";

import { useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";

//components
import Layout from "../components/Layout";
import Post from "../components/NewFeed/Post";
import Comment from "../components/Comment";
import ImageModal from "../components/NewFeed/ImageModal";
import CommentModal from "../components/PostDetail/CommentModal";

// styles
import { GlobalStyles } from "../constants/styles";

//icons
import { Entypo } from '@expo/vector-icons';

import { POST_DATA } from "../config/posts";

interface ImageModalInfo {
    modalVisible: boolean;
    post: any;
    pressedImgIndex: number | null;
}

interface CommentModalInfo {
    modalVisible: boolean;
    title: string | null;
}

const PostDetailScreen = () => {
    const [imageModalInfo, setImageModalInfo] = useState<ImageModalInfo>({
        modalVisible: false,
        post: null,
        pressedImgIndex: null,
    });

    const [commentModalInfo, setCommentModalInfo] = useState<CommentModalInfo>({
        modalVisible : false,
        title : null
    });

    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const post = POST_DATA.filter(post => post.id === route.params.postId)[0];

    const closeImageModal = () => {
        setImageModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
                post: null,
                pressedImgIndex: null
            }
            return newInfo;
        })
    }

    const openImageModal = (
        postId: number | string,
        pressedImgIndex: number
    ) => {
        const selectedPost = POST_DATA.filter( post => post.id === postId)[0];
        setImageModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
                post: selectedPost,
                pressedImgIndex
            }
            return newInfo;
        })
    };

    const openCommentModal = (
        title: string
    ) => {
        setCommentModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
                title: title
            };
            return newInfo;
        });
    }

    const closeCommentModal = () => {
        setCommentModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
                title: null
            };
            return newInfo;
        });
    }

    return (
        <Layout>
            <>
                {/* start header */}
                {/* <View style={styles.header}>
                    <Pressable
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Entypo name="cross" size={28} color="white" />
                    </Pressable>
                    <View>
                        <ImageContainer
                            viewImage={
                                <Image style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%"
                                }}
                                    source={require("./../assets/profile.png")}
                                />
                            }
                            imageContainerStyle={{
                                width: 35,
                                height: 35,
                                borderRadius: 50
                            }}
                        />
                    </View>
                </View> */}
                {/* end header */}

                <ScrollView>
                    {/* start post */}
                    <Post
                        id={post.id}
                        username={post.user}
                        description={post.descirption}
                        imgs={post.imgs}
                        onPressedPostImage={openImageModal}
                    />
                    {/* end post */}

                    {/* start comment lists */}
                    <View>
                        {
                            post.comments.map(comment => {
                                return (
                                    <View key={comment.id} style={styles.commentContainer}>
                                        <Comment
                                            author={comment.author}
                                            created_date="10h"
                                            text={comment.text}
                                            onReply={openCommentModal}
                                        />
                                        {comment.reply && (
                                            <Comment
                                                author={post.user}
                                                created_date="10h"
                                                text={comment.reply.text}
                                                style={styles.replyComment}
                                                isReplyComment={true}
                                            />
                                        )}

                                    </View>
                                )
                            })
                        }
                    </View>
                    {/* end comment lists */}
                </ScrollView>

                <ImageModal
                    post={imageModalInfo.post}
                    pressedImageIndex={imageModalInfo.pressedImgIndex}
                    visible={imageModalInfo.modalVisible}
                    close={closeImageModal}
                />

                <CommentModal 
                    visible={commentModalInfo.modalVisible}
                    title={commentModalInfo.title}
                    close={closeCommentModal}
                />
            </>
        </Layout>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: GlobalStyles.colors.primaryColor,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    commentContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 10
    },
    replyComment: {
        marginLeft: 40,
        borderLeftWidth: 1,
        borderLeftColor: GlobalStyles.colors.softGrey,
        paddingLeft: 20
    },
})

export default PostDetailScreen;