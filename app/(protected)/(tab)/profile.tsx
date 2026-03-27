import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { clearSession, useLogoutMutation } from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch (error) {
      Alert.alert("Logout", "Session cleared on this device.");
    } finally {
      dispatch(clearSession());
      router.replace("/(auth)");
    }
  }

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
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.fullName || "Vault User"}
              </Text>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
            </View>
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
            <TouchableOpacity
              style={styles.logoutItem}
              onPress={() => void handleLogout()}
            >
              <Text style={styles.logoutText}>
                {isLoading ? "Logging out..." : "Logout"}
              </Text>
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
      <ChevronRight color={colors.text} size={20} strokeWidth={2.5} />
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
    borderColor: colors.main,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 20,
  },
  userName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    color: colors.mutedText,
    fontSize: 14,
  },

  // Menu Styles
  menuContainer: { gap: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  chevronBox: {
    backgroundColor: colors.main,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutItem: {
    backgroundColor: colors.secondary,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
        elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});
