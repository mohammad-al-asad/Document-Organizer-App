import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import {
  useConfirmDocumentMutation,
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
} from "@/store/document";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Edit2,
  FileText,
  Folder,
  Info,
  Maximize,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

import { CATEGORIES } from "@/config/categories";

export default function RecordDetails() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { photo } = useLocalSearchParams();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  // RTK Query hooks
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [confirmDocument, { isLoading: isConfirming }] =
    useConfirmDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();

  // Form states
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [originalName, setOriginalName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [additionalData, setAdditionalData] = useState<
    { id: string; key: string; value: string }[]
  >([]);

  useEffect(() => {
    if (!photo) {
      setTitle("Car registration");
      return;
    }

    const performUpload = async () => {
      try {
        const parsePhoto = JSON.parse(photo as string);
        if (!parsePhoto || !parsePhoto.path) return;

        const formData = new FormData();
        formData.append("document", {
          uri: parsePhoto.path,
          type: parsePhoto.mime || "image/jpeg",
          name: parsePhoto.filename || "upload.jpg",
        } as any);

        const result = await uploadDocument(formData).unwrap();

        if (result.success && result.data) {
          setDraftId(result.data.draftId);
          const fetchCategory = result.data.documentCategory;
          // Preselect valid category
          setCategory(
            CATEGORIES.includes(fetchCategory) ? fetchCategory : "Other",
          );
          setTitle(result.data.title || "");
          setOriginalName(result.data.originalName || "");
          setShortDescription(
            result.data.extractedData?.shortDescription || "",
          );

          if (result.data.extractedData) {
            const dynamicArr = [];
            let i = 0;
            for (const [key, value] of Object.entries(
              result.data.extractedData,
            )) {
              if (key !== "shortDescription") {
                // Transform camelCase key to "Title Case"
                const formattedKey = key.replace(/([A-Z])/g, " $1").trim();
                const titleCaseKey =
                  formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);

                dynamicArr.push({
                  id: String(i++),
                  key: titleCaseKey,
                  value: String(value),
                });
              }
            }
            setAdditionalData(dynamicArr);
          }
        } else {
          console.error("Upload failed", result?.message);
        }
      } catch (error) {
        Alert.alert("Error", "Error uploading document");
        console.error("Error uploading document:", error);
      }
    };

    performUpload();
  }, [photo]);

  const handleSave = async () => {
    if (!draftId) return;
    try {
      const extractedDataPayload = additionalData.reduce(
        (acc, item) => {
          if (item.key.trim()) {
            acc[item.key] = item.value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Optionally include shortDescription inside extractedData if you wish
      if (shortDescription.trim()) {
        extractedDataPayload.shortDescription = shortDescription;
      }

      if (documentId) {
        const payload = {
          title,
          documentCategory: category,
          extractedData: extractedDataPayload,
        };
        const result = await updateDocument({ id: documentId, body: payload }).unwrap();
        if (result.success) {
          setIsSaved(true);
        } else {
          console.error("Update failed:", result.message);
        }
      } else {
        const payload = {
          draftId,
          title,
          documentCategory: category,
          extractedData: extractedDataPayload,
        };

        const result = await confirmDocument(payload).unwrap();
        if (result.success) {
          if (result.data?._id) setDocumentId(result.data._id);
          setIsSaved(true);
        } else {
          console.error("Save failed:", result.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Error saving document");
      console.error("Error saving document:", error);
    }
  };

  const updateAdditionalData = (
    id: string,
    field: "key" | "value",
    text: string,
  ) => {
    setAdditionalData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: text } : item)),
    );
  };

  const removeAdditionalData = (id: string) => {
    setAdditionalData((prev) => prev.filter((item) => item.id !== id));
  };

  const addAdditionalData = () => {
    setAdditionalData((prev) => [
      ...prev,
      { id: Date.now().toString(), key: "", value: "" },
    ]);
  };

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
          {photo && JSON.parse(photo as string)?.path && (
            <Image
              source={{ uri: JSON.parse(photo as string).path }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>

      {/* Category Modal */}
      <Modal visible={isCategoryModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setIsCategoryModalOpen(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item);
                    setIsCategoryModalOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      category === item && styles.categoryItemSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
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

          {isUploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.main} />
              <Text style={styles.loadingText}>Analyzing Document...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                isSaved ? { paddingBottom: 120 } : { paddingBottom: 40 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* Document Preview Card */}
              <View style={styles.previewCard}>
                <View style={styles.imageContainer}>
                  {photo && JSON.parse(photo as string)?.path && (
                    <Image
                      source={{ uri: JSON.parse(photo as string).path }}
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
                  <View style={styles.fileIconBox}>
                    <FileText color="#f43f5e" size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {originalName || "Document.jpg"}
                    </Text>
                    <Text style={styles.fileMeta}>Added just now</Text>
                  </View>
                </View>
              </View>

              {/* Category Selector */}
              <Text style={styles.sectionLabel}>CATEGORY</Text>
              <TouchableOpacity
                style={[styles.categorySelector, isSaved && { opacity: 0.7 }]}
                onPress={() => !isSaved && setIsCategoryModalOpen(true)}
                disabled={isSaved}
              >
                <View style={styles.categoryIconBox}>
                  <Folder color={colors.main} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.categoryPlaceholder}>
                    {category || "Select Category"}
                  </Text>
                  <Text style={styles.categorySub}>
                    Choose where this belongs
                  </Text>
                </View>
                {!isSaved && <ChevronDown color={colors.mutedText} size={20} />}
              </TouchableOpacity>

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
                    style={[styles.inputField, isSaved && styles.disabledInput]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Document Title"
                    placeholderTextColor={colors.mutedText}
                    editable={!isSaved}
                  />
                </View>

                {/* Dynamic Extracted Data */}
                <Text style={[styles.sectionLabel, { marginTop: 15 }]}>
                  EXTRACTED DATA
                </Text>

                {additionalData.map((item) => (
                  <View key={item.id} style={styles.dynamicRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <TextInput
                        style={[
                          styles.dynamicKeyInput,
                          isSaved && { borderBottomColor: "transparent" },
                        ]}
                        value={item.key}
                        onChangeText={(val) =>
                          updateAdditionalData(item.id, "key", val)
                        }
                        placeholder="Key (e.g., dateOfBirth)"
                        placeholderTextColor={colors.mutedText}
                        editable={!isSaved}
                      />
                      <TextInput
                        style={styles.dynamicValueInput}
                        value={item.value}
                        onChangeText={(val) =>
                          updateAdditionalData(item.id, "value", val)
                        }
                        placeholder="Value"
                        placeholderTextColor={colors.mutedText}
                        editable={!isSaved}
                      />
                    </View>
                    {!isSaved && (
                      <TouchableOpacity
                        onPress={() => removeAdditionalData(item.id)}
                        style={styles.deleteIconBox}
                      >
                        <Trash2 color={colors.danger} size={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {!isSaved && (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={addAdditionalData}
                  >
                    <Plus color={colors.main} size={16} />
                    <Text style={styles.addBtnText}>Add Field</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Short Description Section */}
              <View style={styles.card}>
                <Text style={styles.optionalLabel}>
                  Short Description (Optional)
                </Text>
                <View
                  style={[
                    styles.smallTextAreaContainer,
                    isSaved && styles.disabledInput,
                  ]}
                >
                  <TextInput
                    placeholderTextColor={colors.mutedText}
                    style={styles.smallTextArea}
                    multiline
                    value={shortDescription}
                    onChangeText={setShortDescription}
                    placeholder="Enter a brief description..."
                    editable={!isSaved}
                  />
                </View>
              </View>

              {/* Reminder Card */}
              {!isUploading && isSaved && (
                <TouchableOpacity 
                  style={styles.reminderCard}
                  onPress={() => router.push({ pathname: "/(protected)/add-reminder", params: { documentId: documentId || "" } })}
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
              )}

              {/* Full Width Save Button */}
              {!isSaved && (
                <CustomButton
                  title={isConfirming || isUpdating ? "Saving..." : "Save Record"}
                  onPress={handleSave}
                  style={styles.saveBtn}
                  textStyle={styles.saveBtnText}
                />
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </BG>

      {/* Bottom Action Bar (Only visual after it is saved) */}
      {!isUploading && isSaved && (
        <View style={styles.bottomActions}>
          <ActionButton
            icon={<Edit2 color={colors.text} size={20} />}
            label="Edit"
            onPress={() => setIsSaved(false)}
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
            icon={<Trash2 color={colors.danger} size={20} />}
            label="Delete"
            isDelete
          />
        </View>
      )}
    </>
  );
}

const ActionButton = ({ icon, label, isDelete, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
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

  // Category Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryItemText: {
    color: colors.text,
    fontSize: 16,
  },
  categoryItemSelected: {
    color: colors.main,
    fontWeight: "bold",
  },

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
  deleteIconBox: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.main,
    backgroundColor: "rgba(254, 212, 76, 0.1)",
  },
  addBtnText: {
    color: colors.main,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },

  // Card general
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
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
  optionalLabel: { color: colors.mutedText, fontSize: 13, marginBottom: 12 },
  smallTextAreaContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    minHeight: 80,
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
    elevation: 1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

  // Buttons
  saveBtn: { marginTop: 10, marginBottom: 20 },
  saveBtnText: { color: colors.text, fontSize: 18, fontWeight: "bold" },

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
