import {
    View,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";

//icons
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
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
    onPressedPostImage: (postId : number | string, pressedImgIndex : number) => void
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
                            viewImage={<Image
                                style={styles.viewImage}
                                source={require("./../../assets/profile.png")}
                            />}
                            imageContainerStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 50
                            }}
                        />
                        <CustomText textStyle={styles.userName}>{username}</CustomText>
                        <CustomText textStyle={styles.createdDate}>1d</CustomText>
                    </View>
                    <Entypo name="dots-three-vertical" size={18} color="black" />
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
                <View style={styles.btnsContainer}>
                    <View style={[styles.voteBtn, { borderRightWidth: 1, borderRightColor: "#d6d4d4", paddingRight: 5 }]}>
                        <AntDesign name="like2" size={20} color="black" />
                        <CustomText textStyle={styles.voteCount}>360</CustomText>
                    </View>
                    <View style={{ paddingLeft: 5 }}>
                        <AntDesign name="dislike2" size={20} color="black" />
                    </View>
                </View>
                <View style={styles.btnsContainer}>
                    <EvilIcons name="comment" size={24} color="black" />
                    <CustomText textStyle={{ fontSize: 12, fontWeight: "bold" }}>Comment</CustomText>
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
    voteBtn: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center"
    },
    voteCount: { 
        fontSize: 12, 
        fontWeight: "bold" 
    }
})

export default Post;