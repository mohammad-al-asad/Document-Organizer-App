import { BG } from "@/components/BG";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsList() {
  const notifications = [
    {
      id: 1,
      message: "Sarah Johnson booked Conference Room A for tomorrow 2-4 PM. Payment confirmed.",
      time: "Fri, 12 am",
      isUnread: true,
    },
    {
      id: 2,
      message: "Mike Chen cancelled his booking for Meeting Room B. Refund processed automatically.",
      time: "Fri, 12 am",
      isUnread: false,
    },
    {
      id: 3,
      message: "Weekly payout of $1,245.50 has been transferred to your account ending in 4567.",
      time: "Fri, 12 am",
      isUnread: false,
    },
    {
      id: 4,
      message: "New features added: Enhanced booking analytics and customer feedback system.",
      time: "Fri, 12 am",
      isUnread: false,
    },
    {
      id: 5,
      message: "Emma Davis moved her booking from today 3 PM to Friday 10 AM. No additional charges.",
      time: "Fri, 12 am",
      isUnread: false,
    },
  ];

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - Minimal padding to match design */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((item) => (
            <View
              key={item.id}
              style={[
                styles.notificationCard,
                item.isUnread ? styles.unreadCard : styles.readCard,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.isUnread ? styles.unreadText : styles.readText,
                ]}
              >
                {item.message}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  item.isUnread ? styles.unreadTime : styles.readTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          ))}
        </ScrollView>
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
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  
  scrollContent: {
    paddingTop: 10,
    gap: 12 
  },

  notificationCard: {
    padding: 20,
    borderRadius: 12,
  },
  // Unread state: Vibrant Teal Gradient feel
  unreadCard: {
    backgroundColor: "#14b8a6",
  },
  // Read state: Subtle dark overlay
  readCard: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  unreadText: {
    color: "white",
    fontWeight: "500",
  },
  readText: {
    color: "#94a3b8",
  },

  timeText: {
    fontSize: 11,
  },
  unreadTime: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  readTime: {
    color: "#64748b",
  },
});