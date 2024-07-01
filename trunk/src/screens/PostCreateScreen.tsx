import {
	View,
	ScrollView,
	StyleSheet,
	Dimensions
} from 'react-native'
import React, { useState } from 'react'

// icons
import { Ionicons } from '@expo/vector-icons';

// components
import CustomInput from '../components/CustomInput';
import CustomText from '../components/CustomText';


const windowWidth = Dimensions.get('window').width;

const PostCreateScreen = () => {
	const [packageName, setPackageName] = useState<string>("");
	const [packageDescription, setPackageDescription] = useState<string>("");

	return (
		<ScrollView style={styles.container}>
			<View>
				<CustomText
					text="Package Photos"
					textStyle={{
						color: "grey",
						marginBottom: 3
					}}
				/>
				<View style={{
					height: windowWidth - 80,
					borderWidth: 1.8,
					borderRadius: 15,
					borderColor: '#696969',
					borderStyle: 'dashed',
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: 20
				}}>
					<Ionicons name="add" size={70} color="#696969" />
				</View>
			</View>

			<CustomInput
				title='Package Name'
				value={packageName}
				onChangeText={setPackageName}
				placeholder='Myint Chin'
				style={{ marginBottom: 15 }}
			/>

			<CustomInput
				title='Package Description'
				value={packageDescription}
				onChangeText={setPackageDescription}
				placeholder='Package Ka Bar Nyar Poh'
				style={{ marginBottom: 15 }}
				inputStyle={{
					height: 120,
					textAlignVertical: 'top'
				}}
			/>

		</ScrollView>
	)
}

export default PostCreateScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 15,
		paddingTop: 20
	}
})