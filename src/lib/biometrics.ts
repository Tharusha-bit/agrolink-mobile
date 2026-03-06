import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const BIOMETRIC_UNLOCK_KEY = "agrolink.auth.biometric.enabled";

export interface BiometricSupport {
  available: boolean;
  enrolled: boolean;
  label: string;
}

export async function isBiometricUnlockEnabled() {
  const value = await AsyncStorage.getItem(BIOMETRIC_UNLOCK_KEY);
  return value === "true";
}

export async function setBiometricUnlockEnabled(enabled: boolean) {
  await AsyncStorage.setItem(BIOMETRIC_UNLOCK_KEY, enabled ? "true" : "false");
}

export async function getBiometricSupport(): Promise<BiometricSupport> {
  const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  let label = "Biometric unlock";
  if (
    supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    )
  ) {
    label = "Face unlock";
  } else if (
    supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
  ) {
    label = "Fingerprint unlock";
  }

  return {
    available: hasHardware && isEnrolled,
    enrolled: isEnrolled,
    label,
  };
}

export async function authenticateWithBiometrics(promptMessage: string) {
  const support = await getBiometricSupport();

  if (!support.available) {
    return {
      success: false,
      error: "Biometric authentication is unavailable on this device.",
      support,
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: "Cancel",
    fallbackLabel: "Use device passcode",
    disableDeviceFallback: false,
  });

  if (!result.success) {
    const error =
      result.error === "user_cancel" || result.error === "system_cancel"
        ? "Biometric authentication was cancelled."
        : "Biometric authentication failed.";

    return {
      success: false,
      error,
      support,
    };
  }

  return {
    success: true,
    support,
  };
}
