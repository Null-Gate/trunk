import {
	View,
	ScrollView,
	StyleSheet,
	Dimensions,
	Pressable
} from 'react-native'
import React, { useState, useEffect } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native';

// components
import ImageContainer from '../components/ImageContainer';
import CustomText from '../components/CustomText';
import ImageSlider from '../components/ImageSlider';

// icons
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// styles
import { GlobalStyles } from '../constants/styles';

// dummy data
import { FEED_DATA } from '../config/post_data';

const windowWidth = Dimensions.get('window').width;

const PostDetailScreen = () => {
	const [post, setPost] = useState<any>(FEED_DATA[0]);
	const [count, setCount] = useState<number>(0);

	const navigation = useNavigation<any>();

	useEffect(() => {
		navigation.setOptions({
			title: post.title
		})
	}, [])

	return (
		<View style={styles.container}>
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.postContainer}>
					<View style={styles.postHeader}>
						<ImageContainer
							imageSource={require('../assets/images/artist.png')}
							imageContainerStyle={{
								width: 44,
								height: 44,
								borderRadius: 22
							}}
						/>
						<View>
							<CustomText
								text='Otto Anderson'
								textStyle={{
									fontSize: 16
								}}
							/>
							<CustomText
								text='1 day ago'
								textStyle={{
									color: "#c9c9c9",
									fontSize: 12
								}}
							/>
						</View>
					</View>
					<ImageSlider
						slides={post.imgs}
						imageSliderWidth={windowWidth - 16}
						imageSliderHeight={windowWidth - 16}
					/>
					<View style={styles.postDetailContainer}>
						{/* title  */}
						<CustomText text={post.title} textStyle={styles.postTitle} />
						{/* descirption */}
						<CustomText text={post.descirption} textStyle={{ fontSize: 16 }} />
					</View>
				</View>
			</ScrollView>
			<View style={styles.actionContainer}>
				<View style={{
					flexDirection: "row",
					alignItems: "center"
				}}>
					<Pressable
						style={styles.voteBtn}
						android_ripple={{ color: "#ccc" }}
						onPress={() => setCount(prev => prev + 1)}
					>
						<AntDesign name="like2" size={20} color="#616161" />
					</Pressable>
					<CustomText text={count.toString()} textStyle={{
						marginHorizontal: 12,
						color: "#616161"
					}} />
					<Pressable
						style={styles.voteBtn}
						android_ripple={{ color: "#ccc" }}
						onPress={() => setCount(prev => prev - 1)}
					>
						<AntDesign name="dislike2" size={20} color="#616161" />
					</Pressable>
				</View>
			</View>
		</View>
	)
}

export default PostDetailScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 8,
		position: "relative"
	},
	postContainer: {
		backgroundColor: "#faf5f5",
		borderRadius: 15,
		overflow: "hidden",
		marginTop: 8,
		marginBottom: 75
	},
	postHeader: {
		padding: 15,
		flexDirection: "row",
		gap: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#cfcfcf",
		marginBottom: 8
	},
	postDetailContainer: {
		paddingVertical: 25,
		paddingHorizontal: 18
	},
	postTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10
	},
	actionContainer: {
		backgroundColor: "#ebebeb",
		width: windowWidth,
		position: "absolute",
		left: 0,
		bottom: 0,
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: "row",
		justifyContent: "center"
	},
	voteBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})