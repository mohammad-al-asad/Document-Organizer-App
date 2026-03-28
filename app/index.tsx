import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import SplashScreen from "@/components/Splash";
import { colors } from "@/config/colors";
import { useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

const DATA = [
  {
    id: 1,
    title: "All Your Important Records. One Place.",
    desc: "Securely store wills, deeds, and critical assets in your personal digital vault.",
    image: require("@/assets/images/illustration1.png"), // Replace with your assets
  },
  {
    id: 2,
    title: "Scan. Store. Stay Reminded.",
    desc: "Capture documents and set reminders for you.",
    image: require("@/assets/images/illustration2.png"),
  },
  {
    id: 3,
    title: "Secure. Private. Always Accessible.",
    desc: "Bank-grade encryption for your most critical life documents.",
    image: require("@/assets/images/illustration3.png"),
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [isSplash, setIsSplash] = useState(true);
  const isLogged = useAppSelector((state) => Boolean(state.auth.accessToken));

  if (isSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          if (isLogged) {
            router.replace("/(auth)");
          } else {
            router.replace("/(auth)");
          }
          setIsSplash(false);
        }}
      />
    );
  }
  const nextStep = () => {
    if (step < DATA.length - 1) setStep(step + 1);
    else router.replace("/(auth)");
  };

  return (
    <BG>
      <SafeAreaView style={{ flex: 1 }}>
        <Text onPress={() => router.replace("/(auth)")} style={styles.skip}>
          Skip
        </Text>

        <View style={styles.content}>
          {/* Illustration Area */}
          <View style={styles.imagePlaceholder}>
            {/* Replace with your SVGs or Images */}
            <Image
              source={DATA[step].image}
              style={{ width: scale(350), height: scale(550) }}
              resizeMode="contain"
            />
          </View>

          {/* Custom Button */}
          <CustomButton
            title={step === 2 ? "Get Started" : "Continue"}
            onPress={nextStep}
          />

          {/* Dots Indicator */}
          <View style={styles.dotContainer}>
            {DATA.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, step === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </BG>
  );
}

const styles = StyleSheet.create({
  skip: { color: colors.mutedText, alignSelf: "flex-end", marginTop: 20 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagePlaceholder: { flex: 2, justifyContent: "center", zIndex: 100 },
  textContent: { flex: 1, alignItems: "center" },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    color: colors.mutedText,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
  },
  dotContainer: { flexDirection: "row", marginBottom: 40 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: colors.main, width: 20 },
});
