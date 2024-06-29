import {
    View,
    FlatList,
    StyleSheet,
    Dimensions
} from 'react-native'
import React, { useState } from 'react'

// components
import CustomText from '../components/CustomText'

// styles
import { GlobalStyles } from '../constants/styles';

const windowWidth = Dimensions.get('window').width;

const StatusScreen = () => {
    const [variant, setVariant] = useState("current");

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                marginBottom: 5
            }}>
                <View style={[styles.filterTab, styles.activeTab]}>
                    <CustomText text='Current' textStyle={styles.filterText} />
                </View>
                <View style={styles.filterTab}>
                    <CustomText text='History' textStyle={styles.filterText} />
                </View>
            </View>

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
        borderBottomWidth: 3,
        borderBottomColor: GlobalStyles.colors.primaryColor
    }
})