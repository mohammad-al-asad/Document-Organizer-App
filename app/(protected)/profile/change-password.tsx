import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { useChangePasswordMutation } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      const result = await changePassword(values).unwrap();
      if (result.success) {
        Alert.alert("Success", "Password updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.currentPassword && styles.inputError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Current Password"
                      placeholderTextColor={colors.subtleText}
                      secureTextEntry={!showCurrent}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrent(!showCurrent)}
                      style={styles.eyeIcon}
                    >
                      {showCurrent ? (
                        <Eye color={colors.subtleText} size={20} />
                      ) : (
                        <EyeOff color={colors.subtleText} size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.currentPassword && (
                <Text style={styles.errorText}>
                  {errors.currentPassword.message}
                </Text>
              )}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.newPassword && styles.inputError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      placeholderTextColor={colors.subtleText}
                      secureTextEntry={!showNew}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNew(!showNew)}
                      style={styles.eyeIcon}
                    >
                      {showNew ? (
                        <Eye color={colors.subtleText} size={20} />
                      ) : (
                        <EyeOff color={colors.subtleText} size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>
                  {errors.newPassword.message}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.confirmPassword && styles.inputError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={colors.subtleText}
                      secureTextEntry={!showConfirm}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      style={styles.eyeIcon}
                    >
                      {showConfirm ? (
                        <Eye color={colors.subtleText} size={20} />
                      ) : (
                        <EyeOff color={colors.subtleText} size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title={isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
            onPress={handleSubmit(onSubmit)}
            style={styles.updateBtn}
          />
        </View>
      </SafeAreaView>
    </BG>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerBtn: { width: 40, alignItems: "center" },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },

  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
  },
  updateBtn: {
    backgroundColor: colors.main,
    borderRadius: 16,
    height: 56,
  },
});
