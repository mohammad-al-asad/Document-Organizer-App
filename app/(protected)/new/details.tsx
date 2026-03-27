import { BG } from "@/components/BG";
import { colors } from "@/config/colors";
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
              <ArrowLeft color={colors.text} size={24} />
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
                  <Maximize color={colors.main} size={16} />
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
                    2.4 MB - Added Oct 24, 2023
                  </Text>
                </View>
              </View>
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.sectionHeader}>
                <Info color={colors.main} size={20} />
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
                  placeholderTextColor={colors.mutedText}
                  style={styles.smallTextArea}
                  multiline
                />
              </View>
            </View>

            {/* Renewal Reminder Row */}
            <TouchableOpacity style={styles.reminderCard}>
              <View style={styles.reminderIconBox}>
                <Bell color={colors.main} size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reminderTitle}>Renewal Reminder</Text>
                <Text style={styles.reminderSub}>Active - Sep 15, 2024</Text>
              </View>
              <ChevronRight color={colors.mutedText} size={20} />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </BG>
      {/* Bottom Action Bar */}
      <View style={styles.bottomActions}>
        <ActionButton icon={<Edit2 color={colors.text} size={20} />} label="Edit" />
        <ActionButton icon={<Share2 color={colors.text} size={20} />} label="Share" />
        <ActionButton
          icon={<Download color={colors.text} size={20} />}
          label="Download"
        />
        <ActionButton
          icon={<Trash2 color={colors.danger} size={20} />}
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
    <Text style={[styles.actionLabel, isDelete && { color: colors.danger }]}>
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
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "600" },
  cancelText: { color: colors.mutedText, fontSize: 16 },
  scrollContent: { paddingBottom: 120 },

  // Document Card
  previewCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(254, 212, 76, 0.2)",
  },
  documentImage: { width: "100%", height: "100%", opacity: 0.8 },
  fullScreenBtn: {
    position: "absolute",
    bottom: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(254, 212, 76, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(254, 212, 76, 0.6)",
  },
  fullScreenText: {
    color: colors.text,
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
  fileName: { color: colors.text, fontSize: 14, fontWeight: "600" },
  fileMeta: { color: colors.mutedText, fontSize: 12, marginTop: 2 },

  // Details Card
  detailsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 15,
  },
  sectionTitle: {
    color: colors.text,
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
    color: colors.main,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  valueText: { color: colors.text, fontSize: 15, fontWeight: "500" },
  assetValueBox: { marginBottom: 20 },
  currencyValue: { color: colors.text, fontSize: 22, fontWeight: "bold" },
  notesText: { color: colors.mutedText, fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionalLabel: { color: colors.mutedText, fontSize: 13, marginBottom: 12 },
  smallTextAreaContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 80,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallTextArea: { color: colors.text, fontSize: 15 },

  // Reminder
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(254, 212, 76, 0.25)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  reminderSub: { color: colors.main, fontSize: 12, marginTop: 2 },

  // Bottom Nav
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: colors.secondary,
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
    backgroundColor: "rgba(254, 212, 76, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  deleteCircle: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  actionLabel: { color: colors.mutedText, fontSize: 11 },
});
