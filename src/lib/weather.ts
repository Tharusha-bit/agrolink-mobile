import {
  getDefaultLocationSelection,
  getDistrictSelection,
  type StoredLocationSelection,
} from "./sri-lanka-locations";

export interface DistrictWeather {
  district: string;
  province: string;
  temperature: number;
  humidity: number;
  soilTemperature: number;
  windSpeed: number;
  weatherCode: number;
}

function getWeatherLabelKey(code: number) {
  if (code === 0) {
    return "weather.clear";
  }

  if ([1, 2].includes(code)) {
    return "weather.partlyCloudy";
  }

  if (code === 3) {
    return "weather.overcast";
  }

  if ([45, 48].includes(code)) {
    return "weather.fog";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "weather.drizzle";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "weather.rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "weather.cold";
  }

  if ([95, 96, 99].includes(code)) {
    return "weather.thunder";
  }

  return "weather.partlyCloudy";
}

export function getWeatherIconName(code: number) {
  if (code === 0) {
    return "weather-sunny" as const;
  }

  if ([1, 2, 3].includes(code)) {
    return "weather-partly-cloudy" as const;
  }

  if ([45, 48].includes(code)) {
    return "weather-fog" as const;
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "weather-rainy" as const;
  }

  if ([95, 96, 99].includes(code)) {
    return "weather-lightning-rainy" as const;
  }

  return "weather-cloudy" as const;
}

export function getWeatherIconColor(code: number) {
  if (code === 0) {
    return "#F5A623";
  }

  if ([95, 96, 99].includes(code)) {
    return "#3A9BD5";
  }

  return "#3A9BD5";
}

export async function fetchDistrictWeather(
  selection: StoredLocationSelection | null,
) {
  const resolvedSelection = selection ?? getDefaultLocationSelection();
  const districtSelection = getDistrictSelection(resolvedSelection);

  if (!districtSelection) {
    throw new Error("Selected district could not be resolved.");
  }

  const { district, province } = districtSelection;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${district.latitude}&longitude=${district.longitude}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
    "&hourly=soil_temperature_0cm&forecast_days=1&timezone=auto";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load live weather data right now.");
  }

  const payload = await response.json();
  const soilTemperature = Array.isArray(payload?.hourly?.soil_temperature_0cm)
    ? Number(
        payload.hourly.soil_temperature_0cm[0] ??
          payload.current?.temperature_2m ??
          0,
      )
    : Number(payload?.current?.temperature_2m ?? 0);

  return {
    district: district.district,
    province,
    temperature: Number(payload?.current?.temperature_2m ?? 0),
    humidity: Number(payload?.current?.relative_humidity_2m ?? 0),
    soilTemperature,
    windSpeed: Number(payload?.current?.wind_speed_10m ?? 0),
    weatherCode: Number(payload?.current?.weather_code ?? 1),
  } satisfies DistrictWeather;
}

export function getWeatherLabel(
  t: (key: string) => string,
  weatherCode: number,
) {
  return t(getWeatherLabelKey(weatherCode));
}
