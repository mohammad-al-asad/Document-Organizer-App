import { colors } from "@/config/colors";
import { CameraView, FlashMode } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import {
  CreditCard,
  ReceiptText,
  Scan,
  Zap,
  ZapOff,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { scale, verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const MODES = [
  { label: "Scan", icon: Scan },
  { label: "ID Card", icon: CreditCard },
  { label: "Receipt", icon: ReceiptText },
];

export default function DocumentScanner({ onClose, onSave, openGallery }: any) {
  const [flash, setFlash] = useState<FlashMode>("off");
  const [mode, setMode] = useState("Scan");
  const [isAuto, setIsAuto] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const getGuideSize = () => {
    switch (mode) {
      case "ID Card":
        return {
          width: width * 0.9,
          height: width * 0.9 * 0.63,
        };
      case "Receipt":
        return {
          width: width * 0.75,
          height: height * 0.65,
        };
      default:
        return {
          width: width * 0.85,
          height: height * 0.55,
        };
    }
  };

  const guideSize = getGuideSize();

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const data = await cameraRef.current.takePictureAsync({
      quality: 1,
      skipProcessing: true,
    });

    ImagePicker.openCropper({
      path: data.uri,
      freeStyleCropEnabled: true,
      mediaType: "photo",
      cropping: true,
      cropperToolbarTitle: "Adjust Document",
      cropperToolbarColor: "#0f172a",
      cropperToolbarWidgetColor: "#ffffff",
      cropperActiveWidgetColor: colors.main,
    }).then((image) => {
      onSave(image);
    });
  };

  const handleAutoCapture = async () => {
    if (!isAuto) return;
    setTimeout(() => {
      takePicture();
    }, 1200);
  };

  // ================= CAMERA =================
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        flash={flash}
        ref={cameraRef}
        onCameraReady={handleAutoCapture}
      >
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFlash(flash === "off" ? "on" : "off")}
            >
              {flash === "on" ? (
                <Zap color={colors.main} size={24} />
              ) : (
                <ZapOff color="white" size={24} />
              )}
            </TouchableOpacity>
          </View>

          {/* Guide Frame */}
          <View style={styles.guideContainer}>
            <View style={[styles.scannerFrame, guideSize]}>
              <View style={styles.alignBadge}>
                <Text style={styles.alignText}>ALIGN DOCUMENT</Text>
              </View>
            </View>
          </View>

          {/* Bottom Gradient Area */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "#0f172a"]}
            locations={[0, 0.5, 1]}
            style={styles.bottomGradient}
          >
            {/* Shutter Row */}
            <View style={styles.shutter}>
              <TouchableOpacity onPress={openGallery}>
                <Image
                  style={styles.historyBtn}
                  source={require("@/assets/images/icon.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={takePicture} style={styles.shutterBtn}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.autoBtn,
                  isAuto && { backgroundColor: colors.main },
                ]}
                onPress={() => setIsAuto(!isAuto)}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>AUTO</Text>
              </TouchableOpacity>
            </View>

            {/* Mode Selector */}
            <View style={styles.modeSelector}>
              {MODES.map(({ label, icon: Icon }) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => setMode(label)}
                  style={styles.modeItem}
                >
                  <Icon
                    size={22}
                    color={mode === label ? colors.main : "#94a3b8"}
                  />
                  <Text
                    style={[
                      styles.modeLabel,
                      mode === label && styles.modeActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  cancelText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  guideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scannerFrame: {
    width: width * 0.85,
    height: height * 0.55,
    borderWidth: 2,
    borderBottomColor: colors.main,
    borderTopColor: colors.main,
    backgroundColor: "rgba(254, 212, 76, 0.15)",
    borderColor: "rgba(254, 212, 76, 0.3)",
    borderRadius: 12,
    alignItems: "center",
  },

  alignBadge: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 15,
  },

  alignText: {
    color: colors.main,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bottomGradient: {
    paddingTop: 30,
    paddingBottom: 20,
  },

  shutter: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },

  historyBtn: {
    height: scale(50),
    width: scale(50),
    borderRadius: 25,
  },

  autoBtn: {
    height: scale(50),
    width: scale(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#1e293b",
  },

  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.main,
    justifyContent: "center",
    alignItems: "center",
  },

  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "white",
  },

  modeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  modeItem: {
    alignItems: "center",
    gap: 4,
  },

  modeLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },

  modeActive: {
    color: colors.main,
  },

  previewImage: {
    width: scale(320),
    height: verticalScale(380),
  },

  bottomActions: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
  },

  actionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
