import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { colors } from "@/config/colors";
import { getErrorMessage } from "@/lib/api-error";
import { useUpdateProfileMutation } from "@/store/auth";
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Pencil,
  Search,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// ── Country list ────────────────────────────────────────────────────────────
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Azerbaijan", "Bahrain", "Bangladesh", "Belgium", "Bolivia", "Brazil",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba",
  "Czech Republic", "Denmark", "Ecuador", "Egypt", "Ethiopia", "Finland",
  "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Lebanon",
  "Libya", "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Thailand", "Tunisia", "Turkey", "UAE", "Uganda", "Ukraine",
  "United Kingdom", "United States", "Uzbekistan", "Venezuela", "Vietnam",
  "Yemen", "Zimbabwe",
].sort();

// ── Zod schema ──────────────────────────────────────────────────────────────
const editSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  country: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

// ── Helpers ─────────────────────────────────────────────────────────────────
function parseIsoDate(iso?: string) {
  if (!iso) return { year: "", month: "", day: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { year: "", month: "", day: "" };
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

function buildIsoDate(year: string, month: string, day: string) {
  if (!year || !month || !day) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// ── Component ───────────────────────────────────────────────────────────────
export default function EditProfile() {
  const user = useAppSelector((s) => s.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Country modal
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Date modal
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const initDate = parseIsoDate(user?.dateOfBirth as string | undefined);
  const [tempYear, setTempYear] = useState(initDate.year);
  const [tempMonth, setTempMonth] = useState(initDate.month);
  const [tempDay, setTempDay] = useState(initDate.day);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      dateOfBirth: initDate.year
        ? buildIsoDate(initDate.year, initDate.month, initDate.day)
        : "",
      country: (user as unknown as Record<string, string>)?.country ?? "",
    },
  });

  const currentCountry = watch("country");
  const currentDob = watch("dateOfBirth");

  // Format "YYYY-MM-DD" → "DD / MM / YYYY" for display
  function formatDobDisplay(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d} / ${m} / ${y}`;
  }

  async function onSubmit(values: EditFormValues) {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.dateOfBirth) formData.append("dateOfBirth", values.dateOfBirth);
    if (values.country) formData.append("country", values.country);

    try {
      await updateProfile(formData).unwrap();
      Alert.alert("Success", "Profile updated successfully.");
      router.replace("/(protected)/(tab)/profile");
    } catch (error) {
      Alert.alert("Update failed", getErrorMessage(error));
    }
  }

  // Filtered countries for the modal search
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  // DOB modal confirm
  function confirmDate() {
    const iso = buildIsoDate(tempYear, tempMonth, tempDay);
    setValue("dateOfBirth", iso, { shouldValidate: true });
    setDateModalOpen(false);
  }

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/(tab)/profile")}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=alex" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editBadge}>
                <Pencil color={colors.text} size={12} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Full Name ── */}
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.subtleText}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName.message}</Text>
                )}
              </View>
            )}
          />

          {/* ── Date of Birth ── */}
          <View style={[styles.inputGroup, { marginTop: 20 }]}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.inputRow, errors.dateOfBirth && styles.inputError]}
              onPress={() => {
                // seed picker with current value
                const p = parseIsoDate(currentDob);
                setTempYear(p.year || String(new Date().getFullYear() - 20));
                setTempMonth(p.month || "01");
                setTempDay(p.day || "01");
                setDateModalOpen(true);
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  !currentDob && { color: colors.subtleText },
                ]}
              >
                {currentDob ? formatDobDisplay(currentDob) : "DD / MM / YYYY"}
              </Text>
              <Calendar color={colors.main} size={20} />
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
            )}
          </View>

          {/* ── Country ── */}
          <View style={[styles.inputGroup, { marginTop: 20 }]}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => {
                setCountrySearch("");
                setCountryModalOpen(true);
              }}
            >
              <Text
                style={[
                  styles.inputText,
                  !currentCountry && { color: colors.subtleText },
                ]}
              >
                {currentCountry || "Select your country"}
              </Text>
              <ChevronDown color={colors.subtleText} size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Save Button */}
        <CustomButton
          title={isLoading ? "Saving..." : "Save Changes"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </SafeAreaView>

      {/* ═══════════════ Country Modal ═══════════════ */}
      <Modal
        visible={countryModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setCountryModalOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCountryModalOpen(false)}
        />
        <View style={styles.modalSheet}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setCountryModalOpen(false)}>
              <X color={colors.text} size={22} />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Search size={16} color={colors.subtleText} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor={colors.subtleText}
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoFocus
            />
          </View>

          {/* Country list */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => {
                  setValue("country", item, { shouldValidate: true });
                  setCountryModalOpen(false);
                }}
              >
                <Text style={styles.countryItemText}>{item}</Text>
                {currentCountry === item && (
                  <Check size={18} color={colors.main} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: colors.border }} />
            )}
          />
        </View>
      </Modal>

      {/* ═══════════════ Date of Birth Modal ═══════════════ */}
      <Modal
        visible={dateModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setDateModalOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setDateModalOpen(false)}
        />
        <View style={[styles.modalSheet, { paddingBottom: 24 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setDateModalOpen(false)}>
              <X color={colors.text} size={22} />
            </TouchableOpacity>
          </View>

          {/* Day / Month / Year text inputs */}
          <View style={styles.dateRow}>
            {/* Day */}
            <View style={styles.datePart}>
              <Text style={styles.datePartLabel}>Day</Text>
              <TextInput
                style={styles.dateInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor={colors.subtleText}
                value={tempDay}
                onChangeText={(v) =>
                  setTempDay(v.replace(/\D/g, "").slice(0, 2))
                }
              />
            </View>

            {/* Month */}
            <View style={styles.datePart}>
              <Text style={styles.datePartLabel}>Month</Text>
              <TextInput
                style={styles.dateInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={colors.subtleText}
                value={tempMonth}
                onChangeText={(v) =>
                  setTempMonth(v.replace(/\D/g, "").slice(0, 2))
                }
              />
            </View>

            {/* Year */}
            <View style={[styles.datePart, { flex: 1.4 }]}>
              <Text style={styles.datePartLabel}>Year</Text>
              <TextInput
                style={styles.dateInput}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="YYYY"
                placeholderTextColor={colors.subtleText}
                value={tempYear}
                onChangeText={(v) =>
                  setTempYear(v.replace(/\D/g, "").slice(0, 4))
                }
              />
            </View>
          </View>

          <CustomButton
            title="Confirm Date"
            onPress={confirmDate}
            style={{ marginTop: 20 }}
          />
        </View>
      </Modal>
    </BG>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },

  // Avatar
  avatarSection: { alignItems: "center", marginTop: 20, marginBottom: 36 },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(51,65,85,0.2)",
    padding: 4,
    position: "relative",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 50 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.main,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  // Form fields
  inputGroup: {},
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 20,
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  inputRow: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.danger },
  inputText: { color: colors.text, fontSize: 15 },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 6,
  },

  // Modal shared
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "75%",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  // Country picker
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  countryItemText: { color: colors.text, fontSize: 15 },

  // Date picker
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  datePart: { flex: 1 },
  datePartLabel: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  dateInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
});
