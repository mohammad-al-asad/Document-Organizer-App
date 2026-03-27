import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import { Lock, Mail, ScanFace, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [twoStep, setTwoStep] = useState(false);

  function doAuth() {
    if (isSignup) {
      router.replace({
        pathname: "/(auth)/verify-otp",
        params: {
          email: "xyz@gmail.com",
        },
      });
    } else {
      router.replace("/(protected)/(tab)/(home)");
    }
  }

  return (
    <BG>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <HeaderLogo />

          {/* Toggle Switcher */}
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

          {/* Form Card */}
          <View style={styles.card}>
            {isSignup && (
              <CustomInput
                label="Full Name"
                icon={<User size={20} color={colors.subtleText} />}
                placeholder="Enter your name"
              />
            )}

            <CustomInput
              label="Email / Phone"
              icon={<Mail size={20} color={colors.subtleText} />}
              placeholder="Enter email or phone number"
            />

            <CustomInput
              label="Password"
              icon={<Lock size={20} color={colors.subtleText} />}
              placeholder="Create a strong password"
              isPassword
            />
            {!isSignup && (
              <TouchableOpacity style={styles.faceButton} onPress={doAuth}>
                <View style={styles.faceButtonContent}>
                  <ScanFace size={25} color={colors.text} />
                  <Text style={styles.faceButtonText}>
                    Sign in with Face ID
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {isSignup && (
              <>
                <CustomInput
                  label="Confirm Password"
                  icon={<Lock size={20} color={colors.subtleText} />}
                  placeholder="Retype password"
                  isPassword
                />
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchLabel}>Sign in with Face ID</Text>
                    <Text style={styles.switchSub}>
                      Adds extra security to your account
                    </Text>
                  </View>
                  <Switch
                    value={twoStep}
                    onValueChange={setTwoStep}
                    trackColor={{ false: colors.border, true: colors.main }}
                    thumbColor={colors.surface}
                    ios_backgroundColor={colors.border}
                  />
                </View>
              </>
            )}
          </View>

          <CustomButton
            title={isSignup ? "Create account" : "Sign In"}
            onPress={doAuth}
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
