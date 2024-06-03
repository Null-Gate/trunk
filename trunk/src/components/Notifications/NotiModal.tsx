import {
    View,
    Text,
    Image,
    Pressable,
    Platform,
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
        <Modal
            isVisible={visible}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            animationInTiming={500}
            animationOutTiming={500}
            style={{
                margin: 0,
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-end",
            }}
            propagateSwipe={true}
            avoidKeyboard={Platform.OS === "ios" && true}
        >
            <View style={styles.modalPage}>
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
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
                        <View style={styles.listContainer}>
                            <Pressable
                                android_ripple={{ color: "#ccc" }}
                            >
                                <View style={styles.listItem}>
                                    <View style={{ width: windowWidth * 0.15 }}>
                                        <View style={styles.iconContainer}>
                                            <FontAwesome name="window-close" size={20} color="black" />
                                        </View>
                                    </View>
                                    <CustomText textStyle={styles.listItemText}>Remove this notification</CustomText>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
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
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    innerContainer: {
        maxHeight: windowHeight / 1.8,
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