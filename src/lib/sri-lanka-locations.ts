import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DistrictOption {
  district: string;
  latitude: number;
  longitude: number;
}

export interface ProvinceOption {
  province: string;
  districts: DistrictOption[];
}

export interface StoredLocationSelection {
  province: string;
  district: string;
}

const LOCATION_KEY = "agrolink.location.selection";

export const sriLankaLocations: ProvinceOption[] = [
  {
    province: "Western",
    districts: [
      { district: "Colombo", latitude: 6.9271, longitude: 79.8612 },
      { district: "Gampaha", latitude: 7.0873, longitude: 79.9992 },
      { district: "Kalutara", latitude: 6.5836, longitude: 79.9607 },
    ],
  },
  {
    province: "Central",
    districts: [
      { district: "Kandy", latitude: 7.2906, longitude: 80.6337 },
      { district: "Matale", latitude: 7.4675, longitude: 80.6234 },
      { district: "Nuwara Eliya", latitude: 6.9497, longitude: 80.7891 },
    ],
  },
  {
    province: "Southern",
    districts: [
      { district: "Galle", latitude: 6.0535, longitude: 80.221 },
      { district: "Matara", latitude: 5.9549, longitude: 80.555 },
      { district: "Hambantota", latitude: 6.1241, longitude: 81.1185 },
    ],
  },
  {
    province: "Northern",
    districts: [
      { district: "Jaffna", latitude: 9.6615, longitude: 80.0255 },
      { district: "Kilinochchi", latitude: 9.3961, longitude: 80.3982 },
      { district: "Mannar", latitude: 8.981, longitude: 79.9042 },
      { district: "Mullaitivu", latitude: 9.2671, longitude: 80.8142 },
      { district: "Vavuniya", latitude: 8.7514, longitude: 80.4971 },
    ],
  },
  {
    province: "Eastern",
    districts: [
      { district: "Trincomalee", latitude: 8.5874, longitude: 81.2152 },
      { district: "Batticaloa", latitude: 7.7102, longitude: 81.6924 },
      { district: "Ampara", latitude: 7.2917, longitude: 81.6724 },
    ],
  },
  {
    province: "North Western",
    districts: [
      { district: "Kurunegala", latitude: 7.4863, longitude: 80.3647 },
      { district: "Puttalam", latitude: 8.0362, longitude: 79.8283 },
    ],
  },
  {
    province: "North Central",
    districts: [
      { district: "Anuradhapura", latitude: 8.3114, longitude: 80.4037 },
      { district: "Polonnaruwa", latitude: 7.9403, longitude: 81.0188 },
    ],
  },
  {
    province: "Uva",
    districts: [
      { district: "Badulla", latitude: 6.9934, longitude: 81.055 },
      { district: "Monaragala", latitude: 6.872, longitude: 81.3507 },
    ],
  },
  {
    province: "Sabaragamuwa",
    districts: [
      { district: "Ratnapura", latitude: 6.6828, longitude: 80.3992 },
      { district: "Kegalle", latitude: 7.2513, longitude: 80.3464 },
    ],
  },
];

export async function getStoredLocationSelection() {
  const raw = await AsyncStorage.getItem(LOCATION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredLocationSelection;
    if (!parsed?.province || !parsed?.district) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function saveLocationSelection(
  selection: StoredLocationSelection,
) {
  await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(selection));
}

export function getProvince(provinceName: string) {
  return (
    sriLankaLocations.find((item) => item.province === provinceName) ?? null
  );
}

export function getDistrictSelection(
  selection: StoredLocationSelection | null,
) {
  if (!selection) {
    return null;
  }

  const province = getProvince(selection.province);
  if (!province) {
    return null;
  }

  const district =
    province.districts.find((item) => item.district === selection.district) ??
    null;

  if (!district) {
    return null;
  }

  return {
    province: province.province,
    district,
  };
}

export function getDefaultLocationSelection(): StoredLocationSelection {
  return {
    province: "North Central",
    district: "Anuradhapura",
  };
}
