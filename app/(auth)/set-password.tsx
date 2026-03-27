import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { HeaderLogo } from "./forgot";

export default function SetPasswordFormScreen() {
  const router = useRouter();

  const setPassword = () => {
    router.replace("/(auth)");
  };

  return (
    <BG>
      <SafeAreaView style={styles.container}>
        {/* Brand Header */}
        <HeaderLogo />

        <Text style={styles.title}>SET A NEW PASSWORD</Text>
        <Text style={styles.subtitle}>Password must have 6-8 characters.</Text>

        <View style={styles.form}>
          <CustomInput
            label="New Password"
            icon={<Lock size={20} color={colors.subtleText} />}
            placeholder="Create a strong password"
            isPassword
          />
          <CustomInput
            label="Confirm New Password"
            icon={<Lock size={20} color={colors.subtleText} />}
            placeholder="Create a strong password"
            isPassword
          />

          {/* Replaced with CustomButton */}
          <CustomButton title="Update Password" onPress={setPassword} />
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(auth)")}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BG>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
  },
  logoText: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "800",
    marginVertical: 40,
  },
  title: { fontSize: 26, fontWeight: "700", color: colors.text, marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
  },
  form: { width: "100%", gap: verticalScale(25), marginTop: verticalScale(30) },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    marginLeft: 2,
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
