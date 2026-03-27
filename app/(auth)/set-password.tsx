import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import { useSetNewPasswordMutation } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { HeaderLogo } from "./forgot";
import { z } from "zod";

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SetPasswordFormScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function updatePassword(values: PasswordFormValues) {
    if (!email) {
      Alert.alert("Reset password", "Missing email for password reset.");
      return;
    }

    try {
      const response = await setNewPassword({
        email,
        ...values,
      }).unwrap();

      Alert.alert("Password updated", response.message, [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)"),
        },
      ]);
    } catch (error) {
      Alert.alert("Reset failed", getErrorMessage(error));
    }
  }

  return (
    <BG>
      <SafeAreaView style={styles.container}>
        {/* Brand Header */}
        <HeaderLogo />

        <Text style={styles.title}>SET A NEW PASSWORD</Text>
        <Text style={styles.subtitle}>Password must have 6-8 characters.</Text>

        <View style={styles.form}>
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <CustomInput
                label="New Password"
                icon={<Lock size={20} color={colors.subtleText} />}
                placeholder="Create a strong password"
                isPassword
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <CustomInput
                label="Confirm New Password"
                icon={<Lock size={20} color={colors.subtleText} />}
                placeholder="Create a strong password"
                isPassword
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <CustomButton
            title={isLoading ? "Updating..." : "Update Password"}
            onPress={form.handleSubmit(updatePassword)}
            disabled={isLoading}
          />
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
