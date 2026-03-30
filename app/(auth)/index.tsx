import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import {
  authenticateWithBiometrics,
  canUseBiometrics,
} from "@/lib/face-lock";
import {
  setCredentials,
  setFaceLockEnabled,
  setFaceLockVerified,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Fingerprint, Lock, Mail, User } from "lucide-react-native";
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
  const { accessToken, faceLockEnabled, user } = useAppSelector((state) => state.auth);
  const isReturningUser = Boolean(accessToken && user);
  const [isSignup, setIsSignup] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: isReturningUser ? (user?.email ?? "") : "",
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
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        twoFactorEnabled: false,
      }).unwrap();

      const loginResponse = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(loginResponse.data));
      dispatch(setFaceLockEnabled(values.faceLockEnabled));
      router.replace("/(protected)/(tab)/(home)");
    } catch (error) {
      Alert.alert("Sign up failed", getErrorMessage(error));
    }
  }

  async function handleBiometricSignIn() {
    if (!accessToken || !faceLockEnabled) {
      Alert.alert(
        "Biometric Unlock",
        "Sign in once and enable Biometric Unlock in settings before using this feature.",
      );
      return;
    }

    const result = await authenticateWithBiometrics();

    if (!result.success) {
      Alert.alert("Biometric Unlock", result.message);
      return;
    }

    dispatch(setFaceLockVerified(true));
    router.replace("/(protected)/(tab)/(home)");
  }

  async function toggleBiometrics(
    value: boolean,
    onChange: (enabled: boolean) => void,
  ) {
    if (!value) {
      onChange(false);
      return;
    }

    const supported = await canUseBiometrics();

    if (!supported.supported) {
      Alert.alert("Biometric Unlock unavailable", supported.message);
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

          {/* Welcome back greeting OR tab switcher */}
          {isReturningUser ? (
            <View style={styles.welcomeBack}>
              <Text style={styles.welcomeBackText}>
                Welcome back,{" "}
                <Text style={styles.welcomeName}>
                  {user?.fullName?.split(" ")[0] ?? "there"}
                </Text>
                 👋
              </Text>
              <Text style={styles.welcomeSub}>
                Sign in to continue to VaultLife
              </Text>
            </View>
          ) : (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, !isSignup && styles.activeTab]}
                onPress={() => setIsSignup(false)}
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
          )}

          {/* Form Card — show signup form only if NOT a returning user */}
          <View style={styles.card}>
            {isSignup && !isReturningUser ? (
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
                      <View style={styles.switchLabelGroup}>
                        <View style={styles.switchIconBadge}>
                          <Fingerprint size={18} color={colors.main} />
                        </View>
                        <View>
                          <Text style={styles.switchLabel}>Biometric Unlock</Text>
                          <Text style={styles.switchSub}>
                            Use fingerprint or face to unlock
                          </Text>
                        </View>
                      </View>
                      <Switch
                        value={field.value}
                        onValueChange={(value) =>
                          void toggleBiometrics(value, field.onChange)
                        }
                        trackColor={{ false: colors.border, true: colors.main }}
                        thumbColor={colors.surface}
                        ios_backgroundColor={colors.border}
                      />
                    </View>
                  )}
                />
                <CustomButton
                  title={isRegistering || isLoggingIn ? "Creating account..." : "Create Account"}
                  onPress={signupForm.handleSubmit(handleSignup)}
                  disabled={isRegistering || isLoggingIn}
                  style={{ marginTop: 10 }}
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
                <CustomButton
                  title={isLoggingIn ? "Signing in..." : "Sign In"}
                  onPress={loginForm.handleSubmit(handleLogin)}
                  disabled={isLoggingIn}
                  style={{ marginTop: 10 }}
                />
              </React.Fragment>
            )}
          </View>

          {isReturningUser && !isSignup && (
            <TouchableOpacity
              style={[styles.biometricButton, { marginTop: 20 }]}
              onPress={() => void handleBiometricSignIn()}
              activeOpacity={0.8}
            >
              <Fingerprint size={22} color={colors.btnText} strokeWidth={1.8} />
              <Text style={styles.biometricButtonText}>Sign in with Biometrics</Text>
            </TouchableOpacity>
          )}


          {!isSignup && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => router.replace("/(auth)/forgot")}
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

  welcomeBack: {
    alignItems: "center",
    marginBottom: verticalScale(20),
    gap: 4,
  },
  welcomeBackText: {
    fontSize: scale(20),
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  welcomeName: {
    color: colors.main,
  },
  welcomeSub: {
    fontSize: 13,
    color: colors.mutedText,
    textAlign: "center",
  },

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
    paddingTop: 4,
  },
  switchLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  switchIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.main}22`,
    alignItems: "center",
    justifyContent: "center",
  },
  switchLabel: { fontWeight: "700", color: colors.text, fontSize: 14 },
  switchSub: { fontSize: 11, color: colors.mutedText, marginTop: 2 },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.main,
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    width: "100%",
    elevation: 2,
    shadowColor: colors.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  biometricButtonText: {
    color: colors.btnText,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
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
