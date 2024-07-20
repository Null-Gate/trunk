import {
    Pressable,
    StyleSheet
} from 'react-native'
import React, { useRef, useCallback } from 'react'

// reactnative map
import MapView, { Marker } from 'react-native-maps';


// dummy datas
const locations = [
    {
        type: "Owner",
        coordinate: {
            latitude: 16.826111566733648,
            longitude: 96.13035812250988,
        },
        title: "Origin",
        description: "Start Point",
    },
    {
        type: "Owner",
        coordinate: {
            latitude: 21.94893745302357,
            longitude: 96.08852235463286,
        },
        title: "Destination",
        description: "End Point",
    },
    {
        type: "User1",
        coordinate: {
            latitude: 17.042428710919555,
            longitude: 96.12878120397383,
        },
        title: "User1Origin",
        description: "Start Point",
    },
    {
        type: "User1",
        coordinate: {
            latitude: 20.881312699222843,
            longitude: 95.86086683066863,
        },
        title: "User1Destination",
        description: "End Point",
    },
    {
        type: "User2",
        coordinate: {
            latitude: 21.433729341389252,
            longitude: 96.10751692235945,
        },
        title: "User2Origin",
        description: "Start Point",
    },
    {
        type: "User2",
        coordinate: {
            latitude: 21.7359429298148,
            longitude: 96.10394794148395,
        },
        title: "User2Destination",
        description: "End Point",
    },
];

const MYANMAR_REGION = {
    latitude: 19.7633,
    longitude: 96.0785,
    latitudeDelta: 5.0,
    longitudeDelta: 5.0,
}

const CustomMapContainer = () => {
    const MapRef = useRef<any>(null);

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const focusDestination = useCallback(
        (origin: string, destination: string) => {
            MapRef.current.fitToSuppliedMarkers([origin, destination], {
                edgePadding: { top: 80, bottom: 50, right: 50, left: 50 },
            });
        },
        []
    );

    return (
        <MapView
            style={styles.map}
            ref={MapRef}
            initialRegion={MYANMAR_REGION}
        >
            {
                locations.map(loaction => {
                    return (
                        <Marker
                            key={`${loaction.coordinate.latitude}${loaction.coordinate.longitude}`}
                            coordinate={loaction.coordinate}
                        ></Marker>
                    )
                })
            }

        </MapView>
    )
}

export default CustomMapContainer

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
})