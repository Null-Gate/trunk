import {
    View,
    Pressable,
    Platform,
    ScrollView,
    Dimensions,
    StyleSheet
} from 'react-native';

import Modal from "react-native-modal";
import React from 'react';

//icons
import { FontAwesome } from '@expo/vector-icons';

//components
import ImageContainer from '../ImageContainer';
import CustomText from '../CustomText';
import CustomModal from '../CustomModal';

// styles
import { GlobalStyles } from '../../constants/styles';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type NotiModal = {
    visible: boolean,
    notification: {
        username: string,
        userImg: string,
        notiMessage: string,
    }
    closeModal: () => void
}

const NotiModal = ({
    visible,
    notification,
    closeModal
}: NotiModal) => {
    return (
        <CustomModal
            visible={visible}
            closeModal={closeModal}
        >
            <View>
                {/* start modal header */}
                <View style={styles.modalHeader}>
                    <ImageContainer
                        imageSource={{ uri: notification?.userImg }}
                        imageContainerStyle={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginBottom: 10
                        }}
                    />
                    <CustomText textStyle={styles.headerText}>
                        {`${notification?.username} ${notification?.notiMessage}`}
                    </CustomText>
                </View>
                {/* end modal header */}

                {/* start list container */}
                <View style={styles.listContainer}>
                    <Pressable
                        android_ripple={{ color: "#ccc" }}
                        style={styles.listItem}
                    >
                        <View style={{ width: windowWidth * 0.15 }}>
                            <View style={styles.iconContainer}>
                                <FontAwesome name="window-close" size={20} color="black" />
                            </View>
                        </View>
                        <CustomText textStyle={styles.listItemText}>Remove this notification</CustomText>
                    </Pressable>
                </View>
                {/* end list container */}
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalPage: {
        flex: 1
    },
    modalContainer: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: windowWidth,
        backgroundColor: "#fff",
        paddingVertical: 20,
        borderTopEndRadius: 15,
        borderTopLeftRadius: 15,
    },
    innerContainer: {
        maxHeight: windowHeight * 0.6,
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    modalHeader: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        color: "grey",
        fontSize: 16,
        fontWeight: 400
    },
    listContainer: {
        paddingTop: 15
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: GlobalStyles.colors.softGrey,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    listItemText: {
        fontSize: 16,
        fontWeight: "600"
    }
})

export default NotiModal