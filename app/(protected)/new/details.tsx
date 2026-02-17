import { BG } from "@/components/BG";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Download,
  Edit2,
  FileText,
  Info,
  Maximize,
  Share2,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordDetails() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { photo } = useLocalSearchParams();
  const parsePhoto = JSON.parse(photo as string);

  return (
    <>
      <Modal
        visible={isFullScreen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <Pressable
          style={styles.fullScreenOverlay}
          onPress={() => setIsFullScreen(false)}
        >
          <Image
            source={{ uri: parsePhoto.path }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
      <BG style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Record Details</Text>
            <TouchableOpacity>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Document Preview Card */}
            <View style={styles.previewCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: parsePhoto.path }}
                  style={styles.documentImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.fullScreenBtn}
                  onPress={() => setIsFullScreen(true)}
                >
                  <Maximize color="#14b8a6" size={16} />
                  <Text style={styles.fullScreenText}>View Full Screen</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fileInfoRow}>
                <View style={styles.fileIconBox}>
                  <FileText color="#f43f5e" size={20} />
                </View>
                <View>
                  <Text style={styles.fileName}>Deed_Signed_Final.pdf</Text>
                  <Text style={styles.fileMeta}>
                    2.4 MB • Added Oct 24, 2023
                  </Text>
                </View>
              </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.sectionHeader}>
                <Info color="#14b8a6" size={20} />
                <Text style={styles.sectionTitle}>Record Details</Text>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>CATEGORY</Text>
                  <Text style={styles.valueText}>Real Estate</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>DATE ISSUED</Text>
                  <Text style={styles.valueText}>Sep 15, 2018</Text>
                </View>
              </View>

              <View style={styles.assetValueBox}>
                <Text style={styles.label}>ASSET VALUE</Text>
                <Text style={styles.currencyValue}>$850,000.00</Text>
              </View>

              <View>
                <Text style={styles.label}>NOTES</Text>
                <Text style={styles.notesText}>
                  Original deed for the downtown property. Includes easement
                  details for the northern boundary utility access.
                </Text>
              </View>
            </View>

            {/* Short Description Section */}
            <View style={styles.card}>
              <Text style={styles.optionalLabel}>
                Short Description (Optional)
              </Text>
              <View style={styles.smallTextAreaContainer}>
                <TextInput
                  placeholderTextColor="#64748b"
                  style={styles.smallTextArea}
                  multiline
                />
              </View>
            </View>

            {/* Renewal Reminder Row */}
            <TouchableOpacity style={styles.reminderCard}>
              <View style={styles.reminderIconBox}>
                <Bell color="#14b8a6" size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reminderTitle}>Renewal Reminder</Text>
                <Text style={styles.reminderSub}>Active • Sep 15, 2024</Text>
              </View>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </BG>
      {/* Bottom Action Bar */}
      <View style={styles.bottomActions}>
        <ActionButton icon={<Edit2 color="white" size={20} />} label="Edit" />
        <ActionButton icon={<Share2 color="white" size={20} />} label="Share" />
        <ActionButton
          icon={<Download color="white" size={20} />}
          label="Download"
        />
        <ActionButton
          icon={<Trash2 color="#ef4444" size={20} />}
          label="Delete"
          isDelete
        />
      </View>
    </>
  );
}

const ActionButton = ({ icon, label, isDelete }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <View style={[styles.actionIconCircle, isDelete && styles.deleteCircle]}>
      {icon}
    </View>
    <Text style={[styles.actionLabel, isDelete && { color: "#ef4444" }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  container: { flex: 1, position: "relative" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  cancelText: { color: "#9ca3af", fontSize: 16 },
  scrollContent: { paddingBottom: 120 },

  // Document Card
  previewCard: {
    backgroundColor: "#161d2f",
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#334155",
  },
  documentImage: { width: "100%", height: "100%", opacity: 0.8 },
  fullScreenBtn: {
    position: "absolute",
    bottom: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.3)",
  },
  fullScreenText: {
    color: "#14b8a6",
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  fileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 5,
  },
  fileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileName: { color: "white", fontSize: 14, fontWeight: "600" },
  fileMeta: { color: "#64748b", fontSize: 12, marginTop: 2 },

  // Details Card
  detailsCard: {
    backgroundColor: "#161d2f",
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 15,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: { flex: 1 },
  label: {
    color: "#14b8a6",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  valueText: { color: "white", fontSize: 15, fontWeight: "500" },
  assetValueBox: { marginBottom: 20 },
  currencyValue: { color: "white", fontSize: 22, fontWeight: "bold" },
  notesText: { color: "#94a3b8", fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  optionalLabel: { color: "#9ca3af", fontSize: 13, marginBottom: 12 },
  smallTextAreaContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    height: 80,
    padding: 12,
  },
  smallTextArea: { color: "white", fontSize: 15 },

  // Reminder
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161d2f",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  reminderIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderTitle: { color: "white", fontSize: 14, fontWeight: "600" },
  reminderSub: { color: "#14b8a6", fontSize: 12, marginTop: 2 },

  // Bottom Nav
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#152A2D",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingBottom: 35,
  },
  actionBtn: { alignItems: "center" },
  actionIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  deleteCircle: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  actionLabel: { color: "#94a3b8", fontSize: 11 },
});
