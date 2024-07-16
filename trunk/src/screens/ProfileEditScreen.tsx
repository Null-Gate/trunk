import {
	View,
	StyleSheet,
	Pressable,
	KeyboardAvoidingView,
	Platform
} from 'react-native'
import React, { useState, useLayoutEffect } from 'react'

// expo image picker
import * as ImagePicker from 'expo-image-picker';

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import ImageContainer from '../components/ImageContainer'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

// styles
import { GlobalStyles } from '../constants/styles'

// icons
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const ProfileEditScreen = () => {
	const [profileImage, setProfileImage] = useState<null | string>(null);
	const [username, setUsername] = useState<string>("");
	const [fullname, setFullname] = useState<string>("");

	const navigation = useNavigation<any>();

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setProfileImage(result.assets[0].uri);
		}
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<CustomButton
					style={{
						backgroundColor: "#fff",
						paddingVertical: 2,
						flexDirection: "row",
						gap: 3,
						alignItems: "center"
					}}
					textStyle={{
						color: "#000",
						fontSize: 16
					}}
					title='Save'
					onPress={() => {
					}}
				>
					<Ionicons name="save" size={20} color="black" />
				</CustomButton>
			)
		})
	}, []);
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<View style={styles.container}>
				{/* start profile picture */}
				<View style={styles.profileContainer}>
					<View style={{ position: "relative" }}>
						<ImageContainer
							imageSource={
								profileImage ? {uri: profileImage} : require('../assets/images/artist.png')
							}
							imageContainerStyle={styles.profileImg}
						/>
						<Pressable 
							style={styles.profileEditBtn}
							onPress={pickImage}
						>
							<EvilIcons name="pencil" size={20} color="black" />
						</Pressable>
					</View>
				</View>
				{/* end profile picture */}

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
			</View>
		</KeyboardAvoidingView>
	)
}

export default ProfileEditScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: 20,
		paddingHorizontal: 20
	},
	profileContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 20
	},
	profileImg: {
		width: 110,
		height: 110,
		borderRadius: 55,
		borderWidth: 3,
		borderColor: GlobalStyles.colors.softGrey
	},
	profileEditBtn: {
		width: 30,
		height: 30,
		backgroundColor: GlobalStyles.colors.softGrey,
		borderRadius: 15,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		right: 0
	}
})