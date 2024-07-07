import {
	View,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable
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
						paddingVertical: 35,
						paddingHorizontal: 20,
						borderTopLeftRadius: 25,
						borderTopRightRadius: 25,
						position: "absolute",
						bottom: 0,
					}}>
						{/* start email */}
						<CustomInput
							title='Email'
							value={email}
							onChangeText={setEmail}
							placeholder='name@example.com'
							style={{ marginBottom: 20 }}
							inputStyle={{
								backgroundColor: "#F2F2F2",
								borderWidth: 0
							}}
						/>
						{/* end email */}

						{/* start password */}
						<CustomPasswordInput
							title='Password'
							value={password}
							onChangeText={setPoassword}
							placeholder='XXXXXX'
							style={{ marginBottom: 5 }}
						/>
						{/* end password */}

						<View style={{
							flexDirection: "row",
							justifyContent: "flex-end",
							marginBottom: 20
						}}>
							<Pressable
								onPress={() => { console.log("forgot password???") }}
							>
								<CustomText
									text='forgot Password ?'
									textStyle={{
										fontSize: 13,
										color: "#424242",
										textDecorationLine: "underline",
										textDecorationColor: GlobalStyles.colors.softGrey
									}}
								/>
							</Pressable>
						</View>

						<View>
							{/* start login btn */}
							<CustomButton
								title='LOG IN'
								onPress={() => { navigation.navigate("BottomTab") }}
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
								title='SIGN UP'
								onPress={() => { navigation.navigate("Signup") }}
								style={[styles.button, styles.signupBtn]}
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

export default LoginScreen

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
	signupBtn: {
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