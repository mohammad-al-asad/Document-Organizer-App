import { BG } from "@/components/BG";
import {
  Car,
  ChevronRight,
  FileText,
  Home,
  Search,
  ShieldPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyRecords() {
  const [activeFilter, setActiveFilter] = useState("All Records");

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>My Records</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color="#64748b" size={20} />
            <TextInput
              placeholder="Search documents..."
              placeholderTextColor="#64748b"
              style={styles.searchInput}
            />
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {["All Records", "Expiring Soon", "Insurance", "Legal"].map(
              (filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterChip,
                    activeFilter === filter && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>

          {/* Highlighted Records (Cards) */}
          <RecordCard
            title="Car Registration"
            sub="Vehicle • Tesla Model 3"
            date="Oct 24, 2024"
            status="ACTIVE"
            type="vehicle"
          />

          <RecordCard
            title="Home Insurance"
            sub="Property • 124 Main St"
            date="in 5 days"
            status="EXPIRING"
            type="home"
            showButton
          />

          <RecordCard
            title="Health Insurance"
            sub="Personal • Policy #8821"
            date="in 5 days"
            status="EXPIRING"
            type="health"
            showButton
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

// --- Sub-components ---

const RecordCard = ({ title, sub, date, status, type, showButton }: any) => {
  const isExpiring = status === "EXPIRING";

  return (
    <View style={styles.recordCard}>
      <View style={styles.cardTop}>
        <View style={styles.cardImagePlaceholder}>
          {/* In the real app, use an Image here. Using Icon for placeholder */}
          <View style={styles.imageOverlayIcon}>
            {type === "vehicle" && <Car color="#f97316" size={20} />}
            {type === "home" && <Home color="#14b8a6" size={20} />}
            {type === "health" && <ShieldPlus color="#a855f7" size={20} />}
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.recordTitle}>{title}</Text>
            <View
              style={[
                styles.statusBadge,
                isExpiring ? styles.statusExpiring : styles.statusActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isExpiring ? { color: "#f97316" } : { color: "#14b8a6" },
                ]}
              >
                {status}
              </Text>
            </View>
          </View>
          <Text style={styles.recordSub}>{sub}</Text>

          <View style={[styles.rowBetween, { marginTop: 12 }]}>
            <View>
              <Text style={styles.dateLabel}>EXPIRY DATE</Text>
              <Text
                style={[styles.dateValue, isExpiring && { color: "#f97316" }]}
              >
                {date}
              </Text>
            </View>
            {showButton ? (
              <TouchableOpacity style={styles.renewBtn}>
                <Text style={styles.renewBtnText}>RENEW NOW</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.circleArrow}>
                <ChevronRight color="#4b5563" size={18} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export const FileItem = ({ icon, name, info, time }: any) => (
  <View style={styles.fileItem}>
    <View style={styles.fileIconBox}>{icon}</View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.fileName}>{name}</Text>
      <Text style={styles.fileInfo}>{info}</Text>
    </View>
    <Text style={styles.fileTime}>{time}</Text>
  </View>
);

export const ActivityItem = ({ icon, title, sub }: any) => (
  <TouchableOpacity style={styles.activityItem}>
    <View style={styles.activityIconBox}>{icon}</View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySub}>{sub}</Text>
    </View>
    <ChevronRight color="#4b5563" size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  screenTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 10, color: "white", fontSize: 16 },

  filterScroll: { marginBottom: 25 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 10,
    backgroundColor: "#1e293b",
  },
  filterChipActive: { borderColor: "#14b8a6", backgroundColor: "transparent" },
  filterText: { color: "#9ca3af", fontWeight: "500" },
  filterTextActive: { color: "#14b8a6" },

  recordCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  cardTop: { flexDirection: "row" },
  cardImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#334155",
    borderRadius: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  imageOverlayIcon: { backgroundColor: "#0f172a", padding: 6, borderRadius: 8 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  recordSub: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusActive: { backgroundColor: "rgba(20, 184, 166, 0.1)" },
  statusExpiring: { backgroundColor: "rgba(249, 115, 22, 0.1)" },
  statusText: { fontSize: 10, fontWeight: "800" },
  dateLabel: { color: "#64748b", fontSize: 10, fontWeight: "600" },
  dateValue: { color: "white", fontSize: 14, fontWeight: "bold", marginTop: 2 },
  renewBtn: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.3)",
  },
  renewBtnText: { color: "#f97316", fontSize: 10, fontWeight: "bold" },
  circleArrow: {
    width: 32,
    height: 32,
    backgroundColor: "#334155",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  viewAll: { color: "#14b8a6", fontSize: 14 },

  fileItem: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  fileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  fileName: { color: "white", fontSize: 15, fontWeight: "600" },
  fileInfo: { color: "#64748b", fontSize: 12, marginTop: 2 },
  fileTime: { color: "#64748b", fontSize: 12 },

  activityItem: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  activityIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: { color: "white", fontSize: 15, fontWeight: "600" },
  activitySub: { color: "#64748b", fontSize: 12, marginTop: 2 },
});
