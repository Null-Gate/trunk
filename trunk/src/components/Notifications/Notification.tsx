import {
    View,
    Image,
    Pressable,
    StyleSheet
} from 'react-native'

import React from 'react';

//components
import ImageContainer from '../ImageContainer';
import CustomText from '../CustomText';

//icons
import { Entypo } from '@expo/vector-icons';

type Notification = {
    notiMessage: string,
    user: {
        name: string,
        img: string
    },
    created_date: string,
    pressDetail: () => void
}

const Notification = ({
    notiMessage,
    user,
    created_date,
    pressDetail = () => {}
}: Notification) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <ImageContainer
                    viewImage={
                        <Image
                            style={styles.viewImage}
                            source={{ uri : user.img }}
                        />
                    }
                    imageContainerStyle={{
                        width: 30,
                        height: 30,
                        borderRadius: 15
                    }}
                />
                <View>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}>
                        <CustomText textStyle={styles.user}>{`${user.name}:`}</CustomText>
                        <CustomText textStyle={styles.date}>{created_date}</CustomText>
                    </View>
                    <CustomText textStyle={styles.message}>{notiMessage}</CustomText>
                </View>
            </View>
            <Pressable onPress={pressDetail}>
                <Entypo name="dots-three-vertical" size={16} color="grey" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "black",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 8
    },
    leftContainer: {
        width: '80%',
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    rightContainer: {
        width: "20%"
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    user: {
        fontWeight: "bold",
        fontSize: 14
    },
    date: {
        fontSize: 15,
        color: "grey"
    },
    message: {
        fontSize: 14,
        color: "grey"
    }
})

export default Notification