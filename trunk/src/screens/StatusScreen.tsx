import {
	View,
	FlatList,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Animated,
	NativeSyntheticEvent,
	NativeScrollEvent
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native';

// components
import CustomText from '../components/CustomText'
import StatusList from '../components/status/StatusList';

// styles
import { GlobalStyles } from '../constants/styles';

// dummy data
import { STATUS_DATA } from '../config/post_data';

const windowWidth = Dimensions.get('window').width;

const StatusScreen = () => {
	const [scorllIndex, setScorllIndex] = useState<number>(0);
	const [currentDatas, setCurrentDatas] = useState<any>([]);
	const [historyDatas, setHistoryDatas] = useState<any>([]);

	const scrollX = useRef(new Animated.Value(0)).current;

	const ScrollViewRef = useRef<ScrollView>(null);
	const navigation = useNavigation<any>();

	const getCurrentDatas = () => {
		const filtered = STATUS_DATA.filter((item) => item.variant == "current");
		setCurrentDatas(filtered);
	};

	const getHistoryDatas = () => {
		const filtered = STATUS_DATA.filter((item) => item.variant == "history");
		setHistoryDatas(filtered);
	}

	const onPressItem = () => {
		navigation.navigate("Map");
	}

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollX = event.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(scrollX / windowWidth);
		setScorllIndex(currentIndex);
	}

	useEffect(() => {
		getCurrentDatas();
		getHistoryDatas();
	}, []);

	useEffect(() => {
		if (ScrollViewRef.current) {
			ScrollViewRef.current.scrollTo({ x: scorllIndex * windowWidth, animated: true });
		}
	}, [scorllIndex]);

	return (
		<View style={styles.container}>
			{/* start tab container */}
			<View style={{
				flexDirection: "row",
				backgroundColor: "#fff",
				marginBottom: 5,
				position: "relative"
			}}>
				<TouchableOpacity
					style={styles.filterTab}
					onPress={() => { setScorllIndex(0) }}
				>
					<CustomText text='Current' textStyle={styles.filterText} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.filterTab}
					onPress={() => { setScorllIndex(1) }}
				>
					<CustomText text='History' textStyle={styles.filterText} />
				</TouchableOpacity>
				<Animated.View style={[styles.activeTab, {
                    transform: [{
                        translateX: scrollX.interpolate({
                            inputRange: [0, windowWidth],
                            outputRange: [0, windowWidth / 2]
                        })
                    }]
                }]} />
			</View>
			{/* end tab container */}

			<ScrollView
				ref={ScrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={onScroll}
				onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
				style={{ flex: 1 }}
			>
				<StatusList data={currentDatas} />
				<StatusList data={historyDatas} />
			</ScrollView>
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
		position: 'absolute',
        bottom: 0,
        width: windowWidth / 2,
        height: 3,
        backgroundColor: GlobalStyles.colors.primaryColor,
	}
})