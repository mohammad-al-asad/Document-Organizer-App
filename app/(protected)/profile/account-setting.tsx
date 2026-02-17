import { BG } from "@/components/BG";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettings() {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
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
    <ChevronRight color="#94a3b8" size={20} />
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
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 10,
  },
  listContainer: {
    gap: 5, // Tight spacing between items
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)", // Subtle separator
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
});
