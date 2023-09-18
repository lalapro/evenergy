import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Region, Marker } from "react-native-maps";
import { getChargingStations, chargeAtStation } from "./api";
import { requestLocationPermissions } from "./helpers";
import { LocationObject } from "expo-location";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Stations {
  coordinate: Coordinate;
  chargePointID: number;
  title: string;
}

const DEFAULT_BOUNDING_BOX = `(40.703603004232335,-73.98284646302767),(40.653603212937796,-73.94905639426918)`;

const DEFAULT_LOCATION: LocationObject = {
  coords: {
    accuracy: 5,
    altitude: 0,
    altitudeAccuracy: -1,
    heading: -1,
    latitude: 40.67724308765143,
    longitude: -73.96571318183904,
    speed: -1,
  },
  timestamp: 1695057335143.832,
};

const App = () => {
  const [location, setLocation] = useState<LocationObject>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [boundingBox, setBoundingBox] = useState<string>(DEFAULT_BOUNDING_BOX);
  const [stations, setStations] = useState<Stations[]>([]);

  const getClosestChargingStations = async () => {
    const results = await getChargingStations({ boundingBox });
    if (results) {
      setStations(results);
    }
    setLoading(false);
  };

  const setup = async () => {
    let location = await requestLocationPermissions();
    if (location) {
      // console.log(location);
      setLocation(location);
    } else {
      // assume no permissions for now and default to preset coordinates
    }
    getClosestChargingStations();
  };

  const onRegionChangeComplete = (region: Region) => {
    console.log(region);
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

  const startCharge = async (chargePointID: number) => {
    const payload = {
      user: 123,
      car_id: 123,
      charger_id: chargePointID,
    };
    await chargeAtStation(payload);
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    getClosestChargingStations();
  }, [boundingBox]);

  return (
    <View style={styles.container}>
      {!loading && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
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
              <Marker
                onPress={() => startCharge(s.chargePointID)}
                key={s.chargePointID}
                coordinate={s.coordinate}
                title={s.title}
              />
            );
          })}
        </MapView>
      )}
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
