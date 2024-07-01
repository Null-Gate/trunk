import {
	View,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform
} from 'react-native'
import React, { useState } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// styles
import { GlobalStyles } from '../constants/styles'

// components
import ImageContainer from '../components/ImageContainer'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import CustomPasswordInput from '../components/CustomPasswordInput'
import CustomButton from '../components/CustomButton'

const windowHeight = Dimensions.get('window').height;

// 20 + 150

const LoginScreen = () => {
	const [email, setEmail] = useState<string>("");
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
						<CustomText text='Welcome Back' textStyle={{
							color: "#fff",
							fontSize: 25,
							letterSpacing: 2
						}} />

					</View>
					<View style={{
						width: "100%",
						backgroundColor: "#fff",
						paddingVertical: 50,
						paddingHorizontal: 20,
						borderTopLeftRadius: 25,
						borderTopRightRadius: 25,
						position: "absolute",
						bottom: 0,
					}}>
						<CustomInput
							title='Email'
							value={email}
							onChangeText={setEmail}
							placeholder='name@example.com'
							style={{ marginBottom: 20 }}
						/>
						<CustomPasswordInput
							title='Password'
							value={password}
							onChangeText={setPoassword}
							placeholder='XXXXXX'
							style={{ marginBottom: 25 }}
						/>
						<CustomButton
							title='LOG IN'
							onPress={() => { navigation.navigate("BottomTab") }}
							style={styles.loginButton}
						/>
						<CustomText
							text="Forgot Password?"
							textStyle={{
								color: "#424242",
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
								marginTop: 15
							}}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GlobalStyles.colors.primaryColor
	},
	loginButton: {
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	}
})