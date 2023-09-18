# evenergy

## Getting Started

This app is built using create-expo-app, it doesn't work on a physical build and must be run on an ios simulator and or phone using Expo go as I have not tested this on an android phone

To run the app, git clone this repo, cd into `evenergy` and run `npx expo start`, you can then spin up an ios simulator or use the expo go app to run this application.

## Lifecycle

The lifecycle of this simple applciation is as follows.

1. On app start up, the app will request the user's location through the native location prompt
2. If accepted, the app will then use the users current location to fetch the closest 20 charging stations
3. The call to fetch the charging stations is made whenever the map is moved
4. The user can then tap on one of the charging stations to make the api call to the backend for EVEnergy
5. If the user rejects the location prompt, the app will be hardcoded to start from the coordinates of a brooklyn neighborhood, but the user is still able to search for surrounding chargers by moving the map around

## Issues

1. The backend call for the "Start Charging" isn't working as intended, my guess is that the api isn't available at the moment as I can't make a successful call using postman or fetch.
2. There is currently no way to custom enter a location, as the user must manually scroll using the map to search for new charge stations

## Design descisions & future features to add

I have decided to use a mapview to render the closest charging stations as it was the most intuitive way to render the data to the user. However, I do think a more complete application should include a list view for said data. For that feature, I would:

1. Use a `<FlatList>` to render the different charging stations in a list format
2. Each list will have relevant information on each charge point, including wattage, distance from user, etc.
3. Create a new api call that uses longitute/latitude as opposed to a bounding box
4. Include pagination capabilities (may depend on api limitations)
5. Option to click into each list/marker to view additional details for the charge point

## QOL changes

1. Loading indicator when fetching new stations
2. Add bounding box for cleaner UI when rendering markers
3. Error handling and clarification to users
4. Add a debounce function (per suggestion from openchargemap) or disable auto search and add a "Search here" button to limit api calls
5. Create separate files/folders for smaller components like markers and list views if needed

Total time spent = ~2.5 hours
