import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { authenticateWithBiometrics, canUseBiometrics } from "@/lib/face-lock";
import { setFaceLockEnabled } from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight, Fingerprint } from "lucide-react-native";
import React from "react";
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

export default function AccountSettings() {
  const dispatch = useAppDispatch();
  const faceLockEnabled = useAppSelector((state) => state.auth.faceLockEnabled);

  async function handleBiometricToggle(value: boolean) {
    if (!value) {
      dispatch(setFaceLockEnabled(false));
      return;
    }

    const supported = await canUseBiometrics();

    if (!supported.supported) {
      Alert.alert("Biometric Unlock unavailable", supported.message);
      return;
    }

    const result = await authenticateWithBiometrics();

    if (!result.success) {
      Alert.alert("Biometric Unlock", result.message);
      return;
    }

    dispatch(setFaceLockEnabled(true));
  }

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(protected)/(tab)/profile")}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={{ width: 24 }} /> {/* Balance for back arrow */}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings List */}
          <View style={styles.listContainer}>
            <View style={styles.biometricRow}>
              <View style={styles.biometricLeft}>
                <View style={styles.biometricIconBadge}>
                  <Fingerprint size={20} color={colors.main} />
                </View>
                <View style={styles.biometricTextGroup}>
                  <Text style={styles.itemText}>Biometric Unlock</Text>
                  <Text style={styles.itemSubText}>
                    Use fingerprint or face to lock the app
                  </Text>
                </View>
              </View>
              <Switch
                value={faceLockEnabled}
                onValueChange={(value) => void handleBiometricToggle(value)}
                trackColor={{ false: colors.border, true: colors.main }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>
            <SettingsItem
              title="Change Password"
              onPress={() => {
                router.push("/(protected)/profile/change-password");
              }}
            />
            <SettingsItem
              title="Terms of Services"
              onPress={() => {
                router.push("/(protected)/profile/terms");
              }}
            />
            <SettingsItem
              title="Privacy Policy"
              onPress={() => {
                router.push("/(protected)/profile/privacy");
              }}
            />
            <SettingsItem
              title="About us"
              onPress={() => {
                router.push("/(protected)/profile/about");
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Sub-component for individual setting rows
const SettingsItem = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <Text style={styles.itemText}>{title}</Text>
    <ChevronRight color={colors.subtleText} size={20} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 10,
  },
  listContainer: {
    gap: 5, // Tight spacing between items
  },
  biometricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  biometricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  biometricIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.main}22`,
    alignItems: "center",
    justifyContent: "center",
  },
  biometricTextGroup: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
  },
  itemSubText: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 4,
  },
});
