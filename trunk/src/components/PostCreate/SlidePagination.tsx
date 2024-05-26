import {StyleSheet, Animated, View, Dimensions} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('screen');

const SlidePagination = ({
    data, 
    scrollX, 
    index
}) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [6, 12, 6],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#ccc', '#3483eb', '#ccc'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              {width: dotWidth, backgroundColor},
            ]}
          />
        );
      })}
    </View>
  );
};

export default SlidePagination;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: '#ccc',
  },
});
