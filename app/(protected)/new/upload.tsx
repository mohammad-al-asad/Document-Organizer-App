import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import DocumentScanner from "@/components/DocumentScanner";
import { router } from "expo-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  CloudUpload,
  FileUp,
  Paperclip,
  Scan,
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
import ImagePicker from "react-native-image-crop-picker";

import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentsAndNotes() {
  const [isScanning, setIsScanning] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  const openGallery = async () => {
    // Ask permission first
    // if (status !== "granted") {
    //   alert("Permission to access gallery is required!");
    //   return;
    // }

    try {
      const result = await ImagePicker.openPicker({
        freeStyleCropEnabled: true,
        mediaType: "photo",
        cropping: true,
        cropperToolbarTitle: "Adjust Document",
        cropperToolbarColor: "#0f172a",
        cropperToolbarWidgetColor: "#ffffff",
        cropperActiveWidgetColor: "#14b8a6",
      });
      onSave(result);
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = (photo: any) => {
    setPhoto(photo);
    console.log("Photo Captured", photo);
    setIsScanning(false);
  };

  if (isScanning) {
    return (
      <DocumentScanner
        onClose={() => setIsScanning(false)}
        openGallery={openGallery}
        onSave={onSave}
      />
    );
  }
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents & Notes</Text>
          <TouchableOpacity>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Upload Assets Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Paperclip color="#14b8a6" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Upload Assets</Text>
            </View>

            {/* Dashed Dropzone */}
            <TouchableOpacity
              onPress={() => setIsScanning(true)}
              style={styles.dropzone}
            >
              <View style={styles.iconRow}>
                <View style={styles.roundIconBox}>
                  <Camera color="#14b8a6" size={22} />
                </View>
                <View style={[styles.roundIconBox, { marginLeft: 15 }]}>
                  <CloudUpload color="#14b8a6" size={22} />
                </View>
              </View>
              <Text style={styles.dropzoneText}>Tap to scan or upload</Text>
            </TouchableOpacity>

            {/* Primary Action Buttons */}
            <TouchableOpacity
              style={styles.scanDocBtn}
              onPress={() => setIsScanning(true)}
            >
              <Scan color="black" size={20} style={{ marginRight: 10 }} />
              <Text style={styles.scanDocText}>Scan Doc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadFileBtn}
              onPress={() => openGallery()}
            >
              <FileUp color="white" size={20} style={{ marginRight: 10 }} />
              <Text style={styles.uploadFileText}>Upload File</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Notes Section */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Additional Notes</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                placeholder="Add details about warranty, serial numbers, or condition..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={6}
                style={styles.textArea}
              />
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
        </ScrollView>
        {/* Save Button */}
        <CustomButton
          title="Save Record"
          onPress={() => {
            console.log(photo);
            router.push({
              pathname: "/(protected)/new/details",
              params: {
                photo: JSON.stringify(photo),
              },
            });
          }}
          style={styles.saveBtn}
          textStyle={styles.saveBtnText}
        >
          {/* Note: Your CustomButton might need adjustment to accept children for the icon */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckCircle color="#1e293b" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Save Record</Text>
          </View>
        </CustomButton>
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
  headerTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelText: { color: "#9ca3af", fontSize: 16 },

  scrollContent: { paddingBottom: 40, paddingTop: 10 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" },

  dropzone: {
    borderWidth: 2,
    borderColor: "#14b8a6",
    borderStyle: "dashed",
    borderRadius: 15,
    paddingVertical: 35,
    alignItems: "center",
    backgroundColor: "#0f172a",
    marginBottom: 20,
  },
  iconRow: { flexDirection: "row", marginBottom: 15 },
  roundIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(20, 184, 166, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.2)",
  },
  dropzoneText: { color: "#9ca3af", fontSize: 14 },

  scanDocBtn: {
    backgroundColor: "#14b8a6",
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  scanDocText: { color: "black", fontSize: 16, fontWeight: "bold" },

  uploadFileBtn: {
    backgroundColor: "#111827",
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  uploadFileText: { color: "white", fontSize: 16, fontWeight: "600" },

  sectionLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textAreaContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
  },
  textArea: { color: "white", fontSize: 15, textAlignVertical: "top" },

  optionalLabel: { color: "#9ca3af", fontSize: 13, marginBottom: 12 },
  smallTextAreaContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    height: 80,
    padding: 12,
  },
  smallTextArea: { color: "white", fontSize: 15 },

  saveBtn: { marginTop: 10 },
  saveBtnText: { color: "#1e293b", fontSize: 18, fontWeight: "bold" },
});
