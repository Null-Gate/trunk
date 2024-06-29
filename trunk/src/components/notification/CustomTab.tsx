import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Tab = {
  key: string;
  label: string;
};

type CustomTabProps = {
  tabs: Tab[];
  onTabPress: (key: string) => void;
};

const CustomTab: React.FC<CustomTabProps> = ({ tabs, onTabPress }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabPress(tabKey);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => handleTabPress(tab.key)}
        >
          <Text style={activeTab === tab.key ? styles.activeTabText : styles.tabText}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    padding: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'tomato',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: 'tomato',
  },
});

export default CustomTab;
