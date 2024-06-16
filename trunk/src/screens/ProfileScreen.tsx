import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	FlatList,
	Pressable,
	ScrollView
} from 'react-native'
import { useState } from 'react';

//react navigation
import { useNavigation } from "@react-navigation/native";

//components
import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import ImageContainer from '../components/ImageContainer';
import { GlobalStyles } from '../constants/styles';
import CustomButton from '../components/CustomButton';
import Connection from '../components/Profile/Connection';
import Post from '../components/NewFeed/Post';
import ImageModal from '../components/NewFeed/ImageModal';

//dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//data
import { CONNECTION_DATA, ConnectionData } from '../config/connections';
import { POST_DATA } from '../config/posts';

//icons
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

interface ImageModalInfo {
	modalVisible: boolean;
	pressedImgIndex: number | null;
	post: any
}

const ProfileScreen = () => {
	const [connections, setConnections] = useState<ConnectionData[]>(CONNECTION_DATA);
	const [currentPostType, setCurrentPostType] = useState<number>(1);
	const [imageModalInfo, setImageModalInfo] = useState<ImageModalInfo>({
		modalVisible: false,
		pressedImgIndex: null,
		post: null
	});

	const navigation = useNavigation<any>();

	const closeImageModal = () => {
		setImageModalInfo(prevInfo => {
			const newInfo = {
				...prevInfo,
				modalVisible: false,
				pressedImgIndex: null,
				post: null
			}
			return newInfo;
		})
	}

	const openImageModal = (
		postId: number | string,
		pressedImgIndex: number
	) => {
		const selectedPost = POST_DATA.filter(post => post.id === postId)[0];
		setImageModalInfo(prevInfo => {
			const newInfo = {
				...prevInfo,
				modalVisible: true,
				pressedImgIndex,
				post: selectedPost
			}
			return newInfo;
		})
	};

	const navigatePostDetail = (id: number | string) => {
		navigation.navigate('PostDetail', {
			postId: id
		})
	}

	const goBackHandler = () => {
		navigation.goBack();
	}

	const navigateProfileEdit = () => {
		navigation.navigate('ProfileEdit');
	}

	const renderHeader = () => {
		return (
			<View>
				{/* start top container */}
				<View style={styles.topContainer}>
					<Pressable onPress={goBackHandler} style={styles.backBtn}>
						<Ionicons name="arrow-back" size={24} color="#f7f7f7" />
					</Pressable>
					<Pressable style={styles.editBtn} onPress={navigateProfileEdit}>
						<Feather name="edit" size={20} color="#f7f7f7" />
					</Pressable>
					<View style={styles.topInnerContainer}>
						<ImageContainer
							imageSource={require("./../assets/image2.png")}
							imageContainerStyle={styles.imageContainer}
						/>
						<CustomText textStyle={styles.fullName}>Mark Albert</CustomText>
						<CustomText textStyle={styles.userName}>@markalbert252</CustomText>
						<View style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 30,
							paddingTop: 20
						}}>
							<View style={styles.btnContainer}>
								<AntDesign name="message1" size={18} color="black" />
							</View>
							<CustomButton
								title='FOLLOW'
								btnStyle={styles.followBtn}
								textStyle={styles.followBtnText}
							/>
							<View style={styles.btnContainer}>
								<AntDesign name="sharealt" size={18} color="black" />
							</View>
						</View>
					</View>
				</View>
				{/* end top container */}
				{/* start connection list */}
				<View style={styles.connectionListContainer}>
					<View style={{
						flexDirection: "row",
						justifyContent: "space-between"
					}}>
						<CustomText textStyle={styles.generalTitle}>Connection</CustomText>
						<CustomButton
							title='See All'
							btnStyle={styles.seeAllBtn}
							textStyle={styles.seeAllBtnText}
						/>
					</View>
					<FlatList
						data={connections}
						renderItem={({ item }) => <Connection url={item.img} username={item.username} />}
						horizontal
						showsHorizontalScrollIndicator={false}
					/>
				</View>
				{/* end connection list */}
				<CustomText textStyle={[styles.generalTitle, { paddingHorizontal: 10, marginTop: 20 }]}>Posts</CustomText>
			</View>
		)
	}

	return (
		<>
			<Layout>
				<FlatList
					style={styles.postListContainer}
					data={POST_DATA}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						return <Pressable
							onPress={() => {
								navigatePostDetail(item.id);
							}}
						>
							<Post
								id={item.id}
								username={item.user}
								description={item.descirption}
								imgs={item.imgs}
								onPressedPostImage={openImageModal}
							/>
						</Pressable>
					}}
					keyExtractor={item => item.id.toString()}
					ListHeaderComponent={renderHeader}
				/>
			</Layout>
			<ImageModal
				post={imageModalInfo.post}
				pressedImageIndex={imageModalInfo.pressedImgIndex}
				visible={imageModalInfo.modalVisible}
				close={closeImageModal}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	topContainer: {
		position: "relative",
		paddingTop: 80,
		backgroundColor: GlobalStyles.colors.primaryColor,
		borderBottomColor: "#f7f7f7",
		borderBottomWidth: 8
	},
	backBtn: {
		position: "absolute",
		top: 30,
		left: 10
	},
	editBtn: {
		position: "absolute",
		top: 30,
		right: 10
	},
	topInnerContainer: {
		backgroundColor: "#fafafa",
		borderTopRightRadius: 35,
		borderTopLeftRadius: 35,
		paddingTop: 45,
		paddingBottom: 20,
	},
	fullName: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	userName: {
		color: "grey",
		fontSize: 14,
		fontWeight: 600,
		textAlign: "center"
	},
	imageContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 3,
		borderColor: "#fff",
		position: "absolute",
		top: 0,
		left: "50%",
		transform: [{ translateX: -40 }, { translateY: -40 }],
	},
	followBtn: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 25,
		paddingVertical: 8,
		borderRadius: 20
	},
	followBtnText: {
		fontSize: 12,
		fontWeight: "400"
	},
	btnContainer: {
		width: 40,
		height: 40,
		backgroundColor: "#f7f7f7",
		borderRadius: 20,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	connectionListContainer: {
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderBottomColor: "#f7f7f7",
		borderBottomWidth: 8
	},
	generalTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20
	},
	seeAllBtn: {
		paddingVertical: 0,
		paddingHorizontal: 0,
		backgroundColor: "#fff",
		elevation: 0
	},
	seeAllBtnText: {
		color: "#0041a8"
	},
	postListContainer: {
		paddingBottom: 20,
	},
})

export default ProfileScreen;