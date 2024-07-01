import {
    View,
    Modal,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import React from 'react'

// components
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';

// styles
import { GlobalStyles } from '../../constants/styles';

const windowWidth = Dimensions.get("window").width;

interface LogoutAlertProps {
    visible: boolean,
    closeAlert: () => void
}
const LogoutAlert = ({
    visible,
    closeAlert
}: LogoutAlertProps) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
        >
            <TouchableWithoutFeedback
                onPress={closeAlert}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.alertBox}>
                            <CustomText
                                text="Are you sure want to logout?"
                                textStyle={{
                                    color: "#525252",
                                    textAlign: "center",
                                    marginBottom: 25
                                }}
                            />
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <CustomButton
                                    title='Logout'
                                    style={styles.button}
                                    onPress={() => { }}
                                />
                                <CustomButton
                                    title='No'
                                    style={[styles.button, {
                                        backgroundColor: "#fff",
                                        borderWidth: 1,
                                        borderColor: GlobalStyles.colors.primaryColor
                                    }]}
                                    textStyle={{ color: GlobalStyles.colors.primaryColor }}
                                    onPress={() => { }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default LogoutAlert

const styles = StyleSheet.create({
    alertBox: {
        width: windowWidth * .7,
        backgroundColor: "#fff",
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    button: {
        width: "48%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10
    }
})