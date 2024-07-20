import {
    View,
    Dimensions,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native'
import React from 'react'

// components
import CustomText from '../CustomText'

// styles
import { GlobalStyles } from '../../constants/styles';

const windowWidth = Dimensions.get('window').width;

interface ListItemProps {
    title: string,
    value: string,
    style?: StyleProp<ViewStyle>
}

const ListItem = ({
    title,
    value,
    style
}: ListItemProps) => {
    return (
        <View style={[styles.container, style]}>
            <View style={{
                width: windowWidth * 0.3,
                flexDirection: "row",
                justifyContent: 'space-between'
            }}>
                <CustomText text={title} textStyle={styles.title} />
                <CustomText text=':' />
            </View>
            <CustomText text={value} textStyle={styles.value} />
        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    title: {
        color: "gray",
        fontSize: 16
    },
    value: {
        fontSize: 16
    }
})