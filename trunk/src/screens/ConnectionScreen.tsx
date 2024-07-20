import {
	View,
	FlatList,
	StyleSheet
} from 'react-native'
import React, { useState, useEffect } from 'react'

// styles
import { GlobalStyles } from '../constants/styles'

// components
import ConnectionItem from '../components/connection/ConnectionItem'
import ConnectionModal from '../components/connection/ConnectionModal'

// dummy data
import { CONNECTION_DATA } from '../config/post_data'

interface ConnectionModalInfo {
	modalVisible: boolean
}

const ConnectionScreen = () => {
	const [connections, setConnections] = useState<any>([]);
	const [connectionModalInfo, setConnectionModalInfo] = useState<ConnectionModalInfo>({
		modalVisible: false
	})

	const openConnectionModal = () => {
		setConnectionModalInfo(prevInfo => {
			const newInfo = {
				...prevInfo,
				modalVisible: true,
			}
			return newInfo;
		})
	}

	const closeConnectionModal = () => {
		setConnectionModalInfo(prevInfo => {
			const newInfo = {
				...prevInfo,
				modalVisible: false,
			}
			return newInfo;
		})
	}

	useEffect(() => {
		setConnections(CONNECTION_DATA)
	}, [])

	return (
		<>
			<FlatList
				data={connections}
				style={styles.container}
				renderItem={({ item }) => <ConnectionItem username={item.username} onPressOption={openConnectionModal} />}
				showsVerticalScrollIndicator={false}
				keyExtractor={item => item.id.toString()}
			/>
			<ConnectionModal 
				visible={connectionModalInfo.modalVisible}
				closeModal={closeConnectionModal}
			/>
		</>
	)
}

export default ConnectionScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	}
})