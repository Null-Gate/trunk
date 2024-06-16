import {
    View,
    Pressable,
    StyleSheet
} from 'react-native'
import React from 'react';

// icons
import { FontAwesome } from '@expo/vector-icons';

//components
import CustomModal from '../CustomModal';
import CustomText from '../CustomText';

type PostModal = {
    visible: boolean,
    closeModal: () => void
}

const PostModal = ({
    visible,
    closeModal
}: PostModal) => {
    return (
        <CustomModal
            visible={visible}
            closeModal={closeModal}
        >
            <View>
                <Pressable
                    android_ripple={{ color: "#ccc" }}
                    style={styles.listItem}
                >
                    <FontAwesome name="bookmark-o" size={20} color="black" />
                    <CustomText textStyle={styles.listItemText}>Save</CustomText>
                </Pressable>
                <Pressable
                    android_ripple={{ color: "#ccc" }}
                    style={styles.listItem}
                >
                    <FontAwesome name="bookmark-o" size={20} color="black" />
                    <CustomText textStyle={styles.listItemText}>Report</CustomText>
                </Pressable>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    listItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    listItemText: {
        fontSize: 14,
        fontWeight: "600"
    }
})

export default PostModal