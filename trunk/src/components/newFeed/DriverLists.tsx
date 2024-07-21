import {
    View,
    FlatList,
    StyleSheet
} from 'react-native'
import React, { useEffect } from 'react'

// components
import DriverCard from './DriverCard'
import CustomButton from '../CustomButton'

// styles
import { GlobalStyles } from '../../constants/styles'

type DriverProps = {
    id: string,
    user: string,
    img: string
}

interface DriverListsProps {
    drivers: DriverProps[]
}

const DriverLists = ({
    drivers
}: DriverListsProps) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={drivers}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <DriverCard user={item.user} img={item.img} />}
                keyExtractor={item => item.id.toString()}
            />
            <CustomButton 
                title="See All" 
                style={styles.button}
                textStyle={{ 
                    color: "#000" ,
                    fontWeight: "bold"
                }}
                onPress={() => {}} 
            />
        </View>
    )
}

export default DriverLists

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.softGrey,
        marginBottom: 40
    },
    button: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    }
})