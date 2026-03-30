import * as LocalAuthentication from "expo-local-authentication";

/**
 * Checks whether the device supports and has enrolled any biometric
 * authentication method (fingerprint, face, iris, etc.).
 * Does NOT restrict to a specific type — lets the OS decide.
 */
export async function canUseBiometrics() {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);

  if (!hasHardware) {
    return {
      supported: false,
      message: "This device does not support biometric authentication.",
    };
  }

  if (!isEnrolled) {
    return {
      supported: false,
      message:
        "No biometrics are enrolled on this device. Please set up fingerprint, face, or another biometric in your device settings.",
    };
  }

  return {
    supported: true,
    message: "",
  };
}

/**
 * Triggers the OS-native biometric prompt.
 * Works with any enrolled method: fingerprint, face, iris, etc.
 */
export async function authenticateWithBiometrics() {
  const supported = await canUseBiometrics();

  if (!supported.supported) {
    return {
      success: false,
      message: supported.message,
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Verify your identity",
    cancelLabel: "Cancel",
    fallbackLabel: "",
    disableDeviceFallback: false,
  });

  return {
    success: result.success,
    message: result.success
      ? ""
      : result.error ?? "Biometric authentication failed.",
  };
}
