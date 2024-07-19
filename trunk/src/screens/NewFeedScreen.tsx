import {
    View,
    FlatList,
    StyleSheet,
    Pressable
} from 'react-native'
import React, { useState, useEffect } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import Post from '../components/newFeed/Post'
import PostModal from '../components/newFeed/PostModal'
import DriverLists from '../components/newFeed/DriverLists'

// dummy data
import { FEED_DATA } from '../config/post_data'

interface PostModalInfoProps {
    modalVisible: boolean
}

const NewFeedScreen = () => {
    const [feedDatas, setFeedDatas] = useState<any>([]);
    const [postModalInfo, setPostModalInfo] = useState<PostModalInfoProps>({
        modalVisible: false
    });

    const navigation = useNavigation<any>();

    const navigatePostDetial = () => {
        navigation.navigate('PostDetail');
    }

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

    useEffect(() => {
        // fetch new_feed datas
        setFeedDatas(FEED_DATA);
    }, [])

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    style={styles.listContainer}
                    data={feedDatas}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        if (item.type === "post") {
                            return (
                                <Pressable onPress={navigatePostDetial}>
                                    <Post
                                        creator={item.user}
                                        title={item.title}
                                        content={item.descirption}
                                        imgs={item.imgs}
                                        openPostModal={openPostModal}
                                    />
                                </Pressable>
                            )
                        } else {
                            return <DriverLists drivers={item.users} />
                        }
                    }}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
            <PostModal
                visible={postModalInfo.modalVisible}
                closeModal={closePostModal}
            />
        </>
    )
}

export default NewFeedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 15
    }
})