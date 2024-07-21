import {
	View,
	FlatList,
	StyleSheet,
	Dimensions
} from 'react-native'
import React, { useState, useEffect } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native';

// components
import CustomText from '../components/CustomText'
import ListItem from '../components/status/ListItem';

// styles
import { GlobalStyles } from '../constants/styles';

// dummy data
import { STATUS_DATA } from '../config/post_data';

const windowWidth = Dimensions.get('window').width;

const StatusScreen = () => {
	const [variant, setVariant] = useState("current");
	const [packages, setPackages] = useState<any>([]);
	const navigation = useNavigation<any>();

	const filterStatus = () => {
		const filtered = STATUS_DATA.filter((item) => item.variant ==variant);
		return setPackages(filtered);
	};

	const onPressItem = () => {
		navigation.navigate("Map");
	}

	useEffect(() => {
		filterStatus();
	}, [variant]);

	return (
		<View style={styles.container}>
			<View style={{
				flexDirection: "row",
				backgroundColor: "#fff",
				marginBottom: 5
			}}>
				<View style={[styles.filterTab, styles.activeTab]}>
					<CustomText text='Current' textStyle={styles.filterText} />
				</View>
				<View style={styles.filterTab}>
					<CustomText text='History' textStyle={styles.filterText} />
				</View>
			</View>

			<FlatList
				data={packages}
				renderItem={({ item }) => {
					return (
						<ListItem 
							startDestination={item.destination.from} 
							endDestination={item.destination.to}
							category={item.category} 
							items={item.items}
							onPress={onPressItem}
						/>
					)
				}}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					flex: 1,
					gap: 10,
					paddingHorizontal: 10,
					paddingVertical: 5,
				}}
			/>

		</View>
	)
}

export default StatusScreen

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	filterTab: {
		width: windowWidth / 2,
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 10
	},
	filterText: {
		fontSize: 14,
		fontWeight: "600"
	},
	activeTab: {
		borderBottomWidth: 3,
		borderBottomColor: GlobalStyles.colors.primaryColor
	}
})