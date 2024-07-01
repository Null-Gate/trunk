import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import React, { useState } from 'react'

// components
import Input from '../components/PasswordChange/Input';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';

const PasswordChangeScreen = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmationPassword, setConfirmationPassword] = useState<string>("");
    return (
        <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        >
            <View style={styles.container}>
                <Input
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder='Enter old password'
                />
                <Input
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder='Enter old password'
                />
                <Input
                    value={confirmationPassword}
                    onChangeText={setConfirmationPassword}
                    placeholder='Confirm new password'
                />
                <CustomButton
                    title="Update Password"
                    onPress={() => { }}
                    style={styles.button}
                />
                <CustomText
                    text='Forgot Password?'
                    textStyle={{
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 15
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default PasswordChangeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 25,
        paddingHorizontal: 15
    },
    button: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 10
    }
})