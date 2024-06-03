import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'
import React from 'react';

//components
import ImageContainer from '../ImageContainer';
import CustomText from '../CustomText';

type Connection = {
    url: string,
    username: string 
}

const Connection = ({
    url,
    username
}: Connection) => {
    const formattedName = username.split(' ')[0];
    return (
        <View style={styles.container}>
            <ImageContainer
                imageSource={{ uri: url }}
                imageContainerStyle={styles.imageContainer}
            />
            <CustomText textStyle={styles.username}>{formattedName}</CustomText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: 15
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    username: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    }
})

export default Connection