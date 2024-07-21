import {
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
            <Pressable
                android_ripple={{ color: "#ccc" }}
                style={styles.listItem}
            >
                <FontAwesome name="bookmark-o" size={20} color="black" />
                <CustomText text='Save' textStyle={styles.listItemText} />
            </Pressable>
            <Pressable
                android_ripple={{ color: "#ccc" }}
                style={styles.listItem}
            >
                <FontAwesome name="bookmark-o" size={20} color="black" />
                <CustomText text='Report' textStyle={styles.listItemText} />
            </Pressable>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    listItem: {
        paddingHorizontal: 20,
        paddingVertical: 15,
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