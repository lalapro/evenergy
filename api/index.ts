const API_URL = `https://api.openchargemap.io/v3`;
const API_KEY = `aaa1b91d-ac55-4793-91f8-161077c9d7e1`;

const CHARGE_URL = `https://example.ev.energy/chargingsession`

const MAX_RESULTS = 20;

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
      chargePointID: m.ID, // assumption based on docs
      title: m.AddressInfo.Title,
    }));
  } catch (e) {
    console.log("error in get charging stations", e)
    return false
  }
}

interface ChargerPayload {
  user: number;
  car_id: number;
  charger_id: number;
}

export const chargeAtStation = async (payload: ChargerPayload) => {
  try {
    console.log("payload", payload)
    const response = await fetch(`${CHARGE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error("error with api resonse", await response.text());
      throw new Error(`API responded with status error: ${response.status}`);
    }

    let resp;
    resp = await response.json();
    console.log("charging epi")
    console.log(resp)
  } catch (e) {
    console.log("error in charge at station..", e)
    return false
  } 
}