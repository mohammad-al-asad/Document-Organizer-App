import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
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

export default function AddReminder() {
  const [repeat, setRepeat] = useState("Yearly");
  const [notifType, setNotifType] = useState("Push");

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Reminder</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Linked Record Dropdown */}
          <Text style={styles.label}>LINKED RECORD</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Car color={colors.main} size={20} />
            <Text style={styles.dropdownText}>Car Insurance Renewal</Text>
            <ChevronDown color={colors.mutedText} size={20} />
          </TouchableOpacity>

          {/* Reminder Title */}
          <Text style={styles.label}>REMINDER TITLE</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Renew Policy"
              placeholderTextColor={colors.subtleText}
              style={styles.textInput}
            />
          </View>

          {/* Date & Time Row */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>DATE</Text>
              <TouchableOpacity style={styles.dateTimeField}>
                <Calendar color={colors.subtleText} size={18} />
                <Text style={styles.dateTimeText}>Oct 24, 2023</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>TIME</Text>
              <TouchableOpacity style={styles.dateTimeField}>
                <Clock color={colors.subtleText} size={18} />
                <Text style={styles.dateTimeText}>09:00 AM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Repeat Segmented Control */}
          <Text style={styles.label}>REPEAT</Text>
          <View style={styles.segmentedControl}>
            {["None", "Monthly", "Yearly"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setRepeat(option)}
                style={[
                  styles.segmentItem,
                  repeat === option && styles.segmentActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    repeat === option && styles.segmentTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notification Type Section */}
          <Text style={styles.label}>NOTIFICATION TYPE</Text>
          
          <TouchableOpacity 
            style={[styles.notifCard, notifType === "Push" && styles.notifCardActive]}
            onPress={() => setNotifType("Push")}
          >
            <View style={styles.notifIconBox}>
              <Bell color={colors.main} size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.notifTitle}>Push Notification</Text>
              <Text style={styles.notifSub}>Instant alert on device</Text>
            </View>
            <View style={[styles.radio, notifType === "Push" && styles.radioActive]}>
                {notifType === "Push" && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.notifCard, notifType === "Email" && styles.notifCardActive]}
            onPress={() => setNotifType("Email")}
          >
            <View style={styles.notifIconBox}>
              <Mail color={colors.subtleText} size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.notifTitle}>Email Reminder</Text>
              <Text style={styles.notifSub}>Sent to registered email</Text>
            </View>
            <View style={[styles.radio, notifType === "Email" && styles.radioActive]}>
                {notifType === "Email" && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <CheckCircle2 color={colors.text} size={24} />
          <Text style={styles.saveBtnText}>Save Record</Text>
        </TouchableOpacity>
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
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "bold" },
  cancelText: { color: colors.mutedText, fontSize: 16 },

  scrollContent: { paddingBottom: 40 },
  label: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 0.5,
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: { color: colors.text, flex: 1, marginLeft: 12, fontSize: 15 },

  inputWrapper: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: { color: colors.text, fontSize: 16 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  dateTimeField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeText: { color: colors.text, marginLeft: 10, fontSize: 15 },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentActive: { backgroundColor: colors.main },
  segmentText: { color: colors.mutedText, fontWeight: "600" },
  segmentTextActive: { color: colors.text },

  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifCardActive: {
    borderColor: colors.main,
    backgroundColor: "rgba(254, 212, 76, 0.25)",
  },
  notifIconBox: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notifTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  notifSub: { color: colors.mutedText, fontSize: 12, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.subtleText,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: colors.main },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.main },

  saveBtn: {
    backgroundColor: colors.main,
    marginBottom: 20,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
