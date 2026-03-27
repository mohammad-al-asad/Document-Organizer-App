import { BG } from "@/components/BG"; // Your diagonal gradient
import { colors } from "@/config/colors";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const animatedWidth = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500); // Transition after a small delay
          return 100;
        }
        return prev + 1;
      });
    }, 10); // Speed of the loader

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate the bar width smoothly
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false, // Width doesn't support native driver
    }).start();
  }, [progress]);

  return (
    <BG>
      <SafeAreaView style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            style={{ height: "90%", width: "100%" }}
            source={require("@/assets/images/splash.png")}
          />
        </View>

        {/* Progress Section */}
        <View style={styles.loaderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.loaderLabel}>AUTHENTICATING</Text>
            <Text style={styles.loaderLabel}>{progress}%</Text>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: animatedWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          <View
            style={{
              marginTop: verticalScale(20),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <EvilIcons name="lock" size={20} color={colors.mutedText} />
            <Text style={styles.encryptionText}>END-TO-END ENCRYPTED</Text>
          </View>
        </View>
      </SafeAreaView>
    </BG>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingVertical: 60 },
  logoContainer: { alignItems: "center" },
  loaderContainer: { paddingHorizontal: scale(10), marginBottom: 40 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  loaderLabel: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.main,
    borderRadius: 2,
  },
  encryptionText: {
    color: colors.mutedText,
    fontSize: 10,
    textAlign: "center",
    fontWeight: "700",
  },
});
