import {
	View,
	ScrollView,
	Modal,
	StyleSheet,
	Dimensions,
	Pressable,
	TouchableOpacity
} from 'react-native'
import React, { useState, useEffect } from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';

// moment
import moment from 'moment';

// expo image picker
import * as ImagePicker from 'expo-image-picker';

// icons
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// components
import CustomInput from '../components/CustomInput';
import CustomText from '../components/CustomText';
import DatePicker from '../components/DatePicker';
import ImageContainer from '../components/ImageContainer';
import CustomModal from '../components/CustomModal';
import MapContainer from '../components/postCreate/MapContainer';

interface CoordinateProps {
	latitude: number;
	longitude: number;
};

interface LocationProps {
	coordinate: CoordinateProps | null;
	address: string;
}

interface LocationsProps {
	from: LocationProps,
	to: LocationProps
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PostCreateScreen = () => {
	const [photos, setPhotos] = useState<string[]>([]);
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [amount, setAmount] = useState<string>("0");
	const [weight, setWeight] = useState<string>("0");
	const [date, setDate] = useState<string>(moment(new Date()).format('YYYY/MM/DD'));
	const [locations, setLocations] = useState<LocationsProps>({
		from: {
			coordinate: null,
			address: ""
		},
		to: {
			coordinate: null,
			address: ""
		}
	})
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [mapModalData, setMapModalData] = useState<any>({
		visible: false,
		current: 0, // 0 => from, 1 => to
		currentCoordinate: {
			from: null,
			to: null
		}
	})

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
			setPhotos(prevPhotos => [...prevPhotos, result.assets[0].uri]);
		}
	};

	const openModal = () => {
		setModalVisible(true);
	}

	const closeModal = () => {
		setModalVisible(false);
	}

	const openMap = (current: 0 | 1) => {
		setMapModalData((prevData: LocationProps) => {
			const newData = {
				...prevData,
				visible: true,
				current
			}
			return newData;
		})
	}

	/**
   * close map modal .
   *
   * @todo fix prevData type
   */
	const closeMap = () => {
		setMapModalData((prevData: LocationProps) => {
			const newData = {
				...prevData,
				visible: false
			}
			return newData;
		})
	}

	const onChooseLocation = (address: string, coordinate: CoordinateProps) => {
		console.log({
			address,
			coordinate
		})
		if (mapModalData.current === 0) {
			// from case
			setLocations((prevLocations: LocationsProps) => {
				const newFromLoaction = {
					...prevLocations.from,
					address,
					coordinate
				};
				const newLocations = {
					...prevLocations,
					from: newFromLoaction
				}
				return newLocations;
			})
		} else if (mapModalData.current === 1) {
			// to case
			setLocations((prevLocations: LocationsProps) => {
				const newToLocation = {
					...prevLocations.to,
					address,
					coordinate
				}
				const newLocations = {
					...prevLocations,
					to: newToLocation
				}
				return newLocations;
			})
		}
		
		setMapModalData((prevDatas: any) => {
			const newData = {
				...prevDatas,
				currentCoordinate: coordinate
			}
			return newData;
		})
	}

	return (
		<>
			<SafeAreaProvider>
				<ScrollView style={styles.container}>
					{/* start photos */}
					<View>
						<CustomText
							text="Photos"
							textStyle={{
								color: "grey",
								marginBottom: 3
							}}
						/>
						<Pressable onPress={pickImage}>
							<View style={{
								height: windowWidth - 80,
								borderWidth: 1.8,
								borderRadius: 15,
								borderColor: '#a6a6a6',
								borderStyle: 'dashed',
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 20
							}}>
								<Ionicons name="add" size={70} color="#a6a6a6" />
							</View>
						</Pressable>
					</View>
					{/* end photos */}

					{/* start locations */}
					<View style={{ marginBottom: 15 }}>
						<CustomText
							text="Locations"
							textStyle={{
								color: "grey",
								marginBottom: 2
							}}
						/>
						<View style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 5,
							marginBottom: 3
						}}>
							<Ionicons name="alert-circle-outline" size={18} color="grey" />
							<CustomText
								text="Click map to choose location"
								textStyle={{
									fontSize: 12,
									color: "grey"
								}}
							/>
						</View>
						<TouchableOpacity
							style={{
								borderRadius: 5,
								borderWidth: 0.5,
								borderColor: "#a6a6a6",
								overflow: "hidden"
							}}
							onPress={openModal}
						>
							<ImageContainer
								imageSource={require('../assets/images/map.png')}
								imageContainerStyle={{
									width: '100%',
									height: 100
								}}
							/>
						</TouchableOpacity>
					</View>
					{/* end locations */}

					{/* start name */}
					<CustomInput
						title='Name'
						value={name}
						onChangeText={setName}
						placeholder='Myint Chin'
						style={{ marginBottom: 15 }}
					/>
					{/* end name */}

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 15
						}}
					>
						{/* start weight */}
						<CustomInput
							title='Weight'
							value={weight}
							onChangeText={setWeight}
							placeholder='0'
							style={{ width: "48%" }}
						/>
						{/* end weight */}

						{/* start amount */}
						<CustomInput
							title='Amount'
							value={amount}
							onChangeText={setAmount}
							placeholder='0'
							style={{ width: "48%" }}
						/>
						{/* end amount */}

					</View>

					{/* start date */}
					<DatePicker
						labelName='Date'
						date={date}
						onChooseDate={setDate}
						style={{ marginBottom: 15 }}
					/>
					{/* end date */}

					{/* start description */}
					<CustomInput
						title='Description'
						value={description}
						onChangeText={setDescription}
						placeholder='Package Ka Bar Nyar Poh'
						style={{ marginBottom: 15 }}
						inputStyle={{
							height: 120,
							textAlignVertical: 'top'
						}}
					/>
					{/* end description */}
				</ScrollView>
			</SafeAreaProvider >

			{/* start location modal */}
			<CustomModal
				visible={modalVisible}
				closeModal={closeModal}
			>
				<View style={{
					paddingHorizontal: 15
				}}>
					<View style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
					}}>
						<CustomText
							text="Choose Locations"
							textStyle={{ fontSize: 18 }}
						/>
						<Pressable onPress={closeModal}>
							<AntDesign name="close" size={24} color="black" />
						</Pressable>
					</View>
					<Pressable
						onPress={() => openMap(0)}
					>
						<CustomInput
							title='From'
							value={locations.from.address}
							placeholder='Start location bar nyar poh'
							onChangeText={(text: string) => {
								setLocations((prevLocations: LocationsProps) => {
									const prevFromLocation = {
										...prevLocations.from,
										address: text
									};
									const newFromLocation = {
										...prevLocations,
										from: prevFromLocation
									};
									return newFromLocation;
								})
							}}
							editable={false}
							style={{ marginBottom: 15 }}
						/>
					</Pressable>
					<Pressable
						onPress={() => openMap(1)}
					>
						<CustomInput
							title='To'
							value={locations.to.address}
							placeholder='End location bar nyar poh'
							onChangeText={(text: string) => {
								setLocations((prevLocations: LocationsProps) => {
									const prevToLocation = {
										...prevLocations.to,
										address: text
									};
									const newToLocation = {
										...prevLocations,
										to: prevToLocation
									};
									return newToLocation;
								})
							}}
							editable={false}
						/>
					</Pressable>
				</View>
			</CustomModal>
			{/* end location modal */}

			{/* start map */}
			<Modal
				animationType="slide"
				transparent={false}
				visible={mapModalData.visible}
				onRequestClose={closeMap}
			>
				<MapContainer
					initialCoordinate={mapModalData.currentCoordinate}
					onChooseLocation={onChooseLocation}
				/>
			</Modal>
			{/* end map */}
		</>
	)
}

export default PostCreateScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 15,
		paddingTop: 20,
	}
})