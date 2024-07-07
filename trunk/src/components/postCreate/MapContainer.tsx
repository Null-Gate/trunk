import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

// expo location
import * as Location from 'expo-location';

// reactnative map
import MapView, { Marker } from 'react-native-maps';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface CoordinateProps {
    latitude: number;
    longitude: number;
}

interface MapContainerProps {
    initialCoordinate?: CoordinateProps;
    onChooseLocation: (address: string, coordinate: CoordinateProps) => void
}

const MapContainer = ({
    initialCoordinate,
    onChooseLocation
}: MapContainerProps) => {
    const [pin, setPin] = useState<CoordinateProps | null>(null);
    const mapRef = useRef(null);

    const handleMapPress = async (event: any) => {
        const { coordinate } = event.nativeEvent;
        setPin(coordinate);
        await reverseGeocode(coordinate);
    }

    const reverseGeocode = async (coordinate: CoordinateProps) => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // setAddress('Permission to access location was denied');
                return;
            }

            let addressData = await Location.reverseGeocodeAsync({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            });

            if (addressData.length > 0) {
                const region = addressData[0].region;
                const country = addressData[0].country;
                const addressString = `${region}, ${country}`
                onChooseLocation(addressString, coordinate);

            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const coordinate = initialCoordinate ? initialCoordinate : null;
        setPin(coordinate);
    }, [])

    return (
        <MapView
            ref={mapRef}
            style={styles.map}
            onPress={handleMapPress}
        >
            {pin && <Marker coordinate={pin} />}
        </MapView>
    )
}

export default MapContainer

const styles = StyleSheet.create({
    map: {
        width: windowWidth,
        height: windowHeight
    }
})