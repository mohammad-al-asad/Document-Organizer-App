import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import DocumentScanner from "@/components/DocumentScanner";
import { colors } from "@/config/colors";
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
  Image,
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
        cropperActiveWidgetColor: colors.main,
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
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents & Notes</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Upload Assets Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Paperclip color={colors.main} size={20} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Upload Assets</Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsScanning(true)}
              style={[
                styles.dropzone,
                photo && { paddingVertical: 0, overflow: "hidden", borderWidth: 0, backgroundColor: "transparent" },
              ]}
            >
              {photo && photo.path ? (
                <Image
                  source={{ uri: photo.path }}
                  style={{ width: "100%", height: 200, borderRadius: 15 }}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <View style={styles.iconRow}>
                    <View style={styles.roundIconBox}>
                      <Camera color={colors.main} size={22} />
                    </View>
                    <View style={[styles.roundIconBox, { marginLeft: 15 }]}>
                      <CloudUpload color={colors.main} size={22} />
                    </View>
                  </View>
                  <Text style={styles.dropzoneText}>Tap to scan or upload</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Primary Action Buttons */}
            <TouchableOpacity
              style={styles.scanDocBtn}
              onPress={() => setIsScanning(true)}
            >
              <Scan color={colors.text} size={20} style={{ marginRight: 10 }} />
              <Text style={styles.scanDocText}>Scan Doc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadFileBtn}
              onPress={() => openGallery()}
            >
              <FileUp color={colors.text} size={20} style={{ marginRight: 10 }} />
              <Text style={styles.uploadFileText}>Upload File</Text>
            </TouchableOpacity>
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
            <CheckCircle color={colors.text} size={20} style={{ marginRight: 8 }} />
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
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  cancelText: { color: colors.mutedText, fontSize: 16 },

  scrollContent: { paddingBottom: 40, paddingTop: 10 },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
    elevation:1,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },

  dropzone: {
    borderWidth: 2,
    borderColor: colors.main,
    borderStyle: "dashed",
    borderRadius: 15,
    paddingVertical: 35,
    alignItems: "center",
    backgroundColor: "rgba(254, 212, 76, 0.15)",
    marginBottom: 20,
  },
  iconRow: { flexDirection: "row", marginBottom: 15 },
  roundIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(254, 212, 76, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(254, 212, 76, 0.4)",
  },
  dropzoneText: { color: colors.mutedText, fontSize: 14 },

  scanDocBtn: {
    backgroundColor: colors.main,
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  scanDocText: { color: colors.text, fontSize: 16, fontWeight: "bold" },

  uploadFileBtn: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadFileText: { color: colors.text, fontSize: 16, fontWeight: "600" },

  sectionLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textAreaContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: { color: colors.text, fontSize: 15, textAlignVertical: "top" },

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

  saveBtn: { marginTop: 10 },
  saveBtnText: { color: colors.text, fontSize: 18, fontWeight: "bold" },
});
