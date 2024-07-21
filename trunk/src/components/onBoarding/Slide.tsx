import {
    View,
    ImageSourcePropType,
    StyleSheet,
    Dimensions
} from 'react-native'
import React from 'react'

// components
import ImageContainer from '../ImageContainer'
import CustomText from '../CustomText';

const windowWidth = Dimensions.get('window').width;

interface SlideProps {
    image: ImageSourcePropType,
    title: string,
    content: string
}

const Slide = ({
    image,
    title,
    content
}: SlideProps) => {
    return (
        <View
            style={styles.container}
        >
            <View>
                <CustomText
                    text={title}
                    textStyle={styles.title}
                />
                <CustomText 
                    text={content}
                    textStyle={styles.content} 
                />
            </View>
            {/* <ImageContainer
                imageSource={image}
                imageContainerStyle={{
                    width: "100%",
                    height: "38%"
                }}
            /> */}
        </View>
    )
}

export default Slide

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    title: {
        color: "#bfbfbf",
        fontSize: 20,
    },
    content: {
        color: "#bfbfbf",
        fontSize: 16
    }
})