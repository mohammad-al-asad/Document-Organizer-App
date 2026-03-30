import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import {
  Activity,
  Baby,
  BadgeCheck,
  Bell,
  Briefcase,
  Calendar,
  Car,
  CheckSquare,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Languages,
  Pencil,
  Plane,
  Plus,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Trash2,
  User,
  Utensils,
  Zap,
} from "lucide-react-native";
import { getCategoryStyle } from "@/config/categories";
import { useGetRemindersQuery, useDeleteReminderMutation } from "@/store/reminder";
import { Skeleton } from "@/components/Skeleton";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemindersScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  
  // Map UI tabs to API filter values
  const apiFilter = activeTab.toLowerCase();
  
  const { data: response, isLoading } = useGetRemindersQuery(apiFilter);
  const [deleteReminder] = useDeleteReminderMutation();
  const reminders = response?.data || [];

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteReminder(id).unwrap();
            } catch (error: any) {
              Alert.alert("Error", error.data?.message || "Failed to delete reminder");
            }
          }
        }
      ]
    );
  };

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

          {isLoading ? (
            <View style={{ marginTop: 10 }}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={[styles.card, { padding: 16, marginBottom: 15 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                     <Skeleton width={44} height={44} borderRadius={22} />
                     <View style={{ flex: 1, marginLeft: 12 }}>
                        <Skeleton width="70%" height={16} style={{ marginBottom: 6 }} />
                        <Skeleton width="40%" height={12} />
                     </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Skeleton width={120} height={14} />
                     <Skeleton width={60} height={20} borderRadius={10} />
                  </View>
                </View>
              ))}
            </View>
          ) : reminders.length > 0 ? (
            reminders.map((reminder: any) => {
              const style = getCategoryStyle(reminder.documentId?.documentCategory || "Other");
              const IconComp = ({
                Globe, User, CreditCard, CheckSquare, Baby, Home, Briefcase, GraduationCap, 
                DollarSign, ShieldCheck, Car, Plane, Landmark, Zap, BadgeCheck, Activity, 
                Utensils, Shield, Languages, FileText
              } as any)[style.icon] || FileText;

              return (
                <ReminderCard
                  key={reminder._id}
                  title={reminder.title}
                  subtitle={reminder.message}
                  time={new Date(reminder.remindAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  tag={reminder.recurrence.toUpperCase()}
                  icon={<IconComp size={20} color={style.colors[1]} />}
                  tagColor={style.colors[1]}
                  onEdit={() => router.push({ pathname: "/(protected)/add-reminder", params: { id: reminder._id } })}
                  onDelete={() => handleDelete(reminder._id)}
                />
              );
            })
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: colors.mutedText, fontSize: 16 }}>No {apiFilter} reminders found.</Text>
            </View>
          )}
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
const ReminderCard = ({ title, subtitle, time, tag, icon, hasBorder, tagColor, onEdit, onDelete }: any) => (
  <View style={[styles.card, hasBorder && styles.cardBordered]}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconCircle, { backgroundColor: `${tagColor || colors.main}20` }]}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={onEdit}>
          <Pencil size={18} color={colors.subtleText} style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <View style={styles.timeRow}>
        <Calendar size={14} color={tagColor || colors.main} />
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={[styles.tagBadge, { backgroundColor: `${tagColor || colors.main}20` }]}>
        <Text style={[styles.tagText, { color: tagColor || colors.main }]}>{tag}</Text>
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 10, fontWeight: "bold" },

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
