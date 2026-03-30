import { BG } from "@/components/BG";
import { Skeleton } from "@/components/Skeleton";
import { getCategoryStyle } from "@/config/categories";
import { colors } from "@/config/colors";
import { useGetDocumentsQuery } from "@/store/document";
import { useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  Baby,
  BadgeCheck,
  Bell,
  Briefcase,
  Car,
  CheckSquare,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Home,
  Landmark,
  Languages,
  Plane,
  Shield,
  ShieldCheck,
  ShieldPlus,
  User,
  Utensils,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { RecentActivitySection } from "../files";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning,"
      : currentHour < 18
        ? "Good Afternoon,"
        : "Good Evening,";

  const { data: response, isLoading: docsLoading } = useGetDocumentsQuery({
    limit: 5,
  });
  const documents = response?.data || [];

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1, paddingTop: 10 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                {user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <User color={colors.main} size={24} />
                )}
              </View>
              <View style={styles.greeting}>
                <Text style={styles.subText}>{greeting}</Text>
                <Text style={styles.titleText}>
                  Hi, {user?.fullName?.split(" ")[0] || "User"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() =>
                router.push("/(protected)/(tab)/(home)/notification")
              }
            >
              <Bell color={colors.text} size={24} />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* Document Highlights Carousel */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Documents</Text>
              <TouchableOpacity
                onPress={() => router.push("/(protected)/(tab)/files")}
              >
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {docsLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
              >
                {[1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.modernCard,
                      { backgroundColor: colors.surface, padding: 20 },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 15,
                      }}
                    >
                      <Skeleton width={80} height={12} />
                      <Skeleton width={30} height={30} borderRadius={15} />
                    </View>
                    <Skeleton
                      width="90%"
                      height={24}
                      style={{ marginBottom: 20 }}
                    />
                    <View style={styles.cardDivider} />
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "45%", marginBottom: 15 }}>
                        <Skeleton
                          width="40%"
                          height={10}
                          style={{ marginBottom: 5 }}
                        />
                        <Skeleton width="100%" height={14} />
                      </View>
                      <View style={{ width: "45%", marginBottom: 15 }}>
                        <Skeleton
                          width="40%"
                          height={10}
                          style={{ marginBottom: 5 }}
                        />
                        <Skeleton width="100%" height={14} />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : documents.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToInterval={CARD_WIDTH + 15}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
              >
                {documents.map((doc: any) => (
                  <ModernCarouselCard key={doc._id} doc={doc} />
                ))}
              </ScrollView>
            ) : (
              <TouchableOpacity
                style={styles.emptyCard}
                onPress={() => router.push("/(protected)/new")}
              >
                <FolderOpen color={colors.mutedText} size={32} />
                <Text style={styles.emptyText}>No documents found</Text>
                <Text style={styles.emptySubText}>
                  Securely store your first record
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Categories Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>

          <CategoryItem
            icon={<Home color={colors.main} />}
            title="Property"
            sub="Properties, Docs"
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tab)/files",
                params: { category: "Property" },
              })
            }
          />
          <CategoryItem
            icon={<Globe color="#55a6f7" />}
            title="Passport"
            sub="Passport, Visa"
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tab)/files",
                params: { category: "Passport" },
              })
            }
          />
          <CategoryItem
            icon={<Car color="#f97316" />}
            title="Vehicles"
            sub="Car, Motorcycle"
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tab)/files",
                params: { category: "Vehicle" },
              })
            }
          />
          <CategoryItem
            icon={<ShieldPlus color="#55a6f7" />}
            title="Health"
            sub="Records, Prescriptions"
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tab)/files",
                params: { category: "Health" },
              })
            }
          />
          <CategoryItem
            icon={<FolderOpen color="#D1D5DB" />}
            title="Personal Docs"
            sub="Records, Prescriptions"
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tab)/files",
                params: { category: "Personal" },
              })
            }
          />

          {/* Recent Uploads & Activity Sections */}
          <RecentActivitySection />
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Sub-components
const ModernCarouselCard = ({ doc }: any) => {
  const style = getCategoryStyle(doc.documentCategory);

  // Dynamic icon component
  const IconComp =
    {
      Globe,
      User,
      CreditCard,
      CheckSquare,
      Baby,
      Home,
      Briefcase,
      GraduationCap,
      DollarSign,
      ShieldCheck,
      Car,
      Plane,
      Landmark,
      Zap,
      BadgeCheck,
      Activity,
      Utensils,
      Shield,
      Languages,
      FileText,
    }[style.icon] || FileText;

  // Extract up to 4 significant fields
  const fields = Object.entries(doc.extractedData || {})
    .filter(([key]) => key !== "shortDescription")
    .slice(0, 4)
    .map(([key, value]) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .toUpperCase()
        .trim(),
      value: String(value),
    }));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/(protected)/document/${doc._id}` as any)}
    >
      <LinearGradient
        colors={style.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.modernCard}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardCategory}>
            {doc.documentCategory.toUpperCase()}
          </Text>
          <IconComp color="rgba(255,255,255,0.8)" size={24} />
        </View>

        <Text style={styles.cardTitle}>{doc.title || "Untitled"}</Text>

        <View style={styles.cardDivider} />

        <View style={styles.cardContent}>
          {fields.length > 0 ? (
            <View style={styles.fieldsGrid}>
              {fields.map((field, idx) => (
                <View key={idx} style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue} numberOfLines={1}>
                    {field.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>
                Document stored securely
              </Text>
            </View>
          )}
        </View>

        {/* Subtle background glow effect */}
        <View style={styles.glow} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CategoryItem = ({ icon, title, sub, onPress }: any) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryIcon}>{icon}</View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categorySub}>{sub}</Text>
    </View>
    <ChevronRight color={colors.mutedText} size={20} />
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
    borderColor: colors.main,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22.5,
  },
  greeting: { marginLeft: 12 },
  subText: { color: colors.mutedText, fontSize: 14 },
  titleText: { color: colors.text, fontSize: 20, fontWeight: "bold" },
  notificationBtn: { padding: 8 },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: colors.danger,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.background,
  },

  assetCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardLabel: { color: colors.mutedText, fontSize: 14 },
  assetAmount: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  growthText: { color: colors.main, fontSize: 14 },
  walletIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: "#b99e5423",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: { flexDirection: "row", marginBottom: 30 },
  statBox: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  statNumber: { color: colors.text, fontSize: 24, fontWeight: "bold" },
  statLabel: { color: colors.mutedText, fontSize: 12, marginTop: 4 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "bold" },
  viewAll: { color: colors.btnText },

  categoryItem: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryIcon: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: { color: colors.text, fontSize: 16, fontWeight: "600" },
  categorySub: { color: colors.mutedText, fontSize: 13 },

  // Modern Carousel Styles
  carouselSection: {
    marginBottom: 30,
  },
  carouselContainer: {
    paddingBottom: 10,
  },
  modernCard: {
    width: CARD_WIDTH,
    height: verticalScale(190),
    borderRadius: 24,
    padding: 20,
    marginRight: 15,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCategory: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 15,
  },
  cardContent: {
    flex: 1,
  },
  fieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  fieldItem: {
    width: "48%",
    marginBottom: 10,
  },
  fieldLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 2,
  },
  fieldValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loaderContainer: {
    height: 190,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    height: 190,
    backgroundColor: colors.secondary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptySubText: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 4,
  },
  placeholderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
    fontSize: 12,
  },
  glow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
