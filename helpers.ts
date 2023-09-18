import * as Location from "expo-location";


export const requestLocationPermissions = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.group("Permission to access location was denied")
    return false;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location;
}