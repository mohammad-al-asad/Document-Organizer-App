import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import { useSendSupportReportMutation } from "@/store/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft, CheckCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// ── Schema ─────────────────────────────────────────────────────────────────
const supportSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(10, "Please describe your issue in more detail")
    .max(1000, "Description must be under 1000 characters"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

// ── Component ───────────────────────────────────────────────────────────────
export default function HelpSupport() {
  const [sendReport, { isLoading }] = useSendSupportReportMutation();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: { title: "", description: "" },
  });

  async function onSubmit(values: SupportFormValues) {
    try {
      await sendReport(values).unwrap();
      setSubmitted(true);
      reset();
    } catch (error) {
      Alert.alert("Submission failed", getErrorMessage(error));
    }
  }

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(protected)/(tab)/profile")}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help &amp; Support</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("@/assets/images/help-illustration.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.heroText}>Hello, how can we assist you?</Text>
            <Text style={styles.heroSub}>
              Describe your issue below and we&apos;ll get back to you shortly.
            </Text>
          </View>

          {/* Success Banner */}
          {submitted && (
            <View style={styles.successBanner}>
              <CheckCircle size={20} color="#16a34a" />
              <Text style={styles.successText}>
                Report submitted! We&apos;ll review it soon.
              </Text>
            </View>
          )}

          {/* Form */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* Title Field */}
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="Enter the title of your issue"
                    placeholderTextColor={colors.subtleText}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    returnKeyType="next"
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Description Field */}
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <View style={[styles.inputGroup, { marginTop: 16 }]}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      errors.description && styles.inputError,
                    ]}
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor={colors.subtleText}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>
                      {errors.description.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <CustomButton
              title={isLoading ? "Sending..." : "Send Report"}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={{ marginTop: 28 }}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 48 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },

  // Illustration
  illustrationContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 28,
  },
  illustration: { width: 260, height: 180, marginBottom: 16 },
  heroText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  heroSub: {
    color: colors.mutedText,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },

  // Success banner
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  successText: {
    color: "#15803d",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },

  // Form
  inputGroup: {},
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    height: 140,
    borderRadius: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});
