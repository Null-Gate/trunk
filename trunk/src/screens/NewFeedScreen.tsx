import {
    View,
    FlatList,
    StyleSheet
} from 'react-native'
import React from 'react'

// components
import CustomLayout from '../layouts/CustomLayout'
import Post from '../components/newFeed/Post'

// dummy data
import { POST_DATA } from '../config/post_data'

const NewFeedScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 15
                }}
                data={POST_DATA}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return <Post 
                        creator={item.user} 
                        title={item.title} 
                        content={item.descirption} 
                        imgs={item.imgs}
                        />
                }}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )
}

export default NewFeedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})