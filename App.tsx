import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Region, Marker } from "react-native-maps";
import { getChargingStations, chargeAtStation } from "./api";
import { requestLocationPermissions } from "./helpers";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Stations {
  coordinate: Coordinate;
  chargePointID: number;
  title: string;
}

const DEFAULT_LOCATION: Coordinate = {
  latitude: 40.67724308765143,
  longitude: -73.96571318183904,
};

const App = () => {
  const [location, setLocation] = useState<Coordinate>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [stations, setStations] = useState<Stations[]>([]);

  const getClosestChargingStations = async () => {
    const results = await getChargingStations(location);
    if (results) {
      setStations(results);
    }
    setLoading(false);
  };

  const setup = async () => {
    // will request for location if first time using app
    let userLocation = await requestLocationPermissions();
    if (userLocation) {
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    } else {
      // assume permissions not given for now and default to preset coordinates
      // show alert to user here to enable locations if needed
    }
    getClosestChargingStations();
  };

  const onRegionChangeComplete = (region: Region) => {
    setLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const startCharge = async (chargePointID: number) => {
    const payload = {
      user: 123,
      car_id: 123,
      charger_id: chargePointID,
    };
    const response = await chargeAtStation(payload);
    if (response) {
      // navigate to success state
    } else {
      // show feedback to user if error
    }
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    getClosestChargingStations();
  }, [location.latitude, location.longitude]);

  return (
    <View style={styles.container}>
      {!loading && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
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
