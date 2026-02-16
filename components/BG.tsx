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
      // Dark teal to almost black
      colors={["#1E3A8A", "#0F5156", "#11211F"]}
      style={[styles.container, style]}
      // Diagonal start (Top-Left)
      start={{ x: 0, y: 0 }}
      // Diagonal end (Bottom-Right)
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: scale(20) },
});
