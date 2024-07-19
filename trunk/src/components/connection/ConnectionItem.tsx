import {
    View,
    StyleSheet,
    Dimensions,
    Pressable
} from 'react-native'
import React from 'react'

// components
import CustomText from '../CustomText'
import ImageContainer from '../ImageContainer'

// styles
import { GlobalStyles } from '../../constants/styles'

// icons
import { Entypo } from '@expo/vector-icons';

interface ConnectionItemProps {
    username: string
}

const ConnectionItem = ({
    username
}: ConnectionItemProps) => {
    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <View style={{
                width: windowWidth * .75,
                flexDirection: "row",
                gap: 5
            }}>
                <ImageContainer
                    imageSource={require('../../assets/images/artist.png')}
                    imageContainerStyle={styles.imageContainer}
                />
                <View>
                    <CustomText 
                        text={username}
                        textStyle={{ 
                            fontSize: 16
                         }}
                    />
                    <CustomText text='connected one week ago. ' />
                </View>
            </View>
            <View>
                <Pressable>
                    <Entypo name="dots-three-vertical" size={22} color="black" />
                </Pressable>
            </View>
        </View>
    )
}

export default ConnectionItem

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: GlobalStyles.colors.softGrey
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
})