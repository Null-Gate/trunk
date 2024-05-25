import {
    View,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from "react-native";

//react
import { useState, useEffect } from "react";

//styles
import { GlobalStyles } from "../constants/styles";

//icons
import { AntDesign } from '@expo/vector-icons';

//components
import CustomButton from "../components/CustomButton";
import Input from "../components/Login&Register/Input";
import Segment from "../components/Segment";
import Circles from "../components/Login&Register/Circles";


const windowWidth = Dimensions.get('window').width;

const segmentItems = [
    {
        id: 1,
        title: "Login"
    },
    {
        id: 2,
        title: "Register"
    }
]

const RegisterLoginScreen = () => {
    const [activeContent, setActiveContent] = useState<number>(segmentItems[0].id); // 1 : login, 2 : register
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const handleActiveContent = (activeId: number) => {
        setActiveContent(activeId);
    }

return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View style={{ flex: 1 }}>
            <Circles />
            <View style={styles.formContainer}>
                <Segment
                    items={segmentItems}
                    currentActive={activeContent}
                    onChangeActive={handleActiveContent}
                    style={{ marginBottom: 20 }}
                />
                <Input
                    title="User Name"
                    value={userName}
                    onChangeValue={setUserName}
                    icon={<AntDesign name="user" size={20} color="black" />}
                    inputStyle={{ marginBottom: 20 }}
                    placeholder="Maung Thar Kyaw"
                />

                <Input
                    title="Password"
                    value={password}
                    onChangeValue={setPassword}
                    icon={<AntDesign name="lock1" size={20} color="black" />}
                    inputStyle={activeContent === 2 ? { marginBottom: 20 } : { marginBottom: 35 }}
                    placeholder="password"
                />

                {activeContent === 2 && (
                    <Input
                        title="Email"
                        value={email}
                        onChangeValue={setEmail}
                        icon={<AntDesign name="mail" size={20} color="black" />}
                        inputStyle={{ marginBottom: 35 }}
                        placeholder="maungtharkyaw2520@gmail.com"
                        keyboardType="email-address"
                    />
                )}

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title={activeContent === 2 ? "Register" : "Login"}
                        btnStyle={styles.button}
                    />
                </View>
            </View>
        </View>


    </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F6F6"
    },
    formContainer: {
        marginTop: windowWidth * 0.5,
        paddingHorizontal: windowWidth * .1,
    },
    buttonContainer: {
        alignItems: "center"
    },
    button: {
        width: windowWidth * .6,
        paddingVertical: 10,
        borderRadius: 20
    }
})

export default RegisterLoginScreen;