import {
    View,
    Pressable,
    StyleSheet
} from 'react-native'
import React, { useState } from 'react';

// components
import Input from '../components/PasswordChange/Input';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';

const PasswordChangeScreen = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    return (
        <View style={styles.container}>
            <Input
                value={oldPassword}
                onChangeText={setOldPassword}
                title="Enter old password"
                inputStyle={{
                    marginTop: 25,
                    marginBottom: 15
                }}
            />

            <Input
                value={newPassword}
                onChangeText={setNewPassword}
                title="Enter new password"
                inputStyle={{
                    marginBottom: 15
                }}
            />

            <Input
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                title="Confirm new password"
                inputStyle={{
                    marginBottom: 30
                }}
            />

            <CustomButton
                title='Update Password'
                btnStyle={styles.button}
            />

            <Pressable>
                <CustomText textStyle={styles.forgot}>Forgot Password?</CustomText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15
    },
    button: {
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10
    },
    forgot: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14
    }
})

export default PasswordChangeScreen