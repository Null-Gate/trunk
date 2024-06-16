import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';

//components
import CustomText from '../components/CustomText';
import Layout from '../components/Layout';
import ListItem from '../components/Menu/ListItem';

//icons
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { GlobalStyles } from '../constants/styles';

//dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MenuScreen = () => {
    const navigation = useNavigation<any>();

    const navigateProfile = () => {
        navigation.navigate("Profile");
    }

    const navigatePasswordChange = () => {
        navigation.navigate("PasswordChange");
    }

    return (
        <Layout>
            <View style={styles.container}>
                <CustomText textStyle={styles.mainTitle}>Menu</CustomText>
                <View>
                    <View style={{ marginBottom: 15 }}>
                        <CustomText textStyle={styles.title}>Profile</CustomText>
                        <ListItem
                            title="Profile"
                            icon={<FontAwesome name="user-circle-o" size={20} color="black" />}
                            listItemstyle={{ marginBottom: 5 }}
                            onPress={navigateProfile}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <CustomText textStyle={styles.title}>Setting</CustomText>
                        <ListItem
                            title="Change Password"
                            icon={<FontAwesome5 name="key" size={20} color="black" />}
                            listItemstyle={{ marginBottom: 5 }}
                            onPress={navigatePasswordChange}
                        />
                        <ListItem
                            title="Contact Us"
                            icon={<FontAwesome name="phone" size={20} color="black" />}
                            listItemstyle={{ marginBottom: 10 }}
                        />
                        <ListItem
                            title="logout"
                            icon={<MaterialIcons name="logout" size={20} color="#eb4034" />}
                            showArrowIcon={false}
                            listItemText={{
                                color: "#eb4034",
                                fontSize: 16,
                                fontWeight: "semibold"
                            }}
                        />
                    </View>
                </View>
                {/* start app detail container */}
                <View style={styles.appDetailContainer}>
                    <CustomText textStyle={styles.detailText}>Version 1.0.0</CustomText>
                    <CustomText textStyle={styles.detailText}>Copyright@2024 Kar Gate</CustomText>
                    <CustomText textStyle={styles.detailText}>All rights reserved.</CustomText>
                </View>
                {/* end app detail container */}
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 25
    },
    title: {
        fontSize: 16,
        color: "#636363",
        marginBottom: 5,
        fontWeight: "semibold"
    },
    appDetailContainer: {
        width: windowWidth,
        position: "absolute",
        bottom: 30,
        left: 0,
    },
    detailText: {
        color: "#b8b8b8",
        fontSize: 14,
        marginBottom: 5,
        textAlign: "center"
    }
})

export default MenuScreen