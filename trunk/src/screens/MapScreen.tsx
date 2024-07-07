import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import React, { useRef, useCallback, useMemo } from 'react'
import { GestureHandlerRootView } from "react-native-gesture-handler";

// bottom sheet
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

// components
import CustomText from '../components/CustomText';
import ImageContainer from '../components/ImageContainer';
import CustomMapContainer from '../components/CustomMapContainer';

// icons
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";

// styles
import { GlobalStyles } from '../constants/styles';

/* 
Gestures are movements or actions performed by users on a touch-sensitive device (such as a smartphone or tablet)
*/

const MapScreen = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const MapRef = useRef<any>(null);

    const snapPoints = useMemo(() => ["13%", "28%", "50%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <CustomMapContainer />
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snapPoints}
                style={{ paddingHorizontal: 10 }}
            >
                <TouchableOpacity
                    // onPress={() => focusDestination("Origin", "Destination")}
                    style={styles.destinationContainer}
                >
                    <View>
                        <Entypo name="location-pin" size={20} />
                        <View
                            style={{
                                borderRightWidth: 2,
                                borderStyle: "dotted",
                                height: 25,
                                width: 11,
                            }}
                        />
                        <Entypo name="location-pin" size={20} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <CustomText text='Yangon' textStyle={styles.destinationText} />
                        </View>
                        <View style={{ height: 20 }} />
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <CustomText text='Mandalay' textStyle={styles.destinationText} />
                        </View>
                    </View>
                    <View>
                        <CustomText text='2d' />
                    </View>
                </TouchableOpacity>
                <BottomSheetScrollView 
                    showsVerticalScrollIndicator={false}
                    style={styles.contentContainer}
                >
                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: GlobalStyles.colors.softGrey
                    }}>
                        {/* start profile */}
                        <View style={styles.listContainer}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    alignItems: "center"
                                }}
                            >
                                <ImageContainer
                                    imageSource={require('../assets/images/artist.png')}
                                    imageContainerStyle={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20
                                    }}
                                />
                                <CustomText text='U Wai Linn' />
                            </View>
                            <View>
                                <View style={styles.iconContainer}>
                                    <Entypo name="message" size={22} color={"white"} />
                                </View>
                            </View>
                        </View>
                        {/* end profile */}

                        {/* start carstaus */}
                        <View style={styles.listContainer}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    alignItems: "center"
                                }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: GlobalStyles.colors.softGrey }]}>
                                    <FontAwesome5 name="truck" size={20} color="black" />
                                </View>
                                <CustomText text='Ashok Leyland 2820-6x4' />
                            </View>
                            <View>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="settings-sharp" size={22} color="#fff" />
                                </View>
                            </View>
                        </View>
                        {/* end carstatus */}
                    </View>

                    {/* start package list */}
                    <View style={{
                        paddingVertical: 10,
                    }}>
                        <TouchableOpacity
                            style={styles.packageContainer}
                        >
                            <CustomText
                                text='Package 001'
                                textStyle={{
                                    fontSize: 18
                                }}
                            />
                            <CustomText text='User 1' />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.packageContainer}
                        >
                            <CustomText
                                text='Package 001'
                                textStyle={{
                                    fontSize: 18
                                }}
                            />
                            <CustomText text='User 1' />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.packageContainer}
                        >
                            <CustomText
                                text='Package 001'
                                textStyle={{
                                    fontSize: 18
                                }}
                            />
                            <CustomText text='User 1' />
                        </TouchableOpacity>

                    </View>
                    {/* end package list */}

                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        height: "100%",
        gap: 5,
    },
    destinationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: GlobalStyles.colors.softGrey
    },
    destinationText: {
        fontSize: 16,
    },
    listContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 3
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: GlobalStyles.colors.activeGreen,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    packageContainer: {
        backgroundColor: "#F2F2F2",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 8
    }
})