import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

const faceType = LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION;

export async function canUseFaceLock() {
  const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  const hasFaceRecognition = supportedTypes.includes(faceType);

  if (!hasHardware) {
    return {
      supported: false,
      message: "This device does not support biometric authentication.",
    };
  }

  if (!hasFaceRecognition) {
    return {
      supported: false,
      message:
        Platform.OS === "ios"
          ? "Face ID is not available on this device."
          : "Face recognition is not available on this device.",
    };
  }

  if (!isEnrolled) {
    return {
      supported: false,
      message:
        Platform.OS === "ios"
          ? "Set up Face ID in device settings before enabling Face Unlock."
          : "Set up face recognition in device settings before enabling Face Unlock.",
    };
  }

  return {
    supported: true,
    message: "",
  };
}

export async function authenticateWithFaceLock() {
  const supported = await canUseFaceLock();

  if (!supported.supported) {
    return {
      success: false,
      message: supported.message,
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage:
      Platform.OS === "ios" ? "Unlock with Face ID" : "Unlock with Face Unlock",
    promptDescription:
      Platform.OS === "android"
        ? "Use face recognition to unlock VaultLife."
        : undefined,
    promptSubtitle:
      Platform.OS === "android" ? "Face verification required" : undefined,
    cancelLabel: "Cancel",
    fallbackLabel: "",
    disableDeviceFallback: true,
  });

  return {
    success: result.success,
    message: result.success
      ? ""
      : result.error || "Face Unlock verification failed.",
  };
}
