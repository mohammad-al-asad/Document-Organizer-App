import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { router } from "expo-router";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  ChevronDown,
  FileText,
  Folder,
  Landmark,
  Lock,
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

export default function AddNewRecord() {
  const [selectedType, setSelectedType] = useState("Document");

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Record</Text>
          <TouchableOpacity>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heroTitle}>Let&apos;s start with the basics</Text>
          <Text style={styles.heroSub}>
            Provide the core details for this new record.
          </Text>

          {/* Record Title Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Record Title"
              placeholderTextColor="#64748b"
              style={styles.textInput}
            />
          </View>

          {/* Category Selector */}
          <Text style={styles.label}>CATEGORY</Text>
          <TouchableOpacity style={styles.categorySelector}>
            <View style={styles.categoryIconBox}>
              <Folder color="#3b82f6" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.categoryPlaceholder}>Select Category</Text>
              <Text style={styles.categorySub}>Choose where this belongs</Text>
            </View>
            <ChevronDown color="#64748b" size={20} />
          </TouchableOpacity>

          {/* Type Selection Grid */}
          <Text style={styles.label}>TYPE</Text>
          <View style={styles.grid}>
            <TypeCard
              title="Document"
              icon={<FileText size={24} />}
              selected={selectedType === "Document"}
              onPress={() => setSelectedType("Document")}
            />
            <TypeCard
              title="Physical Asset"
              icon={<Box size={24} />}
              selected={selectedType === "Physical Asset"}
              onPress={() => setSelectedType("Physical Asset")}
            />
            <TypeCard
              title="Financial"
              icon={<Landmark size={24} />}
              selected={selectedType === "Financial"}
              onPress={() => setSelectedType("Financial")}
            />
            <TypeCard
              title="Credentials"
              icon={<Lock size={24} />}
              selected={selectedType === "Credentials"}
              onPress={() => setSelectedType("Credentials")}
            />
          </View>

          {/* Description Input */}
          <View style={styles.descContainer}>
            <Text style={styles.descLabel}>Short Description (Optional)</Text>
            <TextInput
              placeholder="Desc."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>

          {/* Primary Action Button */}
          <CustomButton
            title="Continue"
            onPress={() => router.push("/(protected)/new/upload")}
            style={styles.continueBtn}
          />
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

// Helper component for Type Cards
const TypeCard = ({ title, icon, selected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.typeCard, selected && styles.typeCardSelected]}
  >
    {selected && (
      <View style={styles.checkIcon}>
        <CheckCircle2 color="#3b82f6" size={16} fill="#0f172a" />
      </View>
    )}
    <View style={selected ? { opacity: 1 } : { opacity: 0.6 }}>
      {React.cloneElement(icon, { color: selected ? "#14b8a6" : "#9ca3af" })}
    </View>
    <Text style={[styles.typeText, selected && styles.typeTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelText: { color: "#9ca3af", fontSize: 16 },

  scrollContent: { paddingBottom: 40 },
  heroTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },
  heroSub: { color: "#9ca3af", fontSize: 15, marginTop: 8, marginBottom: 30 },

  inputWrapper: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 60,
    justifyContent: "center",
    marginBottom: 25,
  },
  textInput: { color: "white", fontSize: 16 },

  label: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
  },

  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  categoryIconBox: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryPlaceholder: { color: "white", fontSize: 16, fontWeight: "600" },
  categorySub: { color: "#64748b", fontSize: 12, marginTop: 2 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 15,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "transparent",
  },
  typeCardSelected: {
    borderColor: "#14b8a6",
    backgroundColor: "rgba(20, 184, 166, 0.05)",
  },
  checkIcon: { position: "absolute", top: 10, right: 10 },
  typeText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "500",
  },
  typeTextSelected: { color: "#14b8a6" },

  descContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  descLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 12,
    color: "white",
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  continueBtn: {
    marginTop: 20,
  },
});
