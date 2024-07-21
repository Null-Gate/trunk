import {
    View,
    StyleSheet,
    Pressable
} from 'react-native'
import React, { useEffect } from 'react'

// components
import CustomText from '../CustomText'

// styles
import { GlobalStyles } from '../../constants/styles'

// icons
import { Fontisto } from '@expo/vector-icons';

interface PackageItemProps {
    startDestination: string,
    endDestination: string,
    category: string,
    items: string[],
    onPress: () => void
}

const PackageItem = ({
    startDestination,
    endDestination,
    category,
    items,
    onPress
}: PackageItemProps) => {
    return (
        <Pressable
            android_ripple={{ color: "#ccc" }}
            onPress={onPress}
        >
            <View style={styles.packageItem}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <View style={{
                        backgroundColor: GlobalStyles.colors.primaryColor,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginBottom: 10
                    }}>
                        <CustomText text={category} textStyle={{ color: "#fff" }} />
                    </View>
                    <Fontisto name="map" size={20} color={GlobalStyles.colors.primaryColor} />
                </View>
                <CustomText text={`${startDestination} to ${endDestination}`} textStyle={styles.destination} />
                <CustomText text={items.toString()} textStyle={{ color: "#636363" }} />
            </View>
        </Pressable>
    )
}

export default PackageItem

const styles = StyleSheet.create({
    packageItem: {
        padding: 15,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: GlobalStyles.colors.softGrey,
        borderRadius: 10
    },
    destination: {
        fontSize: 18,
        fontWeight: "semibold",
    }
})