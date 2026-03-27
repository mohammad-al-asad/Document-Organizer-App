import { colors } from "@/config/colors";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

export const BG = ({
  children,
  style,
  ...props
}: Partial<LinearGradientProps>) => {
  return (
    <LinearGradient
      {...props}
      colors={[colors.background, "#FFF8DD"]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: scale(15) },
});
