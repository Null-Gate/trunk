import {
    View,
    StyleSheet,
    Pressable,
} from 'react-native'
import React, { useState } from 'react'

// react navigation
import { useNavigation } from '@react-navigation/native'

// components
import ImageContainer from '../ImageContainer'
import CustomText from '../CustomText'
import ImageSlider from '../ImageSlider'
import CustomButton from '../CustomButton'

// icons
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// styles
import { GlobalStyles } from '../../constants/styles'

type ImagesProps = {
    id: string,
    url: string
}

interface PostProps {
    creator: string,
    title: string,
    content: string,
    imgs: string,
    onPressOption: () => void
}

const Post = ({
    creator,
    title,
    content,
    imgs,
    onPressOption
}: PostProps) => {
    const [count, setCount] = useState<number>(0);
    const navigation = useNavigation<any>();

    const navigatePostDetial = () => {
        navigation.navigate('PostDetail');
    }

    // Function to get the first N words from a paragraph
    const getFirstNWords = (paragraph: string, numWords: number): string => {
        const words = paragraph.split(' ').slice(0, numWords);
        return words.join(' ') + (words.length === numWords ? ' ... ' : '');
    };


    return (
        <Pressable onPress={navigatePostDetial}>
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
                    <View style={{ 
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                     }}>
                        <CustomButton
                            title='connect'
                            onPress={() => { }}
                            textStyle={{ 
                                fontSize: 14,
                                fontWeight: "semibold",
                                color: "#000"
                            }}
                            style={{
                                paddingHorizontal: 15,
                                height: 30,
                                backgroundColor: "#ededed",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 20
                            }}
                        />
                        {/* option btn */}
                        <Pressable onPress={onPressOption}>
                            <Entypo name="dots-three-vertical" size={22} color="black" />
                        </Pressable>
                    </View>
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
                {/* end post body  */}

                {/* star footer */}
                <View style={styles.footer}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Pressable
                            style={styles.voteBtn}
                            android_ripple={{ color: "#ccc" }}
                            onPress={() => setCount(prev => prev + 1)}
                        >
                            <AntDesign name="like2" size={20} color="#616161" />
                        </Pressable>
                        <CustomText text={count.toString()} textStyle={{
                            marginHorizontal: 12,
                            color: "#616161"
                        }} />
                        <Pressable
                            style={styles.voteBtn}
                            android_ripple={{ color: "#ccc" }}
                            onPress={() => setCount(prev => prev - 1)}
                        >
                            <AntDesign name="dislike2" size={20} color="#616161" />
                        </Pressable>
                    </View>

                </View>
                {/* end footer */}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.softGrey
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "center"
    },
    voteBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Post