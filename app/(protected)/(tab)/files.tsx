import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { useGetDocumentsQuery } from "@/store/document";
import {
  Car,
  ChevronRight,
  FileText,
  Home,
  Search,
  ShieldPlus,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const extractFormat = (mimeType: string) => {
  if (!mimeType) return "FILE";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("image")) return "IMG";
  return mimeType.split("/")[1]?.toUpperCase() || "FILE";
};

export const timeAgo = (dateString: string) => {
  if (!dateString) return "";
  const diff = Math.floor(
    (new Date().getTime() - new Date(dateString).getTime()) / 1000,
  );
  if (diff < 60) return "Just now";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return `Yesterday`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

export const getCategoryIcon = (
  type: string,
  size = 18,
  customColor?: string,
) => {
  const t = type?.toLowerCase();
  if (
    t === "vehicle" ||
    t === "vehicles" ||
    t === "driving_license" ||
    t === "vehicle_registration"
  )
    return <Car color={customColor || "#f97316"} size={size} />;
  if (t === "home" || t === "property")
    return <Home color={customColor || colors.main} size={size} />;
  if (t === "health" || t === "medical_record")
    return <ShieldPlus color={customColor || "#a855f7"} size={size} />;
  return <FileText color={customColor || colors.mutedText} size={size} />;
};

export default function MyRecords() {
  const [activeFilter, setActiveFilter] = useState("All Records");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const categoryParam =
    activeFilter === "All Records" ? undefined : activeFilter.toLowerCase();
    
  const queryParams: Record<string, any> = {
    documentCategory: categoryParam,
  };
  
  if (debouncedSearch.trim()) {
    queryParams.search = debouncedSearch.trim();
  }

  const { data: response, isLoading } = useGetDocumentsQuery(queryParams);
  

  const documents = response?.data || [];

  const recentUploads = [...documents]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const recentActivity = [...documents]
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

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
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {[
              "All Records",
              "Health",
              "Personal",
              "Vehicle",
              "Insurance",
              "Legal",
            ].map((filter) => (
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
            ))}
          </ScrollView>

          {/* Highlighted Records (Cards) */}
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.main} />
            </View>
          ) : documents.length > 0 ? (
            documents.map((doc: any) => (
              <RecordCard
                key={doc._id}
                title={doc.title || doc.originalName || "Document"}
                sub={
                  doc.extractedData?.documentNumber
                    ? `ID - ${doc.extractedData.documentNumber}`
                    : doc.documentCategory || "Uploaded Asset"
                }
                date={new Date(doc.createdAt).toLocaleDateString()}
                status="ACTIVE"
                type={doc.documentCategory?.toLowerCase()}
                showButton={false}
                fileUrl={doc.fileUrl}
              />
            ))
          ) : (
            <Text
              style={{
                color: colors.mutedText,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              No records match this filter.
            </Text>
          )}

          {/* Recent Uploads Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentUploads.length > 0 ? (
            recentUploads.map((doc: any) => (
              <FileItem
                key={`up-${doc._id}`}
                icon={getCategoryIcon(doc.documentCategory, 18)}
                name={doc.title || doc.originalName || "Document"}
                info={`${extractFormat(doc.mimeType)} - ${formatBytes(doc.size)}`}
                time={timeAgo(doc.createdAt)}
              />
            ))
          ) : (
            <Text style={{ color: colors.mutedText, textAlign: "center", marginBottom: 15 }}>
              No recent uploads.
            </Text>
          )}

          {/* Recent Activity Section */}
          <View style={[styles.sectionHeader, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.length > 0 ? (
            recentActivity.map((doc: any) => (
              <ActivityItem
                key={`act-${doc._id}`}
                icon={getCategoryIcon(doc.documentCategory, 18)}
                title={doc.title || doc.originalName || "Document"}
                sub={`Updated ${timeAgo(doc.updatedAt)}`}
              />
            ))
          ) : (
            <Text style={{ color: colors.mutedText, textAlign: "center", marginBottom: 15 }}>
              No recent activity.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// --- Sub-components ---

const RecordCard = ({ title, sub, date, status, type, showButton, fileUrl }: any) => {
  const isExpiring = status === "EXPIRING";

  const renderIcon = () => (
    <View style={styles.imageOverlayIcon}>
      {getCategoryIcon(type, 20)}
    </View>
  );

  return (
    <View style={styles.recordCard}>
      <View style={styles.cardTop}>
        {fileUrl ? (
          <ImageBackground
            source={{ uri: fileUrl }}
            style={[styles.cardImagePlaceholder, { backgroundColor: "#000" }]}
            imageStyle={{ borderRadius: 12, opacity: 0.6 }}
          >
            {renderIcon()}
          </ImageBackground>
        ) : (
          <View style={styles.cardImagePlaceholder}>{renderIcon()}</View>
        )}
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
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  dateValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
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
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
