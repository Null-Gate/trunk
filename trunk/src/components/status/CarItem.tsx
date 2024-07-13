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
import { AntDesign } from '@expo/vector-icons';

interface CarItemProps {
    model: string,
    category: string,
    description: string,
    // onPress: () => void
}

const CarItem = ({
    model,
    category,
    description,
    // onPress
}: CarItemProps) => {
    return (
        <Pressable
            android_ripple={{ color: "#ccc" }}
            // onPress={onPress}
        >
            <View style={styles.CarItem}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
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
                    <AntDesign name="infocirlce" size={20} color={GlobalStyles.colors.primaryColor} />
                </View>
                <CustomText text={model} textStyle={styles.destination} />
                <CustomText text={description} textStyle={{ color: "#636363" }} />
            </View>
        </Pressable>
    )
}

export default CarItem

const styles = StyleSheet.create({
    CarItem: {
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