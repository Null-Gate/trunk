import {
	FlatList,
	StyleSheet,
	Dimensions
} from 'react-native'
import React from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import CarItem from './CarItem'
import DriverItem from './DriverItem'
import PackageItem from './PackageItem'

const windowWidth = Dimensions.get('window').width;

interface StatusListProps {
	data: any
}

const StatusList = ({
	data
}: StatusListProps) => {
	const navigation = useNavigation<any>();

	const onPressPackage = (variant: string) => {
		if(variant === 'history') {
			navigation.navigate('PackageStatusDetail')
		} else {
			navigation.navigate("Map");
		}
	}

	const renderItem = ({ item }: any) => {
		if (item.category === "Package") {
			return (<PackageItem
				startDestination={item.destination.from}
				endDestination={item.destination.to}
				category={item.category}
				items={item.items}
				onPress={() => { onPressPackage(item.variant) }}
			/>)
		} else if (item.category === "Driver") {
			return (<DriverItem
				user={item.username}
				category={item.category}
				description={item.desc}
			/>)
		}

		return (<CarItem
			model={item.model}
			category={item.category}
			description={item.desc}
		/>)
	}
	return (
		<FlatList
			data={data}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.contentContainer}
			style={{ width: windowWidth }}
		/>
	)
}

export default StatusList

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		gap: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
	}
})