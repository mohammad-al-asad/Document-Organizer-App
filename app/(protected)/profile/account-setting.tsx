import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { authenticateWithFaceLock, canUseFaceLock } from "@/lib/face-lock";
import { setFaceLockEnabled } from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
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

  async function handleFaceLockToggle(value: boolean) {
    if (!value) {
      dispatch(setFaceLockEnabled(false));
      return;
    }

    const supported = await canUseFaceLock();

    if (!supported.supported) {
      Alert.alert("Face Unlock unavailable", supported.message);
      return;
    }

    const result = await authenticateWithFaceLock();

    if (!result.success) {
      Alert.alert("Face Unlock", result.message);
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
            <View style={styles.faceLockRow}>
              <View>
                <Text style={styles.itemText}>Face Unlock</Text>
                <Text style={styles.itemSubText}>
                  Require face recognition before opening the app
                </Text>
              </View>
              <Switch
                value={faceLockEnabled}
                onValueChange={(value) => void handleFaceLockToggle(value)}
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
  faceLockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
