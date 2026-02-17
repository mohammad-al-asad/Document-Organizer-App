import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton"; // Assuming your structure has this
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
            <ArrowLeft color="white" size={24} />
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
            <Car color="#14b8a6" size={20} />
            <Text style={styles.dropdownText}>Car Insurance Renewal</Text>
            <ChevronDown color="#64748b" size={20} />
          </TouchableOpacity>

          {/* Reminder Title */}
          <Text style={styles.label}>REMINDER TITLE</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Renew Policy"
              placeholderTextColor="#94a3b8"
              style={styles.textInput}
            />
          </View>

          {/* Date & Time Row */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>DATE</Text>
              <TouchableOpacity style={styles.dateTimeField}>
                <Calendar color="#94a3b8" size={18} />
                <Text style={styles.dateTimeText}>Oct 24, 2023</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>TIME</Text>
              <TouchableOpacity style={styles.dateTimeField}>
                <Clock color="#94a3b8" size={18} />
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
              <Bell color="#14b8a6" size={20} />
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
              <Mail color="#94a3b8" size={20} />
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
          <CheckCircle2 color="#1e293b" size={24} />
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
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  cancelText: { color: "#9ca3af", fontSize: 16 },

  scrollContent: { paddingBottom: 40 },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 0.5,
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },
  dropdownText: { color: "white", flex: 1, marginLeft: 12, fontSize: 15 },

  inputWrapper: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
  },
  textInput: { color: "white", fontSize: 16 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  dateTimeField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
  },
  dateTimeText: { color: "white", marginLeft: 10, fontSize: 15 },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentActive: { backgroundColor: "#14b8a6" },
  segmentText: { color: "#94a3b8", fontWeight: "600" },
  segmentTextActive: { color: "#0f172a" },

  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  notifCardActive: { borderColor: "#14b8a6", backgroundColor: "rgba(20, 184, 166, 0.05)" },
  notifIconBox: {
    width: 44,
    height: 44,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notifTitle: { color: "white", fontSize: 15, fontWeight: "600" },
  notifSub: { color: "#64748b", fontSize: 12, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: "#14b8a6" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#14b8a6" },

  saveBtn: {
    backgroundColor: "#f1f5f9",
    marginBottom: 20,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "#1e293b",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});