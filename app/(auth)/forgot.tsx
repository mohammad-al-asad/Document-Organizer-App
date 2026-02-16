import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <BG>
      <SafeAreaView style={styles.scrollContainer}>
        {/* Brand Header */}
        <HeaderLogo />
        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email or phone number and we&apos;ll send you
            a link to reset your password.
          </Text>

          <View style={styles.form}>
            <CustomInput
              label="Email / Phone"
              labelColor="#fff"
              icon={<Mail size={20} color="#999" />}
              placeholder="Email"
            />

            <View style={styles.buttonSpacer}>
              <CustomButton
                title="Request OTP"
                onPress={() => {
                  router.replace({
                    pathname: "/(auth)/verify-otp",
                    params: {
                      email: "xyz@gmail.com",
                      path: "/(auth)/set-password",
                    },
                  });
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/(auth)")}
            >
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </BG>
  );
}

export function HeaderLogo() {
  return (
    <Text style={styles.logoText}>
      Vault<Text style={{ color: colors.main }}>Life</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logoText: {
    color: "white",
    fontSize: scale(36),
    fontWeight: "800",
    marginHorizontal: "auto",
    marginVertical: verticalScale(25),
    marginBottom: verticalScale(90),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 35,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonSpacer: {
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 4,
  },
  backText: {
    color: colors.main,
    fontSize: 15,
    fontWeight: "600",
  },
});
