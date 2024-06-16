import {
    View,
    Pressable,
    StyleSheet
} from 'react-native'
import React from 'react';

//icons
import { MaterialIcons } from '@expo/vector-icons';

//components
import CustomText from '../CustomText';

type ListItem = {
    title: string,
    icon: React.JSX.Element,
    listItemstyle?: object,
    listItemText?: object,
    showArrowIcon?: boolean,
    onPress?: () => void
}

const ListItem = ({
    title,
    icon,
    listItemstyle = {},
    listItemText = {},
    showArrowIcon = true,
    onPress= () => {}
}) => {
    return (
        <Pressable
            style={[styles.listItemContainer, listItemstyle]}
            android_ripple={{ color: "#ccc" }}
            onPress={onPress}
        >
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15
            }}>
                {icon}
                <CustomText textStyle={[styles.listItemText, listItemText]}>{title}</CustomText>
            </View>
            <View>
                {showArrowIcon && (
                    <MaterialIcons name="arrow-forward-ios" size={18} color="#636363" />
                )}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15
    },
    listItemText: {
        fontSize: 16,
        color: "#636363"
    }
})

export default ListItem