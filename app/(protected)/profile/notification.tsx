import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
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

export default function NotificationSettings() {
  const [general, setGeneral] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(true);

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={{ width: 24 }} /> {/* Balance for back arrow */}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Notification Options */}
          <View style={styles.settingsList}>
            <NotificationToggle
              label="General notification"
              isEnabled={general}
              onToggle={() => setGeneral(!general)}
            />
            <NotificationToggle
              label="Sound"
              isEnabled={sound}
              onToggle={() => setSound(!sound)}
            />
            <NotificationToggle
              label="Vibrate"
              isEnabled={vibrate}
              onToggle={() => setVibrate(!vibrate)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Sub-component for individual toggle cards
const NotificationToggle = ({ label, isEnabled, onToggle }: any) => (
  <View style={styles.toggleCard}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      trackColor={{ false: colors.border, true: colors.main }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.border}
      onValueChange={onToggle}
      value={isEnabled}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 20,
  },
  settingsList: {
    gap: 15,
  },
  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
});
