import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
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
            <Search color={colors.mutedText} size={20} />
            <TextInput
              placeholder="Search documents..."
              placeholderTextColor={colors.mutedText}
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
            sub="Vehicle - Tesla Model 3"
            date="Oct 24, 2024"
            status="ACTIVE"
            type="vehicle"
          />

          <RecordCard
            title="Home Insurance"
            sub="Property - 124 Main St"
            date="in 5 days"
            status="EXPIRING"
            type="home"
            showButton
          />

          <RecordCard
            title="Health Insurance"
            sub="Personal - Policy #8821"
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
            icon={<Home color={colors.main} size={18} />}
            name="Property Tax Receipt"
            info="PDF - 2.4 MB"
            time="Just now"
          />
          <FileItem
            icon={<Car color="#f97316" size={18} />}
            name="Vehicle Registration"
            info="IMG - 4.1 MB"
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
              >
                <FileText color={colors.text} size={18} />
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
            {type === "home" && <Home color={colors.main} size={20} />}
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
                  isExpiring ? { color: "#f97316" } : { color: colors.main },
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
                <ChevronRight color={colors.mutedText} size={18} />
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
    <ChevronRight color={colors.mutedText} size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.main,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 10, color: colors.text, fontSize: 16 },

  filterScroll: { marginBottom: 25 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.main,
    marginRight: 10,
    backgroundColor: "transparent",
  },
  filterChipActive: { backgroundColor: colors.secondary },
  filterText: { color: colors.text, fontWeight: "500" },
  filterTextActive: { color: colors.text },

  recordCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  cardTop: { flexDirection: "row" },
  cardImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 12,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    borderColor: colors.main,
    borderWidth: 1,
  },
  imageOverlayIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 6,
    borderRadius: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  recordSub: { color: colors.mutedText, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusActive: { backgroundColor: "rgba(20, 184, 166, 0.1)" },
  statusExpiring: { backgroundColor: "rgba(249, 115, 22, 0.1)" },
  statusText: { fontSize: 10, fontWeight: "800" },
  dateLabel: { color: colors.mutedText, fontSize: 10, fontWeight: "600" },
  dateValue: { color: colors.text, fontSize: 14, fontWeight: "bold", marginTop: 2 },
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
    backgroundColor: "#EEF2F7",
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
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "bold" },
  viewAll: { color: colors.btnText, fontSize: 14 },

  fileItem: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  fileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  fileName: { color: colors.text, fontSize: 15, fontWeight: "600" },
  fileInfo: { color: colors.mutedText, fontSize: 12, marginTop: 2 },
  fileTime: { color: colors.mutedText, fontSize: 12 },

  activityItem: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  activityIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  activitySub: { color: colors.mutedText, fontSize: 12, marginTop: 2 },
});
