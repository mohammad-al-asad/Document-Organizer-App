import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import {
  Calendar,
  Car,
  Clock,
  CreditCard,
  FileText,
  Home,
  Pencil,
  Plus,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemindersScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.overline}>OVERVIEW</Text>
            <Text style={styles.headerTitle}>Reminders</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {["Upcoming", "Overdue", "All"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tabItem}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Today Section */}
          <Text style={styles.sectionLabel}>TODAY</Text>
          <ReminderCard
            title="Car Insurance Renewal"
            subtitle="Policy #9822-AC"
            time="Today, 5:00 PM"
            tag="YEARLY"
            icon={<Car size={20} color={colors.main} />}
            hasBorder
          />
          <ReminderCard
            title="Amex Gold Payment"
            subtitle="Min due: $145.00"
            time="Today, 8:00 PM"
            tag="MONTHLY"
            icon={<CreditCard size={20} color={colors.main} />}
          />

          {/* Tomorrow Section */}
          <Text style={styles.sectionLabel}>TOMORROW</Text>
          <ReminderCard
            title="Home Warranty Check"
            subtitle="HVAC System"
            time="Tomorrow, 10:00 AM"
            tag="ONE-TIME"
            icon={<Home size={20} color={colors.main} />}
          />
          <ReminderCard
            title="Passport Expiry"
            subtitle="Document #U88291"
            time="Nov 24, 2:00 PM"
            tag="DECADE"
            icon={<FileText size={20} color={colors.main} />}
          />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(protected)/add-reminder")}
        >
          <Plus color={colors.text} size={30} strokeWidth={3} />
        </TouchableOpacity>
      </SafeAreaView>
    </BG>
  );
}

// Components
const ReminderCard = ({ title, subtitle, time, tag, icon, hasBorder }: any) => (
  <View style={[styles.card, hasBorder && styles.cardBordered]}>
    <View style={styles.cardHeader}>
      <View style={styles.iconCircle}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.cardActions}>
        <Pencil size={18} color={colors.subtleText} style={{ marginRight: 10 }} />
        <Clock size={18} color={colors.subtleText} />
      </View>
    </View>
    <View style={styles.cardFooter}>
      <View style={styles.timeRow}>
        <Calendar size={14} color={colors.main} />
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.tagBadge}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  overline: {
    color: colors.main,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },

  // Tabs
  tabContainer: { flexDirection: "row", marginBottom: 25 },
  tabItem: { marginRight: 30, paddingBottom: 8 },
  tabText: { color: colors.subtleText, fontSize: 16, fontWeight: "600" },
  tabTextActive: { color: colors.text },
  tabIndicator: {
    height: 3,
    backgroundColor: colors.main,
    borderRadius: 2,
    marginTop: 4,
    width: "100%",
  },

  sectionLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: 1,
  },

  // Card Styles
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBordered: { borderLeftWidth: 4, borderLeftColor: colors.main },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  cardSubtitle: { color: colors.mutedText, fontSize: 13, marginTop: 2 },
  cardActions: { flexDirection: "row", alignSelf: "flex-start" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timeRow: { flexDirection: "row", alignItems: "center" },
  timeText: { color: colors.text, fontSize: 14, marginLeft: 8, fontWeight: "500" },
  tagBadge: {
    backgroundColor: "rgba(254, 212, 76, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { color: colors.text, fontSize: 10, fontWeight: "bold" },

  // Navigation
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.main,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.main,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
