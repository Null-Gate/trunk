import {
	Pressable,
	View,
	StyleSheet
} from 'react-native'
import React, { useState } from 'react';

//expo image picker
import * as ImagePicker from 'expo-image-picker';

//react navigation
import { useNavigation } from "@react-navigation/native";

//icons
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

//styles
import { GlobalStyles } from '../constants/styles';

//components
import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import ImageContainer from '../components/ImageContainer';

const ProfileEditScreen = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>();
	const navigation = useNavigation();

	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const imageUrl = result.assets[0].uri;
			setSelectedImage(imageUrl);
		}
	}

	const backHandler = () => {
		navigation.goBack();
	}

	return (
		<Layout>
			<View style={styles.container}>
				{/* start header */}
				<View style={styles.header}>
					<Pressable onPress={backHandler}>
						<Ionicons name="arrow-back" size={24} color="black" />
					</Pressable>
					<CustomText textStyle={styles.headerText}>Edit Profile</CustomText>
				</View>
				{/* end header */}

				{/* start profile container */}
				<View style={styles.profileContainer}>
					<View style={{ position: "relative" }}>
						<ImageContainer
							imageSource={selectedImage ? { uri: selectedImage } : require('./../assets/image2.png')}
							imageContainerStyle={styles.profileImageContainer}
						/>
						<Pressable
							onPress={pickImageAsync}
						>
							<View style={styles.editBtn}>
								<Octicons name="pencil" size={15} color="black" />
							</View>
						</Pressable>
					</View>
				</View>
				{/* end profile container */}
			</View>
		</Layout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20
	},
	header: {
		flexDirection: "row",
		gap: 30,
		paddingVertical: 15
	},
	headerText: {
		fontSize: 18,
		fontWeight: "bold"
	},
	profileContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 30
	},
	profileImageContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderColor: "#dedede",
		borderWidth: 2,
		elevation: 8,
		marginTop: 20
	},
	editBtn: {
		width: 28,
		height: 28,
		backgroundColor: GlobalStyles.colors.softGrey,
		borderRadius: 14,
		position: "absolute",
		bottom: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		color: "grey",
		fontSize: 18,
		fontWeight: "bold"
	}
})

export default ProfileEditScreen;