import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import {
  clearPendingSignup,
  setCredentials,
  setFaceLockEnabled,
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { HeaderLogo } from "./forgot";

const VerifyOtpScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const pendingSignup = useAppSelector((state) => state.auth.pendingSignup);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { email, path, mode } = useLocalSearchParams<{
    email?: string;
    path?: string;
    mode?: string;
  }>();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  async function verify() {
    if (!email) {
      Alert.alert("Verify OTP", "Missing email for OTP verification.");
      return;
    }

    if (otp.length !== 4) {
      Alert.alert("Verify OTP", "Enter the 4-digit code.");
      return;
    }

    try {
      await verifyOtp({
        email,
        otp,
      }).unwrap();

      if (mode === "signup") {
        if (!pendingSignup) {
          Alert.alert("Sign up", "Signup details expired. Please try again.");
          router.replace("/(auth)");
          return;
        }

        const signupData = pendingSignup;

        await register({
          fullName: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
          twoFactorEnabled: signupData.faceLockEnabled,
        }).unwrap();

        dispatch(clearPendingSignup());

        try {
          const loginResponse = await login({
            email: signupData.email,
            password: signupData.password,
          }).unwrap();

          dispatch(setCredentials(loginResponse.data));
          dispatch(setFaceLockEnabled(signupData.faceLockEnabled));
          router.replace("/(protected)/(tab)/(home)");
        } catch {
          Alert.alert(
            "Account created",
            "Email verified successfully. Please sign in to continue.",
          );
          router.replace("/(auth)");
        }

        return;
      }

      if (path) {
        router.replace({
          pathname: path as "/(auth)/set-password",
          params: { email },
        });
        return;
      }

      router.replace("/(auth)");
    } catch (error) {
      Alert.alert(
        mode === "signup" ? "Sign up failed" : "Verification failed",
        getErrorMessage(error),
      );
    }
  }

  async function resendOtp() {
    if (!email) {
      Alert.alert("Resend OTP", "Missing email for OTP verification.");
      return;
    }

    try {
      const response = await sendOtp({ email }).unwrap();
      Alert.alert("OTP sent", response.message);
    } catch (error) {
      Alert.alert("Resend failed", getErrorMessage(error));
    }
  }

  return (
    <BG>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <HeaderLogo />
          {/* Brand Header */}
          <View style={styles.inner}>
            <Text style={styles.heading}>Verify Code</Text>
            <Text style={styles.description}>
              Enter the 4-digit code sent to {email || "your email"}.
            </Text>

            <OtpInput
              numberOfDigits={4}
              autoFocus={true}
              onTextChange={setOtp}
              onFilled={(code) => setOtp(code)}
              focusColor={colors.main}
              theme={{
                pinCodeContainerStyle: styles.otpBox,
                containerStyle: { marginBottom: scale(12) },
              }}
            />
          </View>
          <CustomButton
            title={
              isVerifying || isRegistering || isLoggingIn
                ? "Verifying..."
                : "Verify"
            }
            onPress={() => void verify()}
            disabled={isVerifying || isRegistering || isLoggingIn}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Didn&apos;t receive the code?{" "}
            </Text>
            <TouchableOpacity onPress={() => void resendOtp()}>
              <Text style={styles.linkText}>
                {isResending ? "Sending..." : "Resend"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              dispatch(clearPendingSignup());
              router.replace("/(auth)");
            }}
          >
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BG>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoText: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "800",
    marginVertical: 40,
  },
  inner: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heading: {
    fontSize: moderateScale(28),
    fontWeight: 500,
    marginBottom: verticalScale(12),
    color: colors.text,
    textAlign: "center",
  },

  description: {
    width: scale(250),
    fontSize: moderateScale(13),
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: verticalScale(20),
    marginHorizontal: "auto",
    lineHeight: moderateScale(18),
  },
  otpBox: {
    width: scale(50),
    height: verticalScale(55),
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: verticalScale(10),
  },
  footerText: { color: colors.secondaryText },
  linkText: { color: colors.main, fontWeight: "700" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    gap: 4,
  },
  backText: {
    color: colors.main,
    fontSize: 15,
    fontWeight: "600",
  },
});
