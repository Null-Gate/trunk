import { 
    View,
    Text,
    Pressable,
    StyleSheet,
    Platform
} from "react-native";

//styles
import { GlobalStyles } from "../constants/styles";

interface SegmentEntry {
    items: {id : number, title : string}[],
    currentActive: number,
    onChangeActive: any,
    style?: object
}

const Segment = ({
    items,
    currentActive,
    onChangeActive,
    style = {}
} : SegmentEntry) => {
    return (
        <View style={[styles.segmentContainer, style]}>
            {items.map(item => {
                return (
                    <Pressable 
                        onPress={() => onChangeActive(item.id)} 
                        key={item.id}
                    >
                        <View style={styles.segment}>
                            <Text style={
                                currentActive === item.id ? 
                                [styles.segmentText, { color: GlobalStyles.colors.primaryColor }] :
                                [styles.segmentText, { color : "#cfcfcf"}]
                            }>{item.title}</Text>
                        </View>
                        <View style={
                            currentActive === item.id ?
                            [styles.underLine, { backgroundColor : GlobalStyles.colors.primaryColor}] : 
                            [styles.underLine, { backgroundColor : "#cfcfcf"}]

                        }></View>
                    </Pressable>
                )
            })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    segmentContainer: {
        marginVertical: 5,
        flexDirection: "row",
        gap: 5
    },
    segment: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    segmentText: {
        color: "#414142",
        fontSize: 16,
        fontWeight: "500"
    },
    underLine: {
        width: '100%',
        height: 3,
        position: "absolute",
        left: 0,
        bottom: 0,
    }
});

export default Segment;