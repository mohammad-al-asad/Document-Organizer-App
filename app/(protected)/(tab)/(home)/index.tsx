import { BG } from "@/components/BG";
import { router } from "expo-router";
import {
  AlertTriangle,
  Bell,
  Car,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  Home,
  ShieldPlus,
  Wallet,
} from "lucide-react-native";
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
import { ActivityItem, FileItem } from "../files";

export default function Dashboard() {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: "https://avatar.iran.liara.run/public/3" }}
                style={styles.avatar}
              />
              <View style={styles.greeting}>
                <Text style={styles.subText}>Good Morning,</Text>
                <Text style={styles.titleText}>Hi, Alex</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() =>
                router.push("/(protected)/(tab)/(home)/notification")
              }
            >
              <Bell color="white" size={24} />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* Total Assets Card */}
          <View style={styles.assetCard}>
            <View>
              <Text style={styles.cardLabel}>Total Assets</Text>
              <Text style={styles.assetAmount}>$124,500</Text>
              <Text style={styles.growthText}>↗ +12% this month</Text>
            </View>
            <View style={styles.walletIconContainer}>
              <Wallet color="#14b8a6" size={24} />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { marginRight: 10 }]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(249, 115, 22, 0.2)" },
                ]}
              >
                <AlertTriangle color="#f97316" size={20} />
              </View>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Critical Alerts</Text>
            </View>

            <View style={[styles.statBox, { marginLeft: 10 }]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(168, 85, 247, 0.2)" },
                ]}
              >
                <Clock color="#a855f7" size={20} />
              </View>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Renewals</Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <CategoryItem
            icon={<Home color="#14b8a6" />}
            title="Real Estate"
            sub="2 Properties, 12 Docs"
          />
          <CategoryItem
            icon={<Car color="#f97316" />}
            title="Vehicles"
            sub="1 Car, 1 Motorcycle"
          />
          <CategoryItem
            icon={<ShieldPlus color="#a855f7" />}
            title="Health"
            sub="Records, Prescriptions"
          />
          <CategoryItem
            icon={<FolderOpen color="#D1D5DB" />}
            title="Personal Docs"
            sub="Records, Prescriptions"
          />

          {/* Recent Uploads Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <FileItem
            icon={<Home color="#14b8a6" size={18} />}
            name="Property Tax Receipt"
            info="PDF • 2.4 MB"
            time="Just now"
          />
          <FileItem
            icon={<Car color="#f97316" size={18} />}
            name="Vehicle Registration"
            info="IMG • 4.1 MB"
            time="2h ago"
          />

          {/* Recent Activity Section */}
          <View style={[styles.sectionHeader, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon={<FileText color="#3b82f6" size={18} />}
            title="Car Insurance Policy"
            sub="Updated 2h ago"
          />
          <ActivityItem
            icon={
              <View
                style={{
                  backgroundColor: "#eab308",
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <FileText color="white" size={14} />
              </View>
            }
            title="Warranty: Refrigerator"
            sub="Added yesterday"
          />
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Sub-components for cleaner code
const CategoryItem = ({ icon, title, sub }: any) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>{icon}</View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categorySub}>{sub}</Text>
    </View>
    <ChevronRight color="#4b5563" size={20} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "#14b8a6",
  },
  greeting: { marginLeft: 12 },
  subText: { color: "#9ca3af", fontSize: 14 },
  titleText: { color: "white", fontSize: 20, fontWeight: "bold" },
  notificationBtn: { padding: 8 },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: "#ef4444",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#0f3443",
  },

  assetCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardLabel: { color: "#9ca3af", fontSize: 14 },
  assetAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  growthText: { color: "#14b8a6", fontSize: 14 },
  walletIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: { flexDirection: "row", marginBottom: 30 },
  statBox: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  statNumber: { color: "white", fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#9ca3af", fontSize: 12, marginTop: 4 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  viewAll: { color: "#14b8a6" },

  categoryItem: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 45,
    height: 45,
    backgroundColor: "#111827",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  categorySub: { color: "#6b7280", fontSize: 13 },
});
