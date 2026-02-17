import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupport() {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & support</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* Illustration Section */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("@/assets/images/help-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.heroText}>Hello, how can we assist you?</Text>
        </View>

        {/* Form Section */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.form}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the title of your issue"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Write in bellow box</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write here..."
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>

        {/* Action Buttons */}
        <CustomButton title="SEND" style={{ marginTop: 40 }} />
        <CustomButton
          title="LIVE CHAT"
          style={{ backgroundColor: colors.main }}
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
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingBottom: 40 },

  // Illustration
  illustrationContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  illustration: {
    width: 280,
    height: 200,
    marginBottom: 20,
  },
  heroText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },

  // Form
  form: { gap: 20 },
  inputGroup: { gap: 10 },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: "white",
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  textArea: {
    height: 150,
    borderRadius: 15,
  },
});
