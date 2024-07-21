import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native'
import React from 'react'

// components
import ImageContainer from '../ImageContainer'
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';

// styles
import { GlobalStyles } from '../../constants/styles';

const windowWidth = Dimensions.get('window').width;

interface DriverCardProps {
    user: string,
    img: string
}

const DriverCard = ({
    user,
    img
}: DriverCardProps) => {
    return (
        <View style={styles.container}>
            <ImageContainer
                imageSource={{ uri: img }}
                imageContainerStyle={{
                    width: "100%",
                    height: 220
                }}
            />
            <View style={styles.detailContainer}>
                {/* user name */}
                <CustomText text={user} textStyle={{ marginBottom: 5 }} />
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <CustomButton 
                        title='Offer' 
                        onPress={() => { console.log("connected") }} 
                        style={styles.button}
                    />
                    <CustomButton 
                        title='Connect' 
                        onPress={() => { console.log("connected") }} 
                        style={styles.button}
                    />
                </View>
            </View>
        </View>
    )
}

export default DriverCard

const styles = StyleSheet.create({
    container: {
        width: windowWidth * .6,
        backgroundColor: "#fff",
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.softGrey,
        overflow: "hidden"
    },
    detailContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    button: {
        width: "48%",
        justifyContent: "center",
        alignItems: "center"
    }
})