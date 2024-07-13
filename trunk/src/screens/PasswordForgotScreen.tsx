import {
	View,
	StyleSheet
} from 'react-native'
import React, { useState } from 'react'

// components
import CustomText from '../components/CustomText'
import CustomInput from '../components/password/CustomInput'
import CustomButton from '../components/CustomButton'

const PasswordForgotScreen = () => {
	const [email, setEmail] = useState("maungtharkyaw2520@gmail.com");
	return (
		<View style={styles.container}>
			<CustomText
				text='Forgot Password?'
				textStyle={{
					fontSize: 20,
					color: "#575757",
					textAlign: "center",
					marginVertical: 15
				}}
			/>
			<CustomText
				text="No worries! Enter your email and we'll send you password reset instructions"
				textStyle={{
					color: "#787878",
					fontSize: 16,
					textAlign: "center",
					marginBottom: 50
				}}
			/>

			<View>
				<CustomInput
					value={email}
					onChangeText={setEmail}
					placeholder='Enter old password'
				/>

				<CustomButton
					title="Update Password"
					onPress={() => { }}
					style={styles.button}
				/>
			</View>
		</View>
	)
}

export default PasswordForgotScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 15,
		backgroundColor: "#fff"
	},
	button: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    }
})