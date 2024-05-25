import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable
} from 'react-native'
import React, { useState } from 'react';

//components
import Layout from '../components/Layout';
import Notification from '../components/Notifications/Notification';
import NotiModal from '../components/Notifications/NotiModal';

//data
import { NOTI_DATA } from '../config/posts';

const user = {
    name: "Maung Thar Kyaw",
    img: "dfafsdfsdf"
}

interface NotiModalInfo {
    modalVisible: boolean;
    notification: any
}

const NotificationScreen = () => {
    const [notiModalInfo, setNotiModalInfo] = useState<NotiModalInfo>({
        modalVisible: false,
        notification: null
    });

    const closeNotiModal = () => {
        setNotiModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: false,
                notification: null
            }
            return newInfo;
        })
    }

    const openNotiModal = (
        notiId: number | string
    ) => {
        console.log("clicking")
        const selectedNotification = NOTI_DATA.filter(noti => noti.id === notiId)[0];
        const noti = {
            username: selectedNotification.user.name,
            userImg: selectedNotification.user.img,
            notiMessage: selectedNotification.message
        }
        setNotiModalInfo(prevInfo => {
            const newInfo = {
                ...prevInfo,
                modalVisible: true,
                notification: noti
            }
            return newInfo;
        })
    }
    return (
        <>
            <Layout>
                <FlatList
                    style={styles.notificationsListContainer}
                    data={NOTI_DATA}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <Pressable>
                            <Notification
                                notiMessage={item.message}
                                user={item.user}
                                created_date={item.created_date}
                                pressDetail={() => openNotiModal(item.id)}
                            />
                        </Pressable>
                    }}
                />
            </Layout>
            <NotiModal
                visible={notiModalInfo.modalVisible}
                notification={notiModalInfo.notification}
                closeModal={closeNotiModal}
            />
        </>
    )
}

const styles = StyleSheet.create({
    notificationsListContainer: {
        flex: 1,
        paddingHorizontal: 8
    },
    title: {

    }
})

export default NotificationScreen;