import { BG } from "@/components/BG";
import { Skeleton } from "@/components/Skeleton";
import { getCategoryStyle } from "@/config/categories";
import { colors } from "@/config/colors";
import {
  useDeleteDocumentMutation,
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} from "@/store/document";
import { router, useLocalSearchParams } from "expo-router";
import {
  Activity,
  ArrowLeft,
  Baby,
  BadgeCheck,
  Bell,
  Briefcase,
  Car,
  CheckSquare,
  ChevronRight,
  CreditCard,
  DollarSign,
  Download,
  Edit2,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  Home,
  Info,
  Landmark,
  Languages,
  Maximize,
  Plane,
  Save,
  Share2,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  Utensils,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { verticalScale } from "react-native-size-matters";

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export default function ViewDocumentDetails() {
  const { id } = useLocalSearchParams();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetDocumentByIdQuery(id as string, {
    skip: !id,
  });
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();

  const doc = response?.data;
  console.log(doc);
  

  const [title, setTitle] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [additionalData, setAdditionalData] = useState<
    { id: string; key: string; value: string }[]
  >([]);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title || doc.originalName || "");
      setDocumentCategory(doc.documentCategory || "General");

      const newAdditionalData = [];
      let newShortDesc = "";
      if (doc.extractedData) {
        let i = 0;
        for (const [key, value] of Object.entries(doc.extractedData)) {
          if (key === "shortDescription") {
            newShortDesc = String(value);
          } else {
            const formattedKey = key.replace(/([A-Z])/g, " $1").trim();
            const titleCaseKey =
              formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
            newAdditionalData.push({
              id: String(i++),
              key: titleCaseKey,
              value: String(value),
            });
          }
        }
      }
      setShortDescription(newShortDesc);
      setAdditionalData(newAdditionalData);
    }
  }, [doc]);

  const handleSave = async () => {
    try {
      const extractedDataPayload: Record<string, string> = {};
      additionalData.forEach((item) => {
        if (item.key.trim()) extractedDataPayload[item.key] = item.value;
      });
      if (shortDescription.trim())
        extractedDataPayload.shortDescription = shortDescription;

      const payload = {
        title,
        documentCategory,
        extractedData: extractedDataPayload,
      };

      await updateDocument({ id: id as string, body: payload }).unwrap();
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not update document");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocument(id as string).unwrap();
              router.back();
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Could not delete document");
            }
          },
        },
      ],
    );
  };

  const style = getCategoryStyle(doc?.documentCategory || "General");
  const IconComp =
    {
      Globe,
      User,
      CreditCard,
      CheckSquare,
      Baby,
      Home,
      Briefcase,
      GraduationCap,
      DollarSign,
      ShieldCheck,
      Car,
      Plane,
      Landmark,
      Zap,
      BadgeCheck,
      Activity,
      Utensils,
      Shield,
      Languages,
      FileText,
    }[style.icon] || FileText;

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
          {doc?.fileUrl && (
            <Image
              source={{ uri: doc.fileUrl }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
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
            <View style={{ width: 24 }} />
          </View>

          {isLoading ? (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: 120 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <Skeleton height={200} borderRadius={20} style={{ marginBottom: 20 }} />
              <View style={[styles.card, { padding: 15, marginBottom: 20 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={44} height={44} borderRadius={22} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
                    <Skeleton width="40%" height={12} />
                  </View>
                </View>
              </View>
              <Skeleton height={60} borderRadius={16} style={{ marginBottom: 20 }} />
              <View style={[styles.card, { padding: 20, marginBottom: 20 }]}>
                <Skeleton width={100} height={14} style={{ marginBottom: 15 }} />
                <Skeleton height={40} borderRadius={10} style={{ marginBottom: 20 }} />
                <Skeleton width={80} height={12} style={{ marginBottom: 15 }} />
                <Skeleton height={60} borderRadius={10} style={{ marginBottom: 15 }} />
              </View>
              <Skeleton height={100} borderRadius={20} />
            </ScrollView>
          ) : isError || !doc ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Could not load document</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: 120 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* Document Preview Card */}
              <View style={styles.previewCard}>
                <View style={styles.imageContainer}>
                  {doc?.fileUrl && (
                    <Image
                      source={{ uri: doc.fileUrl }}
                      style={styles.documentImage}
                      resizeMode="cover"
                    />
                  )}
                  <TouchableOpacity
                    style={styles.fullScreenBtn}
                    onPress={() => setIsFullScreen(true)}
                  >
                    <Maximize color={colors.main} size={16} />
                    <Text style={styles.fullScreenText}>View Full Screen</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.fileInfoRow}>
                  <View
                    style={[
                      styles.fileIconBox,
                      { backgroundColor: `${style.colors[1]}20` },
                    ]}
                  >
                    <IconComp color={style.colors[1]} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {doc.originalName || "Document.jpg"}
                    </Text>
                    <Text style={styles.fileMeta}>
                      Added {new Date(doc.createdAt).toLocaleDateString()} -{" "}
                      {formatBytes(doc.size)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Category */}
              <Text style={styles.sectionLabel}>CATEGORY</Text>
              <View
                style={[
                  styles.categorySelector,
                  !isEditing && { opacity: 0.9 },
                ]}
              >
                <View style={styles.categoryIconBox}>
                  <Folder color={colors.main} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.categoryPlaceholder}>
                    {documentCategory || "General"}
                  </Text>
                  <Text style={styles.categorySub}>
                    Categorized automatically
                  </Text>
                </View>
              </View>

              {/* Details Card */}
              <View style={styles.detailsCard}>
                <View style={styles.sectionHeader}>
                  <Info color={colors.main} size={20} />
                  <Text style={styles.sectionTitle}>Record Details</Text>
                </View>

                {/* Title */}
                <View style={styles.formGroup}>
                  <Text style={styles.formGroupLabel}>TITLE</Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      !isEditing && styles.disabledInput,
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    editable={isEditing}
                  />
                </View>

                {/* Dynamic Extracted Data */}
                {additionalData.length > 0 && (
                  <Text style={[styles.sectionLabel, { marginTop: 15 }]}>
                    EXTRA DATA
                  </Text>
                )}

                {additionalData.map((item) => (
                  <View key={item.id} style={styles.dynamicRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <TextInput
                        style={[
                          styles.dynamicKeyInput,
                          !isEditing && { borderBottomColor: "transparent" },
                        ]}
                        value={item.key}
                        onChangeText={(val) =>
                          setAdditionalData((prev) =>
                            prev.map((p) =>
                              p.id === item.id ? { ...p, key: val } : p,
                            ),
                          )
                        }
                        editable={isEditing}
                      />
                      <TextInput
                        style={[
                          styles.dynamicValueInput,
                          !isEditing && { opacity: 0.9 },
                        ]}
                        value={item.value}
                        onChangeText={(val) =>
                          setAdditionalData((prev) =>
                            prev.map((p) =>
                              p.id === item.id ? { ...p, value: val } : p,
                            ),
                          )
                        }
                        editable={isEditing}
                        multiline
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Short Description Section */}
              {isEditing || shortDescription ? (
                <View style={styles.card}>
                  <Text style={styles.optionalLabel}>Short Description</Text>
                  <View
                    style={[
                      styles.smallTextAreaContainer,
                      !isEditing && styles.disabledInput,
                    ]}
                  >
                    <TextInput
                      style={styles.smallTextArea}
                      multiline
                      value={shortDescription}
                      onChangeText={setShortDescription}
                      editable={isEditing}
                      placeholder={isEditing ? "Enter description..." : ""}
                    />
                  </View>
                </View>
              ) : null}

              {/* Add Reminder Card */}
              <TouchableOpacity
                style={styles.reminderCard}
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/add-reminder",
                    params: { documentId: id || "" },
                  })
                }
              >
                <View style={styles.reminderIconBox}>
                  <Bell color={colors.main} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.reminderTitle}>Add Reminder</Text>
                  <Text style={styles.reminderSub}>
                    Set alert for this record
                  </Text>
                </View>
                <ChevronRight color={colors.mutedText} size={20} />
              </TouchableOpacity>
            </ScrollView>
          )}
        </SafeAreaView>
      </BG>

      {/* Bottom Action Bar */}
      {!isLoading && doc && (
        <View style={styles.bottomActions}>
          <ActionButton
            icon={
              isEditing ? (
                isUpdating ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Save color={colors.text} size={20} />
                )
              ) : (
                <Edit2 color={colors.text} size={20} />
              )
            }
            label={isEditing ? "Save" : "Edit"}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isUpdating}
          />
          <ActionButton
            icon={<Share2 color={colors.text} size={20} />}
            label="Share"
          />
          <ActionButton
            icon={<Download color={colors.text} size={20} />}
            label="Download"
          />
          <ActionButton
            icon={
              isDeleting ? (
                <ActivityIndicator size="small" color={colors.danger} />
              ) : (
                <Trash2 color={colors.danger} size={20} />
              )
            }
            label="Delete"
            isDelete
            onPress={handleDelete}
            disabled={isDeleting}
          />
        </View>
      )}
    </>
  );
}

