import {
    View,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native'
import React, { useEffect } from 'react'

interface ImageModalProps {
    visible: boolean
}

const ImageModal = ({
    visible
}: ImageModalProps) => {
    useEffect(() => {

    }, [])
    return (
        <Modal
            animationType='slide'
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.slideContainer}>
                    {/* <FlatList 
                        data={}
                        renderItem={({ item }) => {
                            return (
                            )
                        }}
                        horizontal
                        pagingEnabled
                    /> */}
                </View>
            </View>
        </Modal>
    )
}

export default ImageModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#000"
    },
    slideContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})