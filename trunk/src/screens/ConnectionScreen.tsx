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

// dummy data
import { CONNECTION_DATA } from '../config/post_data'

const ConnectionScreen = () => {
	const [connections, setConnections] = useState<any>([]);

	useEffect(() => {
		setConnections(CONNECTION_DATA)
	}, [])

	return (
		<FlatList 
			data={connections}
			style={styles.container}
			renderItem={({ item }) => <ConnectionItem username={item.username} />}
			showsVerticalScrollIndicator={false}
			keyExtractor={item => item.id.toString() }
		/>
	)
}

export default ConnectionScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	}
})