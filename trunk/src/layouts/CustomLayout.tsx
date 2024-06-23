import {
    View,
    SafeAreaView,
    StyleSheet
} from 'react-native'
import React, { ReactNode } from 'react'

// components
import CustomText from '../components/CustomText'

interface CustomLayoutProps {
    title: string,
    children: ReactNode
}

const CustomLayout = ({
    title,
    children
}: CustomLayoutProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <CustomText text={title} textStyle={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "bold"
                    }} />
                </View>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default CustomLayout

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: "#fff"
    }
})