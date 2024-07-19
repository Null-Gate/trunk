import {
    View,
    ScrollView,
    Pressable,
    StyleSheet
} from 'react-native'
import React from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import ImageContainer from '../components/ImageContainer'
import CustomText from '../components/CustomText'
import CustomButton from '../components/CustomButton'

// icons
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

// styles
import { GlobalStyles } from '../constants/styles'

const ProfileScreen = () => {
    const navigation = useNavigation<any>();

    const navigateConnection = () => {
        navigation.navigate("Connection");
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <ImageContainer
                    imageSource={require('../assets/images/artist.png')}
                    imageContainerStyle={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 3,
                        borderColor: "#fff",
                        marginBottom: 10
                    }}
                />

                {/* start username */}
                <CustomText
                    text='Otto Anderson'
                    textStyle={{
                        color: "#fff",
                        fontSize: 20,
                    }}
                />
                {/* end username */}

                {/* start connections */}
                <View style={{

                    marginBottom: 25
                }}>
                    <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 5,
                        }}
                        onPress={navigateConnection}
                    >
                        <CustomText
                            text='125'
                            textStyle={{
                                color: "#fff",
                                fontSize: 14,
                            }}
                        />
                        <CustomText
                            text='Connections'
                            textStyle={{
                                color: "#dbdbdb",
                                fontSize: 12
                            }}
                        />
                    </Pressable>
                </View>
                {/* end connections */}

                <View style={styles.actionContainer}>
                    <Pressable>
                        <Ionicons name="chatbox-ellipses-sharp" size={24} color="#fff" />
                    </Pressable>
                    <CustomButton
                        title='Connect'
                        onPress={() => { console.log("connected") }}
                        style={{
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 20,
                            borderRadius: 20
                        }}
                        textStyle={{ color: '#000000' }}
                    />
                    <Pressable>
                        <FontAwesome5 name="share-alt-square" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer: {
        backgroundColor: GlobalStyles.colors.primaryColor,
        paddingVertical: 25,
        flexDirection: "column",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40
    }
})