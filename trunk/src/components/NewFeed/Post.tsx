import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Pressable
} from "react-native";

//icons
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

//components
import ImageContainer from "../ImageContainer";
import CustomText from "../CustomText";
import ImageSlider from "./ImageSlider";
import { GlobalStyles } from "../../constants/styles";

type Images = {
    id: number | string,
    url: string
}

type Post = {
    id: string,
    username: string,
    description: string,
    imgs: Images[],
    onPressedPostImage: (postId: number | string, pressedImgIndex: number) => void,
    onPressedPostOptions: () => void
}

const Post = ({
    id,
    username,
    description,
    imgs,
    onPressedPostImage,
    onPressedPostOptions
}: Post) => {
    return (
        <View style={styles.postContainer}>

            {/* start post's header */}
            <View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <ImageContainer
                            imageSource={require("./../../assets/profile.png")}
                            imageContainerStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 50
                            }}
                        />
                        <CustomText textStyle={styles.userName}>{username}</CustomText>
                        <CustomText textStyle={styles.createdDate}>1d</CustomText>
                    </View>
                    <Pressable onPress={onPressedPostOptions}>
                        <Entypo name="dots-three-vertical" size={18} color="black" />
                    </Pressable>
                </View>
            </View>
            {/* end post's header */}

            {/* start post descirption */}
            <CustomText textStyle={styles.description}>{description}</CustomText>
            {/* end post description */}

            {/* start post's image slider */}
            <ImageSlider
                postId={id}
                slides={imgs}
                onPressedImage={onPressedPostImage}
            />
            {/* end post's image slider */}

            {/* start post's actions container */}
            <View style={styles.postActionsContainer}>
                <View style={styles.btnContainer}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        borderRightWidth: 1,
                        borderRightColor: GlobalStyles.colors.softGrey,
                        paddingVertical: 5,
                        paddingHorizontal: 15
                    }}>
                        <AntDesign name="like2" size={20} color="black" />
                        <CustomText textStyle={styles.voteCount}>128</CustomText>
                    </View>
                    <View style={{
                        paddingVertical: 5,
                        paddingHorizontal: 15
                    }}>
                        <AntDesign name="dislike2" size={20} color="black" />
                    </View>
                </View>
            </View>
            {/* end post's actions container */}
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: GlobalStyles.colors.softGrey
    },
    viewImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    userName: {
        fontSize: 14,
        fontWeight: "600"
    },
    createdDate: {
        fontSize: 12
    },
    description: {
        fontWeight: "400",
        marginBottom: 15
    },
    postActionsContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: 'center',
        gap: 20
    },
    btnContainer: {
        borderColor: GlobalStyles.colors.softGrey,
        borderWidth: 1,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden"
    },
    voteCount: {
        fontSize: 14,
        fontWeight: "bold"
    }
})

export default Post;