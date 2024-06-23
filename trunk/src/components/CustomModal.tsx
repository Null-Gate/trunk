import {
    View,
    ScrollView,
    Platform,
    StyleSheet,
    Dimensions
  } from 'react-native'
  import React, { ReactNode } from 'react'
  
  import Modal from "react-native-modal";
  
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  
  type CustomModal = {
    visible: boolean,
    closeModal: () => void,
    children: ReactNode
  }
  
  const CustomModal = ({
    visible,
    closeModal,
    children
  }: CustomModal) => {
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        animationInTiming={200}
        animationOutTiming={200}
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
            <ScrollView style={styles.innerContainer}>
              {children}
            </ScrollView>
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
    innerContainer: {
      maxHeight: windowHeight * 0.6,
  },
  })
  
  export default CustomModal