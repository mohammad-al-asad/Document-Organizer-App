import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
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
            <ArrowLeft color={colors.text} size={24} />
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
              placeholderTextColor={colors.mutedText}
              style={styles.textInput}
            />
          </View>

          {/* Category Selector */}
          <Text style={styles.label}>CATEGORY</Text>
          <TouchableOpacity style={styles.categorySelector}>
            <View style={styles.categoryIconBox}>
              <Folder color={colors.main} size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.categoryPlaceholder}>Select Category</Text>
              <Text style={styles.categorySub}>Choose where this belongs</Text>
            </View>
            <ChevronDown color={colors.mutedText} size={20} />
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
              placeholderTextColor={colors.mutedText}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
        </ScrollView>
        {/* Primary Action Button */}
        <CustomButton
          title="Continue"
          onPress={() => router.push("/(protected)/new/upload")}
          style={styles.continueBtn}
        />
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
        <CheckCircle2 color={colors.main} size={16} />
      </View>
    )}
    <View style={selected ? { opacity: 1 } : { opacity: 0.6 }}>
      {React.cloneElement(icon, { color: selected ? colors.main : colors.text })}
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
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  cancelText: { color: colors.mutedText, fontSize: 16 },

  scrollContent: { paddingBottom: 20 },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },
  heroSub: { color: colors.mutedText, fontSize: 15, marginTop: 8, marginBottom: 30 },

  inputWrapper: {
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 60,
    justifyContent: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.main,
  },
  textInput: { color: colors.text, fontSize: 16 },

  label: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },

  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIconBox: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryPlaceholder: { color: colors.text, fontSize: 16, fontWeight: "600" },
  categorySub: { color: colors.mutedText, fontSize: 12, marginTop: 2 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeCard: {
    width: "48%",
    borderRadius: 15,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeCardSelected: {
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderColor: colors.main,
  },
  checkIcon: { position: "absolute", top: 10, right: 10 },
  typeText: {
    color: colors.text,
    fontSize: 14,
    marginTop: 10,
    fontWeight: "500",
  },
  typeTextSelected: { color: colors.text },

  descContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  continueBtn: {
    marginTop: 20,
  },
});
