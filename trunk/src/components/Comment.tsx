import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Pressable
} from "react-native";


//components
import CustomText from "./CustomText";
import ImageContainer from "./ImageContainer";

// styles
import { GlobalStyles } from "../constants/styles";

// icons
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

type Comment = {
    author: string,
    created_date: string,
    text: string,
    isReplyComment?: boolean,
    onReply: (title: string) => void | null,
    style?: object
}

const Comment = ({
    author,
    created_date,
    text,
    isReplyComment = false,
    onReply,
    style = {}
}: Comment) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <ImageContainer
                    viewImage={
                        <Image
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%"
                            }}
                            source={require("./../assets/image2.png")}
                        />
                    }
                    imageContainerStyle={{
                        width: 28,
                        height: 28,
                        borderRadius: 14
                    }}
                />
                <CustomText textStyle={styles.author}>{author}</CustomText>
                <CustomText textStyle={styles.createDate}>{created_date}</CustomText>
            </View>


            <CustomText textStyle={{
                fontSize: 14,
                fontWeight: "400"
            }}>{text}</CustomText>


            <View style={styles.actionContainer}>
                <View style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                    {!isReplyComment && (
                        <View style={{ marginHorizontal: 30 }}>
                            <TouchableWithoutFeedback onPress={() => { onReply(text) }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                    <Octicons name="reply" size={15} color="#919090" />

                                    <CustomText textStyle={styles.actionText}>Reply</CustomText>

                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )}

                    <TouchableWithoutFeedback onPress={() => { console.log("vote") }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <AntDesign name="like2" size={15} color="#919090" />
                            <CustomText textStyle={styles.actionText}>292</CustomText>
                            <AntDesign name="dislike2" size={15} color="#919090" />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    header: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    author: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6e6e6e"
    },
    createDate: {
        fontSize: 12,
        fontWeight: "400",
        color: "#919090"
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    actionText: {
        fontSize: 13,
        color: "#919090"
    }
})

export default Comment;
