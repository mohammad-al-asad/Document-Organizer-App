import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import {
  authenticateWithFaceLock,
  canUseFaceLock,
} from "@/lib/face-lock";
import {
  clearPendingSignup,
  setPendingSignup,
  setCredentials,
  setFaceLockEnabled,
  setFaceLockVerified,
  useLoginMutation,
  useSendOtpMutation,
} from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Lock, Mail, ScanFace, User } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema
  .extend({
    fullName: z.string().min(2, "Full name is required"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    faceLockEnabled: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { accessToken, faceLockEnabled } = useAppSelector((state) => state.auth);
  const [isSignup, setIsSignup] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      faceLockEnabled: false,
    },
  });

  async function handleLogin(values: LoginFormValues) {
    try {
      const response = await login(values).unwrap();

      dispatch(setCredentials(response.data));
      router.replace("/(protected)/(tab)/(home)");
    } catch (error) {
      Alert.alert("Sign in failed", getErrorMessage(error));
    }
  }

  async function handleSignup(values: SignupFormValues) {
    try {
      dispatch(setPendingSignup(values));
      await sendOtp({ email: values.email }).unwrap();

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          email: values.email,
          mode: "signup",
        },
      });
    } catch (error) {
      dispatch(clearPendingSignup());
      Alert.alert("Could not send OTP", getErrorMessage(error));
    }
  }

  async function handleFaceLockSignIn() {
    if (!accessToken || !faceLockEnabled) {
      Alert.alert(
        "Face Unlock",
        "Sign in once and enable Face Unlock before using facial sign-in.",
      );
      return;
    }

    const result = await authenticateWithFaceLock();

    if (!result.success) {
      Alert.alert("Face Unlock", result.message);
      return;
    }

    dispatch(setFaceLockVerified(true));
    router.replace("/(protected)/(tab)/(home)");
  }

  async function toggleFaceLock(
    value: boolean,
    onChange: (enabled: boolean) => void,
  ) {
    if (!value) {
      onChange(false);
      return;
    }

    const supported = await canUseFaceLock();

    if (!supported.supported) {
      Alert.alert("Face Unlock unavailable", supported.message);
      return;
    }

    onChange(true);
  }

  return (
    <BG>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <HeaderLogo />

          {/* Toggle Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !isSignup && styles.activeTab]}
              onPress={() => {
                dispatch(clearPendingSignup());
                setIsSignup(false);
              }}
            >
              <Text style={[styles.tabText, !isSignup && styles.activeTabText]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignup && styles.activeTab]}
              onPress={() => setIsSignup(true)}
            >
              <Text style={[styles.tabText, isSignup && styles.activeTabText]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {isSignup ? (
              <React.Fragment key="signup">
                <Controller
                  control={signupForm.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Full Name"
                      icon={<User size={20} color={colors.subtleText} />}
                      placeholder="Enter your name"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={signupForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Email"
                      icon={<Mail size={20} color={colors.subtleText} />}
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={signupForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Password"
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
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Confirm Password"
                      icon={<Lock size={20} color={colors.subtleText} />}
                      placeholder="Retype password"
                      isPassword
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={signupForm.control}
                  name="faceLockEnabled"
                  render={({ field }) => (
                    <View style={styles.switchRow}>
                      <View>
                        <Text style={styles.switchLabel}>Enable Face Unlock</Text>
                        <Text style={styles.switchSub}>
                          Uses face recognition after you sign in
                        </Text>
                      </View>
                      <Switch
                        value={field.value}
                        onValueChange={(value) =>
                          void toggleFaceLock(value, field.onChange)
                        }
                        trackColor={{ false: colors.border, true: colors.main }}
                        thumbColor={colors.surface}
                        ios_backgroundColor={colors.border}
                      />
                    </View>
                  )}
                />
              </React.Fragment>
            ) : (
              <React.Fragment key="login">
                <Controller
                  control={loginForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Email"
                      icon={<Mail size={20} color={colors.subtleText} />}
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={loginForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <CustomInput
                      label="Password"
                      icon={<Lock size={20} color={colors.subtleText} />}
                      placeholder="Enter your password"
                      isPassword
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.faceButton}
                  onPress={() => void handleFaceLockSignIn()}
                >
                  <View style={styles.faceButtonContent}>
                    <ScanFace size={25} color={colors.text} />
                    <Text style={styles.faceButtonText}>
                      Sign in with Face Unlock
                    </Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            )}
          </View>

          <CustomButton
            title={
              isSignup
                ? isSendingOtp
                  ? "Sending OTP..."
                  : "Verify email"
                : isLoggingIn
                  ? "Signing in..."
                  : "Sign In"
            }
            onPress={
              isSignup
                ? signupForm.handleSubmit(handleSignup)
                : loginForm.handleSubmit(handleLogin)
            }
            disabled={isSignup ? isSendingOtp : isLoggingIn}
          />
          {!isSignup && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => {
                router.replace("/(auth)/forgot");
              }}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.footerText}>
            By continuing, you agree to VaultLife&apos;s{" "}
            <Text style={styles.link}>Terms</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

export function HeaderLogo() {
  return (
    <Text style={styles.logoText}>
      Life<Text style={{ color: colors.main }}>Vault</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  logoText: {
    color: colors.text,
    fontSize: scale(36),
    fontWeight: "800",
    marginHorizontal: "auto",
    marginVertical: verticalScale(25),
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 5,
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
  activeTab: { backgroundColor: colors.main },
  tabText: { color: colors.text, fontWeight: "600" },
  activeTabText: { color: colors.text },

  card: {
    backgroundColor: colors.secondary,
    width: "100%",
    borderRadius: 24,
    padding: 20,
    gap: 15,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  switchLabel: { fontWeight: "700", color: colors.text },
  switchSub: { fontSize: 12, color: colors.mutedText },
  faceButton: {
    backgroundColor: colors.main,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(14),
  },
  faceButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  faceButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  footerText: {
    color: colors.text,
    fontSize: 12,
    textAlign: "center",
    marginTop: verticalScale(30),
    width: "85%",
  },
  link: { color: colors.main, fontWeight: "bold" },
  forgotButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(25),
    gap: 4,
  },
  forgot: {
    color: colors.main,
    fontSize: 14,
    fontWeight: "600",
  },
});
