import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Region, Marker } from "react-native-maps";
import { getChargingStations } from "./api";
import { requestLocationPermissions } from "./helpers";
import { LocationObject } from "expo-location";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Stations {
  coordinate: Coordinate;
  id: number;
  title: string;
}

const DEFAULT_BOUNDING_BOX = `(40.74134709914821,-73.99119628224969),(40.652762835981044,-73.93131408631439)`;

const DEFAULT_LOCATION: LocationObject = {
  coords: {
    accuracy: 5,
    altitude: 0,
    altitudeAccuracy: -1,
    heading: -1,
    latitude: 40.678325,
    longitude: -73.965218,
    speed: -1,
  },
  timestamp: 1695057335143.832,
};

const App = () => {
  const [location, setLocation] = useState<LocationObject>(DEFAULT_LOCATION);
  const [boundingBox, setBoundingBox] = useState<string>("");
  const [stations, setStations] = useState<Stations[]>([]);

  const getClosestChargingStations = async () => {
    const results = await getChargingStations({ boundingBox });
    if (results) {
      setStations(results);
    }
  };

  const setup = async () => {
    let location = await requestLocationPermissions();
    if (location) {
      setLocation(location);
    } else {
      // assume no permissions for now and default to preset coordinates
    }
    getClosestChargingStations();
  };

  const onRegionChangeComplete = (region: Region) => {
    const topLeft = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    const bottomRight = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };

    setBoundingBox(
      `(${topLeft.latitude},${topLeft.longitude}),(${bottomRight.latitude},${bottomRight.longitude})`
    );
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    getClosestChargingStations();
  }, [boundingBox]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.025,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {stations.map((s) => {
          return (
            <Marker key={s.id} coordinate={s.coordinate} title={s.title} />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default App;
