import { View, StyleSheet } from 'react-native'
import React, { ReactNode } from 'react'

// components
import CustomText from './CustomText'

interface TabBarIconProps {
    title: string,
    color: string,
    icon: ReactNode
}

const TabBarIcon = ({
    title,
    color,
    icon
}: TabBarIconProps) => {
    return (
        <View style={styles.iconContainer}>
            {icon}
            <CustomText textStyle={[{ color: color }, styles.iconText]} text={title} />
        </View>
    )
}

export default TabBarIcon

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    iconText: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: "bold"
    }
})