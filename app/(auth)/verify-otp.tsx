import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButtom";
import FeedbackModal from "@/components/FeedbackModal";
import { colors } from "@/config/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const [otp, setOtp] = useState("");
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const { path } = useLocalSearchParams();

  const verify = () => {
    if (!path) {
      setIsModal(true);
    } else {
      router.replace(path as any);
    }
  };

  return (
    <BG>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <HeaderLogo />
          <FeedbackModal
            message="Your Account Is Ready!"
            visible={isModal}
            onClose={() => router.replace("(protected)")}
          />
          {/* Brand Header */}
          <View style={styles.inner}>
            <Text style={styles.heading}>Verify Code</Text>
            <Text style={styles.description}>
              Enter the 4-digit code sent to your email or phone number.
            </Text>

            <OtpInput
              numberOfDigits={4}
              autoFocus={true}
              onFilled={(code) => setOtp(code)}
              focusColor={colors.main}
              theme={{
                pinCodeContainerStyle: styles.otpBox,
                containerStyle: { marginBottom: scale(12) },
              }}
            />
          </View>
          <CustomButton title="Verify" onPress={verify} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Didn&apos;t receive the code?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/forgot")}>
              <Text style={styles.linkText}>Resend</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(auth)")}
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
    color: "white",
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
    color: "#fff",
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
    borderColor: "#CBD5E1",
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
