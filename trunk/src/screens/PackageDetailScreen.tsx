import {
	View,
	ScrollView,
	StyleSheet,
	Dimensions
} from 'react-native'
import React, { useEffect } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import CustomText from '../components/CustomText'
import ListItem from '../components/PackageStatusDetail/ListItem'
import Separator from '../components/PackageStatusDetail/Separator'
import PackageItem from '../components/PackageStatusDetail/PackageItem'

// styles
import { GlobalStyles } from '../constants/styles'

const windowWidth = Dimensions.get('window').width;

const PackageDetailScreen = () => {
	const navigation = useNavigation<any>();

	useEffect(() => {
		navigation.setOptions({
			title: "Yangon To Mandalay"
		})
	}, [])

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<ListItem
					title='From'
					value='Yangon'
					style={{ marginBottom: 20 }}
				/>
				<ListItem
					title='To'
					value='Mandalay'
					style={{ marginBottom: 20 }}
				/>
				<ListItem
					title='Driver'
					value='Driver Bar Nyar Poh'
					style={{ marginBottom: 20 }}
				/>

				<Separator />

				<View>
					<CustomText
						text="Package Lists"
						textStyle={styles.title}
					/>
					<PackageItem />
				</View>

			</ScrollView>
		</View>
	)
}

export default PackageDetailScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 18,
		paddingHorizontal: 15
	},
	scrollContainer: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 20,
		paddingHorizontal: 15,
		borderRadius: 15
	},
	title: {
		color: "gray",
		fontSize: 16,
	}
})