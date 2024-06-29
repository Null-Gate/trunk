import {
	View,
	StyleSheet,
	Pressable
} from 'react-native'
import React from 'react'

// components
import ImageContainer from '../ImageContainer'
import CustomText from '../CustomText'

// icons
import { MaterialIcons } from '@expo/vector-icons';

interface NotificationProps {
	creator: string,
	message: string,
	createdDate: string
}

const Notification = ({
	creator,
	message,
	createdDate
}: NotificationProps) => {
	return (
		<View style={styles.container}>
			<ImageContainer
				imageSource={require('../../assets/images/artist.png')}
				imageContainerStyle={{
					width: 50,
					height: 50,
					borderRadius: 25
				}}
			/>
			<View style={{ flex: 1 }}>
				<CustomText text={creator} textStyle={{
					fontWeight: "bold"
				}} />
				<CustomText text={message} />
				<CustomText text={createdDate} textStyle={{ color: "#c9c9c9", fontSize: 12 }} />
			</View>
			<View style={styles.activeLogo}></View>
		</View>
	)
}

export default Notification

const styles = StyleSheet.create({
	container: {
		paddingVertical: 15,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
		borderRadius: 10,
		flexDirection: "row",
		gap: 10,
		marginBottom: 10,
		position: 'relative'
	},
	activeLogo: {
		position: "absolute",
		top: 15,
		right: 8,
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: '#ff5608'
	}
})