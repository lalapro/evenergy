const API_URL = "https://api.openchargemap.io/v3";
const API_KEY = `aaa1b91d-ac55-4793-91f8-161077c9d7e1`;

const MAX_RESULTS = 5;

interface GetChargingStationsPayload {
  boundingBox: string;
}

export const getChargingStations = async (payload: GetChargingStationsPayload) => {
  try {
    const response = await fetch(`${API_URL}/poi/?output=json&countrycode=US&maxresults=${MAX_RESULTS}&boundingbox=${payload.boundingBox}&compact=true&verbose=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
    })

    if (!response.ok) {
      console.error("error with api resonse", await response.text());
      throw new Error(`API responded with status error: ${response.status}`);
    }

    let resp;
    resp = await response.json();
    return resp.map((m: any) => ({
      coordinate: {
        latitude: m.AddressInfo.Latitude,
        longitude: m.AddressInfo.Longitude,
      },
      id: m.AddressInfo.ID,
      title: m.AddressInfo.Title,
    }));
  } catch (e) {
    console.log("error in get charging stations", e)
    return false
  }
}