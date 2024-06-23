import {
    View,
    Pressable,
    StyleSheet,
    TextStyle,
    ViewStyle,
    StyleProp
} from 'react-native'
import React, { ReactNode } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native';

// components
import CustomText from '../components/CustomText'

//icons
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ListItemProps = {
    title: string,
    icon: ReactNode,
    listItemstyle?: StyleProp<ViewStyle>,
    listItemTextStyle?: StyleProp<TextStyle>,
    showArrowIcon?: boolean,
    onPress?: () => void
}

const ListItem = ({
    title,
    icon,
    listItemstyle = {},
    listItemTextStyle = {},
    showArrowIcon = true,
    onPress = () => { }
}: ListItemProps) => {
    return (
        <Pressable
            style={[{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 20,
            }, listItemstyle]}
            android_ripple={{ color: "#ccc" }}
            onPress={onPress}
        >
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20
            }}>
                {icon}
                <CustomText textStyle={[{ color: "#636363" }, listItemTextStyle]} text={title} />
            </View>
            <View>
                {showArrowIcon && (
                    <MaterialIcons name="arrow-forward-ios" size={15} color="#636363" />
                )}
            </View>
        </Pressable>
    )
}


const MenuScreen = () => {
    const navigation = useNavigation<any>();

    const navigateToProfile = () => {
        navigation.navigate("Profile");
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 20 }}>
                <CustomText
                    textStyle={styles.title}
                    text='Profile'
                />
                <View>
                    <ListItem
                        title='Profile'
                        icon={<FontAwesome name="user-circle-o" size={24} color="black" />}
                        onPress={navigateToProfile}
                    />
                </View>
            </View>
            <View>
                <CustomText
                    textStyle={styles.title}
                    text='Setting'
                />
                <View>
                    <ListItem
                        title='Change Password'
                        icon={<MaterialCommunityIcons name="key-variant" size={24} color="black" />}
                    />
                    <ListItem
                        title='Contact Us'
                        icon={<MaterialIcons name="local-phone" size={24} color="black" />}
                    />
                    <ListItem
                        title='Logout'
                        icon={<MaterialCommunityIcons name="logout" size={24} color="red" />}
                        listItemTextStyle={{ color: "red" }}
                        showArrowIcon={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default MenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: "#fff"
    },
    title: {
        fontFamily: 'Poppins-Thin',
        fontWeight: "semibold"
    }
})