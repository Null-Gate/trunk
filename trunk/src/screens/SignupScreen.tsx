import {
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Pressable,
    Platform,
    Keyboard,
    StyleSheet
} from 'react-native'
import React, { useState } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import ImageContainer from '../components/ImageContainer'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import CustomPasswordInput from '../components/CustomPasswordInput'
import CustomButton from '../components/CustomButton'

// styles
import { GlobalStyles } from '../constants/styles'

const SignupScreen = () => {
    const [username, setUsername] = useState<string>("");
    const [fullname, setFullname] = useState<string>("");
    const [password, setPoassword] = useState<string>("");

    const navigation = useNavigation<any>();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 20
                    }}>
                        <ImageContainer
                            imageSource={require('../assets/images/logo.jpg')}
                            imageContainerStyle={{
                                width: 150,
                                height: 150,
                            }}
                        />
                        <CustomText text='Create Account' textStyle={{
                            color: "#fff",
                            fontSize: 25,
                            letterSpacing: 2
                        }} />

                    </View>
                    <View style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        paddingVertical: 35,
                        paddingHorizontal: 20,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        position: "absolute",
                        bottom: 0,
                    }}>
                        {/* start username */}
                        <CustomInput
                            title='Username'
                            value={username}
                            onChangeText={setUsername}
                            placeholder='Linus'
                            style={{ marginBottom: 20 }}
                            inputStyle={{
                                backgroundColor: "#F2F2F2",
                                borderWidth: 0
                            }}
                        />
                        {/* end username */}

                        {/* start fullname */}
                        <CustomInput
                            title='Fullname'
                            value={fullname}
                            onChangeText={setFullname}
                            placeholder='Linus Walker'
                            style={{ marginBottom: 20 }}
                            inputStyle={{
                                backgroundColor: "#F2F2F2",
                                borderWidth: 0
                            }}
                        />
                        {/* end fullname */}

                        {/* start password */}
                        <CustomPasswordInput
                            title='Password'
                            value={password}
                            onChangeText={setPoassword}
                            placeholder='XXXXXX'
                            style={{ marginBottom: 20 }}
                        />
                        {/* end password */}

                        <View>
                            {/* start login btn */}
                            <CustomButton
                                title='SIGN UP'
                                onPress={() => { () => console.log("login success")}}
                                style={styles.button}
                            />
                            {/* end login btn */}
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <View style={styles.line}></View>
                                <CustomText
                                    text="OR"
                                    textStyle={{
                                        fontSize: 12,
                                        marginVertical: 5
                                    }}
                                />
                                <View style={styles.line}></View>
                            </View>
                            {/* start signup btn */}
                            <CustomButton
                                title='LOG IN'
                                onPress={() => { navigation.navigate("Login") }}
                                style={[styles.button, styles.loginBtn]}
                                textStyle={{ color: GlobalStyles.colors.primaryColor }}
                            />
                            {/* end signup btn */}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.primaryColor
    },
    button: {
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	loginBtn: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: GlobalStyles.colors.primaryColor
	},
    line: {
		width: "40%",
		height: 1,
		backgroundColor: GlobalStyles.colors.softGrey
	}
})