const ActionButton = ({ icon, label, isDelete, onPress, disabled }: any) => (
  <TouchableOpacity
    style={styles.actionBtn}
    onPress={onPress}
    disabled={disabled}
  >
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
  scrollContent: { paddingTop: 10 },

  // Document Card
  previewCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(254, 212, 76, 0.2)",
  },
  documentImage: { width: "100%", height: "100%" },
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

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.text,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },

  // Category Selector
  sectionLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 5,
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
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

  // Details Card
  detailsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  formGroup: {
    marginBottom: 15,
  },
  formGroupLabel: {
    color: colors.main,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 6,
  },
  disabledInput: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },

  // Dynamic Fields
  dynamicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dynamicKeyInput: {
    color: colors.main,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  dynamicValueInput: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 4,
  },

  // Card general
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: verticalScale(200),
  },
  optionalLabel: { color: colors.mutedText, fontSize: 13, marginBottom: 12 },
  smallTextAreaContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  smallTextArea: {
    color: colors.text,
    fontSize: 15,
    padding: 15,
    textAlignVertical: "top",
    maxHeight: verticalScale(100),
  },

  // Bottom Actions
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingBottom: 35,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteCircle: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  actionLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
  },

  // Reminder Card
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 100, // Extra space for FAB and bottom actions
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reminderIconBox: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(254, 212, 76, 0.25)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  reminderSub: { color: colors.main, fontSize: 13, marginTop: 2 },
});
