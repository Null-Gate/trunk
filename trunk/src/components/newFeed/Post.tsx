import {
    View,
    StyleSheet,
    Pressable,
} from 'react-native'
import React from 'react'

// components
import ImageContainer from '../ImageContainer'
import CustomText from '../CustomText'
import ImageSlider from '../ImageSlider'

// icons
import { Entypo } from '@expo/vector-icons';

type ImagesProps = {
    id: string,
    url: string
}

interface PostProps {
    creator: string,
    title: string,
    content: string,
    imgs: ImagesProps[],
    openPostModal: () => void
}

const Post = ({
    creator,
    title,
    content,
    imgs,
    openPostModal
}: PostProps) => {

    // Function to get the first N words from a paragraph
    const getFirstNWords = (paragraph: string, numWords: number) : string => {
        const words = paragraph.split(' ').slice(0, numWords);
        return words.join(' ') + (words.length === numWords ? ' ... ' : '');
    };

    return (
        <>
            <View style={styles.container}>
                {/* start post header */}
                <View style={styles.header}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 15
                    }}>
                        <ImageContainer
                            imageContainerStyle={styles.imageContainer}
                            imageSource={require('../../assets/images/artist.png')}
                        />
                        <View>
                            {/* creator */}
                            <CustomText
                                text={creator}
                            />
                            <CustomText
                                text='1 day ago'
                                textStyle={{
                                    color: "#c9c9c9",
                                    fontSize: 12
                                }}
                            />
                        </View>
                    </View>
                    {/* option btn */}
                    <Pressable onPress={openPostModal}>
                        <Entypo name="dots-three-vertical" size={22} color="black" />
                    </Pressable>
                </View>
                {/* end post header */}

                {/* start post body */}
                <View>
                    <View style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10
                    }}>
                        {/* title */}
                        <CustomText
                            text={title}
                            textStyle={{ fontWeight: "bold", fontSize: 16 }}
                        />
                        {/* content */}
                        <CustomText
                            text={getFirstNWords(content, 20)}
                        />
                    </View>
                    {/* image slider */}
                    <ImageSlider
                        slides={imgs}
                    />
                </View>
                {/* end post body */}

                {/* star footer */}
                {/* <View style={styles.footer}></View> */}
                {/* end footer */}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#dbdbdb"
    },
    header: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    footer: {
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Post