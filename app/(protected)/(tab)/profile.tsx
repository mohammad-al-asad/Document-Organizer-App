import { BG } from "@/components/BG";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=alex" }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.userName}>Alex Morgan</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <ProfileMenuItem
              title="Edit Profile"
              onPress={() => {
                router.push("/(protected)/profile/edit");
              }}
            />
            <ProfileMenuItem
              title="Notification"
              onPress={() => {
                router.push("/(protected)/profile/notification");
              }}
            />
            <ProfileMenuItem
              title="Account Settings"
              onPress={() => {
                router.push("/(protected)/profile/account-setting");
              }}
            />
            <ProfileMenuItem
              title="Help & support"
              onPress={() => {
                router.push("/(protected)/profile/help");
              }}
            />

            {/* Logout Item */}
            <TouchableOpacity style={styles.logoutItem}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Sub-components
const ProfileMenuItem = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{title}</Text>
    <View style={styles.chevronBox}>
      <ChevronRight color="#0f172a" size={20} strokeWidth={2.5} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 40, paddingBottom: 120 },

  // Profile Header
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#14b8a6",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  userName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },

  // Menu Styles
  menuContainer: { gap: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  menuItemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  chevronBox: {
    backgroundColor: "#14b8a6",
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutItem: {
    backgroundColor: "#1e293b",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
