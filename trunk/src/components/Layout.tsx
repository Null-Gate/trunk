import React from "react";
import {
    SafeAreaView,
    StyleSheet
} from "react-native";
import { GlobalStyles } from "../constants/styles";

type Layout = {
    children: React.JSX.Element;
}

const Layout = ({
    children
}: Layout) => {
    return (
        <SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa"
    }
})

export default Layout;