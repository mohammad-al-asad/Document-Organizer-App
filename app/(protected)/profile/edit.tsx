import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import { ArrowLeft, Calendar, ChevronDown, Pencil } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(protected)/(tab)/profile")}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} /> {/* Spacing balance */}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=alex" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editBadge}>
                <Pencil color={colors.text} size={12} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={colors.subtleText}
                defaultValue="Minnie"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.subtleText}
                defaultValue="minnie@gmail.com"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity style={styles.inputRow}>
                <Text style={styles.inputText}>28/11/2005</Text>
                <Calendar color={colors.main} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity style={styles.inputRow}>
                <Text style={styles.inputText}>Mexico</Text>
                <ChevronDown color={colors.subtleText} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Save Button */}
        <CustomButton title="Save" />
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
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingBottom: 40 },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(51, 65, 85, 0.2)",
    padding: 4,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.main,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  // Form
  form: { gap: 20 },
  inputGroup: { gap: 10 },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  input: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  inputRow: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
  },
  inputText: { color: colors.text, fontSize: 15 },
});
