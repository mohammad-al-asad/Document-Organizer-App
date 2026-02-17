import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
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

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Visibility States
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - No extra side padding here to keep it clean */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Old Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Old Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showOldPassword}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowOldPassword(!showOldPassword)}
                  style={styles.eyeIcon}
                >
                  {showOldPassword ? (
                    <Eye color="white" size={20} />
                  ) : (
                    <EyeOff color="white" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  {showNewPassword ? (
                    <Eye color="white" size={20} />
                  ) : (
                    <EyeOff color="white" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Action */}

        <CustomButton
          title="UPDATE PASSWORD"
          onPress={() => console.log("Password Updated")}
          style={styles.updateBtn}
        />
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
  headerBtn: { width: 40, alignItems: "center" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },

  // ScrollContent: Main content padding handled here instead of main view
  scrollContent: {
    paddingTop: 20,
  },

  form: { gap: 25 },
  inputGroup: { gap: 10 },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },

  updateBtn: {
    backgroundColor: "#14b8a6",
  },
});
