import {
	StyleSheet,
	View,
	FlatList,
	Dimensions
} from 'react-native'
import React from 'react'

// components
import Notification from '../components/notification/Notification'

// dummy data
import { NOTI_DATA } from '../config/post_data'

const windowWidth = Dimensions.get('window').width;

const NotificationScreen = () => {
	return (
		<View style={{ flex: 1 }}>
			<View>

			</View>
			<FlatList
				style={styles.listContainer}
				data={NOTI_DATA}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => {
					return <Notification creator={item.user.name} message={item.message} createdDate={item.created_date} />
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	filterTapContainer: {

	},
	filterTap: {
		width: windowWidth / 2
	},
	listContainer: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 10
	},
})

export default NotificationScreen