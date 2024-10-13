import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import useLocationStore from "../../store/locations";
import MapViewDirections from "react-native-maps-directions";

type MapContainerProps = {
  isChooseFromMap: boolean;
  type: "origin" | "destination";
};

const MapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

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
            latitude: origin.lat,
            longitude: origin.lng,
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
      style={{ height: "92%" }}
      customMapStyle={MapStyle}
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
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
              description: "Start of location",
            });
          } else {
            setDestination({
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
              description: "End of location",
            });
          }
        }
      }}
    >
      {/* Origin Marker */}
      {origin && origin.lat && (
        <Marker
          coordinate={{
            latitude: origin.lat,
            longitude: origin.lng,
          }}
          identifier="origin"
          description={origin.description}
          title="Origin"
        />
      )}

      {/* Destination Marker */}
      {destination && destination.lat && (
        <Marker
          coordinate={{
            latitude: destination.lat,
            longitude: destination.lng,
          }}
          identifier="destination"
          description={destination.description}
          title="Destination"
        />
      )}

      {/* Direction for two Markers */}
      {origin && origin.lat && destination && destination.lat && (
        <MapViewDirections
          origin={{
            latitude: origin.lat,
            longitude: origin.lng,
          }}
          destination={{
            latitude: destination.lat,
            longitude: destination.lng,
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
