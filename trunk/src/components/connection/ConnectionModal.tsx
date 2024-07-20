import { 
    Pressable,
    StyleSheet
} from 'react-native'
import React from 'react'

// components
import CustomModal from '../CustomModal'
import CustomText from '../CustomText';

// icons
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ConnectionModalProps = {
    visible: boolean,
    closeModal: () => void
}

const ConnectionModal = ({
    visible,
    closeModal
}: ConnectionModalProps) => {
  return (
    <CustomModal
        visible={visible}
        closeModal={closeModal}
    >
        <Pressable
            android_ripple={{ color: "#ccc" }}
            style={styles.listItem}
        >
            <MaterialCommunityIcons name="account-remove" size={20} color="black" />
            <CustomText text='Remove connection' textStyle={styles.listItemText} />
        </Pressable>
    </CustomModal>
  )
}

export default ConnectionModal

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