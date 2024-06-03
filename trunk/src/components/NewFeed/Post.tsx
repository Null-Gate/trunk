import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Pressable
} from "react-native";

//icons
import { Entypo } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

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
    onPressedPostImage: (postId: number | string, pressedImgIndex: number) => void
}

const Post = ({
    id,
    username,
    description,
    imgs,
    onPressedPostImage
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
                    <Pressable>
                        <Entypo name="dots-three-vertical" size={18} color="black" />
                    </Pressable>
                </View>
                <CustomText textStyle={styles.description}>{description}</CustomText>
            </View>
            {/* end post's header */}

            {/* start post's image slider */}
            <ImageSlider
                postId={id}
                slides={imgs}
                onPressedImage={onPressedPostImage}
            />
            {/* end post's image slider */}

            {/* start post's actions container */}
            <View style={styles.postActionsContainer}>
                <View style={styles.voteContainer}>
                    <View style={[styles.voteBtn, { borderRightColor: GlobalStyles.colors.softGrey, borderRightWidth: 1 }]}>
                        <SimpleLineIcons name="like" size={15} color="black" />
                        <CustomText textStyle={styles.voteCount}>124</CustomText>
                    </View>
                    <View style={styles.voteBtn}>
                        <SimpleLineIcons name="dislike" size={15} color="black" />
                    </View>
                </View>
                <View style={styles.commentBtn}>
                    <EvilIcons name="comment" size={24} color="black" />
                    <CustomText textStyle={styles.voteCount}>120</CustomText>
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
    btnsContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderColor: GlobalStyles.colors.softGrey,
        borderWidth: 1,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center"
    },
    voteContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: GlobalStyles.colors.softGrey,
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 30
    },
    voteBtn: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        paddingHorizontal: 15
    },
    voteCount: {
        fontSize: 12,
        fontWeight: "bold"
    },
    commentBtn: {
        flexDirection: "row",
        justifyContent: "center",
        borderColor: GlobalStyles.colors.softGrey,
        borderWidth: 1,
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 15
    }
})

export default Post;