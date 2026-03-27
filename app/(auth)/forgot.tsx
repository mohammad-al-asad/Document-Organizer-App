import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import { useSendOtpMutation } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  async function requestOtp(values: ForgotFormValues) {
    try {
      await sendOtp(values).unwrap();

      router.replace({
        pathname: "/(auth)/verify-otp",
        params: {
          email: values.email,
          path: "/(auth)/set-password",
        },
      });
    } catch (error) {
      Alert.alert("Could not send OTP", getErrorMessage(error));
    }
  }

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
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <CustomInput
                  label="Email"
                  icon={<Mail size={20} color={colors.subtleText} />}
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <View style={styles.buttonSpacer}>
              <CustomButton
                title={isLoading ? "Sending..." : "Request OTP"}
                onPress={form.handleSubmit(requestOtp)}
                disabled={isLoading}
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
    color: colors.text,
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
    color: colors.text,
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
    color: colors.text,
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
