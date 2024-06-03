import { 
  View, 
  Text,
  StyleSheet
} from 'react-native'
import React from 'react'

type TabProps = {
  title: string
}
const Tab = ({
  title
}: TabProps) => {
  return <View></View>
}

const Tabs = () => {
  return (
    <View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {

  },
  tabContainer: {
    flexDirection: "row"
  }
})

export default Tabs