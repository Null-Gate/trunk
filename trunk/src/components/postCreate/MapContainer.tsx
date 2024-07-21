import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import useLocationStore from "../../store/locations";
import MapViewDirections from "react-native-maps-directions";

type MapContainerProps = {
  isChooseFromMap: boolean;
  type: "origin" | "destination";
};

const MapContainer: React.FC<MapContainerProps> = ({
  isChooseFromMap,
  type,
}) => {
  const MapRef = useRef<MapView>(null);
  const { origin, setOrigin, destination, setDestination } = useLocationStore();

  // Fit the screen to marker points
  useEffect(() => {
    if (!origin || !destination) return;
    // Delay to ensure state updates
    setTimeout(() => {
      if (MapRef.current) {
        if (origin && destination) {
          MapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
            edgePadding: { top: 200, bottom: 200, right: 50, left: 50 },
          });
        } else if (origin) {
          MapRef.current.animateToRegion({
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 1,
            longitudeDelta: 1,
          });
        }
      }
    }, 100);
  }, [origin, destination]);

  return (
    <MapView
      ref={MapRef}
      showsCompass={false}
      style={{ height: '92%' }}
      initialRegion={{
        latitude: 16.840808135276394,
        longitude: 96.17339335427003,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      onPress={(e) => {
        if (isChooseFromMap) {
          if (type == "origin") {
            setOrigin({
              location: {
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
              },
              description: "Start of location",
            });
          } else {
            setDestination({
              location: {
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
              },
              description: "End of location",
            });
          }
        }
      }}
    >
      {/* Origin Marker */}
      {origin && origin.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          identifier="origin"
          description={origin.description}
          title="Origin"
        />
      )}

      {/* Destination Marker */}
      {destination && destination.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          identifier="destination"
          description={destination.description}
          title="Destination"
        />
      )}

      {/* Direction for two Markers */}
      {origin && origin.location && destination && destination.location && (
        <MapViewDirections
          origin={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          destination={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          apikey={process.env.GOOGLE_MAP_API}
          strokeColor="#991602"
          strokeWidth={3}
        />
      )}
    </MapView>
  );
};

export default MapContainer;
