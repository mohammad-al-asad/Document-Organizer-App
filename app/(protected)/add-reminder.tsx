import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { Skeleton } from "@/components/Skeleton";
import { colors } from "@/config/colors";
import { useGetDocumentsQuery, useGetDocumentByIdQuery } from "@/store/document";
import {
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useGetRemindersQuery,
} from "@/store/reminder";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  Search,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { getCategoryIcon } from "./(tab)/files";

// ── Define Form Schema ──────────────────────────────────────────────────────
const reminderSchema = z.object({
  documentId: z.string().min(1, "Please select a document"),
  remindAt: z.string().min(1, "Please select a date and time"),
  title: z.string().min(2, "Title is required"),
  message: z.string().min(1, "Message is required"),
  recurrence: z.string(),
  notificationChannels: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

export default function AddReminder() {
  const { id, documentId: propDocId } = useLocalSearchParams<{
    id: string;
    documentId?: string;
  }>();
  const isEditing = !!id;
  console.log("Is Editing",isEditing);
  console.log("Reminder ID",id);
  

  const [createReminder, { isLoading: isCreating }] =
    useCreateReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] =
    useUpdateReminderMutation();

  const { data: remindersResponse, isLoading: remindersLoading } =
    useGetRemindersQuery("all", { skip: !isEditing });

  const { data: docsResponse, isLoading: docsLoading } = useGetDocumentsQuery(
    {},
  );

  const reminderToEdit = React.useMemo(() => {
    if (!isEditing || !remindersResponse?.data) return null;
    return remindersResponse.data.find((r) => r._id === id);
  }, [id, isEditing, remindersResponse]);

  console.log("Found Reminder to Edit:", reminderToEdit);

  const isSaving = isCreating || isUpdating;
  const reminderLoading = remindersLoading;
  const documents = docsResponse?.data || [];

  const keyboard = useAnimatedKeyboard();
  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    marginBottom: keyboard.height.value,
  }));

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      documentId: "",
      remindAt: "",
      title: "",
      message: "Your document needs attention.",
      recurrence: "none",
      notificationChannels: { email: true, push: true },
    },
  });

  // Pre-fill form when editing
  React.useEffect(() => {
    if (isEditing && reminderToEdit) {
      const r = reminderToEdit;
      console.log("Pre-filling reminder data:", r);

      const docId =
        typeof r.documentId === "string"
          ? r.documentId
          : (r.documentId as any)?._id;

      reset({
        documentId: docId || "",
        remindAt: r.remindAt || "",
        title: r.title || "",
        message: r.message || "",
        recurrence: r.recurrence || "none",
        notificationChannels: {
          email: !!r.notificationChannels?.email,
          push: !!r.notificationChannels?.push,
        },
      });

      // Also sync temp states for pickers
      if (r.remindAt) {
        const d = new Date(r.remindAt);
        setTempDate({
          day: d.getDate().toString().padStart(2, "0"),
          month: (d.getMonth() + 1).toString().padStart(2, "0"),
          year: d.getFullYear().toString(),
        });

        let hh = d.getHours();
        const mm = d.getMinutes().toString().padStart(2, "0");
        const p = hh >= 12 ? "PM" : "AM";
        hh = hh % 12 || 12;
        setTempTime({
          hour: hh.toString().padStart(2, "0"),
          minute: mm,
          period: p,
        });
      }
    }
  }, [isEditing, reminderToEdit, reset]);

  // Pre-fill documentId for NEW reminders if passed as param
  React.useEffect(() => {
    if (!isEditing && propDocId) {
      setValue("documentId", propDocId, { shouldValidate: true });
    }
  }, [isEditing, propDocId, setValue]);

  const selectedDocId = watch("documentId");
  const { data: specificDocResponse } = useGetDocumentByIdQuery(selectedDocId, { 
    skip: !selectedDocId 
  });
  
  const selectedDoc = specificDocResponse?.data || documents.find((d) => d._id === selectedDocId);
  const selectedRemindAt = watch("remindAt");
  const notificationChannels = watch("notificationChannels");
  const recurrenceValue = watch("recurrence");

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  // Custom date parts
  const [tempDate, setTempDate] = useState({
    day: new Date().getDate().toString().padStart(2, "0"),
    month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    year: new Date().getFullYear().toString(),
  });
  const [tempTime, setTempTime] = useState({
    hour: "09",
    minute: "00",
    period: "AM",
  });

  // Animated shared values
  const docAnim = useSharedValue(0);
  const dateAnim = useSharedValue(0);
  const timeAnim = useSharedValue(0);

  // Sync shared values with local state
  React.useEffect(() => {
    docAnim.value = withTiming(docModalOpen ? 1 : 0, { duration: 300 });
  }, [docModalOpen]);

  React.useEffect(() => {
    dateAnim.value = withTiming(dateModalOpen ? 1 : 0, { duration: 300 });
  }, [dateModalOpen]);

  React.useEffect(() => {
    timeAnim.value = withTiming(timeModalOpen ? 1 : 0, { duration: 300 });
  }, [timeModalOpen]);

  const createAnimatedModalStyle = (animValue: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: animValue.value,
      transform: [
        { translateY: (1 - animValue.value) * 100 },
        { scale: 0.95 + animValue.value * 0.05 },
      ],
    }));
  };

  const createBackdropStyle = (animValue: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: animValue.value,
    }));
  };

  const docModalStyle = createAnimatedModalStyle(docAnim);
  const dateModalStyle = createAnimatedModalStyle(dateAnim);
  const timeModalStyle = createAnimatedModalStyle(timeAnim);

  const docBackdropStyle = createBackdropStyle(docAnim);
  const dateBackdropStyle = createBackdropStyle(dateAnim);
  const timeBackdropStyle = createBackdropStyle(timeAnim);

  const filteredDocs = documents.filter((d) =>
    (d.title || d.originalName || "")
      .toLowerCase()
      .includes(docSearch.toLowerCase()),
  );

  const onSave = async (values: ReminderFormValues) => {
    try {
      if (isEditing) {
        await updateReminder({ id: id!, body: values }).unwrap();
        Alert.alert("Success", "Reminder updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createReminder(values).unwrap();
        Alert.alert("Success", "Reminder created successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} reminder`,
      );
    }
  };

  const confirmDate = () => {
    const { year, month, day } = tempDate;
    if (!year || !month || !day) return;
    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const currentTime = selectedRemindAt
      ? selectedRemindAt.split("T")[1]
      : "09:00:00.000Z";
    setValue("remindAt", `${dateStr}T${currentTime}`, { shouldValidate: true });
    setDateModalOpen(false);
    Keyboard.dismiss();
  };

  const confirmTime = () => {
    let hh = parseInt(tempTime.hour);
    if (tempTime.period === "PM" && hh < 12) hh += 12;
    if (tempTime.period === "AM" && hh === 12) hh = 0;
    const hhStr = hh.toString().padStart(2, "0");
    const mmStr = tempTime.minute.padStart(2, "0");

    const currentDate = selectedRemindAt
      ? selectedRemindAt.split("T")[0]
      : new Date().toISOString().split("T")[0];
    setValue("remindAt", `${currentDate}T${hhStr}:${mmStr}:00.000Z`, {
      shouldValidate: true,
    });
    setTimeModalOpen(false);
    Keyboard.dismiss();
  };

  const formatDateLabel = (iso: string) => {
    if (!iso) return "Select Date";
    const [datePart] = iso.split("T");
    const [y, m, d] = datePart.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[parseInt(m) - 1]} ${d}, ${y}`;
  };

  const formatTimeLabel = (iso: string) => {
    if (!iso) return "Select Time";
    const timePart = iso.split("T")[1];
    if (!timePart) return "09:00 AM";
    let [hh, mm] = timePart.split(":");
    let h = parseInt(hh);
    const m = mm;
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${m} ${p}`;
  };

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/(tab)/alerts")}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Reminder" : "Add Reminder"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {reminderLoading && isEditing ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Skeleton width={100} height={14} style={{ marginBottom: 10 }} />
            <Skeleton
              height={56}
              borderRadius={16}
              style={{ marginBottom: 25 }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 25,
              }}
            >
              <View style={{ width: "48%" }}>
                <Skeleton
                  width="60%"
                  height={12}
                  style={{ marginBottom: 10 }}
                />
                <Skeleton height={56} borderRadius={16} />
              </View>
              <View style={{ width: "48%" }}>
                <Skeleton
                  width="60%"
                  height={12}
                  style={{ marginBottom: 10 }}
                />
                <Skeleton height={56} borderRadius={16} />
              </View>
            </View>

            <Skeleton width={100} height={14} style={{ marginBottom: 10 }} />
            <Skeleton
              height={56}
              borderRadius={16}
              style={{ marginBottom: 25 }}
            />

            <Skeleton width={100} height={14} style={{ marginBottom: 10 }} />
            <Skeleton
              height={100}
              borderRadius={16}
              style={{ marginBottom: 25 }}
            />

            <Skeleton width={120} height={14} style={{ marginBottom: 15 }} />
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width={70} height={36} borderRadius={18} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Linked Record Dropdown */}
            <Text style={styles.label}>LINKED RECORD</Text>
            <TouchableOpacity
              style={[styles.dropdown, errors.documentId && styles.inputError]}
              onPress={() => setDocModalOpen(true)}
            >
              {selectedDoc ? (
                <>
                  {getCategoryIcon(
                    selectedDoc.documentCategory,
                    20,
                    colors.main,
                  )}
                  <Text style={styles.dropdownText}>
                    {selectedDoc.title || selectedDoc.originalName}
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.dropdownText, { color: colors.subtleText }]}
                >
                  Select a document
                </Text>
              )}
              <ChevronDown color={colors.mutedText} size={20} />
            </TouchableOpacity>
            {errors.documentId && (
              <Text style={styles.errorText}>{errors.documentId.message}</Text>
            )}

            {/* Reminder Title */}
            <Text style={styles.label}>REMINDER TITLE</Text>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.title && styles.inputError,
                  ]}
                >
                  <TextInput
                    placeholder="Renew Policy"
                    placeholderTextColor={colors.subtleText}
                    style={styles.textInput}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title.message}</Text>
            )}

            {/* Reminder Message */}
            <Text style={styles.label}>MESSAGE</Text>
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.message && styles.inputError,
                  ]}
                >
                  <TextInput
                    placeholder="Your document expires soon"
                    placeholderTextColor={colors.subtleText}
                    style={styles.textInput}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
            {errors.message && (
              <Text style={styles.errorText}>{errors.message.message}</Text>
            )}

            {/* Date & Time Row */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>DATE</Text>
                <TouchableOpacity
                  style={[
                    styles.dateTimeField,
                    errors.remindAt && styles.inputError,
                  ]}
                  onPress={() => setDateModalOpen(true)}
                >
                  <Calendar color={colors.subtleText} size={18} />
                  <Text style={styles.dateTimeText}>
                    {formatDateLabel(selectedRemindAt)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>TIME</Text>
                <TouchableOpacity
                  style={[
                    styles.dateTimeField,
                    errors.remindAt && styles.inputError,
                  ]}
                  onPress={() => setTimeModalOpen(true)}
                >
                  <Clock color={colors.subtleText} size={18} />
                  <Text style={styles.dateTimeText}>
                    {formatTimeLabel(selectedRemindAt)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.remindAt && (
              <Text style={styles.errorText}>{errors.remindAt.message}</Text>
            )}

            {/* Repeat Segmented Control */}
            <Text style={styles.label}>REPEAT</Text>
            <View style={styles.segmentedControl}>
              {["none", "monthly", "yearly"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() =>
                    setValue("recurrence", option, { shouldValidate: true })
                  }
                  style={[
                    styles.segmentItem,
                    recurrenceValue === option && styles.segmentActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      recurrenceValue === option && styles.segmentTextActive,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notification Type Section */}
            <Text style={styles.label}>NOTIFICATION CHANNEL</Text>

            <TouchableOpacity
              style={[
                styles.notifCard,
                notificationChannels?.push && styles.notifCardActive,
              ]}
              onPress={() =>
                setValue(
                  "notificationChannels.push",
                  !notificationChannels?.push,
                  { shouldValidate: true },
                )
              }
            >
              <View style={styles.notifIconBox}>
                <Bell
                  color={
                    notificationChannels?.push ? colors.main : colors.subtleText
                  }
                  size={20}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.notifTitle}>Push Notification</Text>
                <Text style={styles.notifSub}>Instant alert on device</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  notificationChannels?.push && styles.radioActive,
                ]}
              >
                {notificationChannels?.push && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.notifCard,
                notificationChannels?.email && styles.notifCardActive,
              ]}
              onPress={() =>
                setValue(
                  "notificationChannels.email",
                  !notificationChannels?.email,
                  { shouldValidate: true },
                )
              }
            >
              <View style={styles.notifIconBox}>
                <Mail
                  color={
                    notificationChannels?.email
                      ? colors.main
                      : colors.subtleText
                  }
                  size={20}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.notifTitle}>Email Reminder</Text>
                <Text style={styles.notifSub}>Sent to registered email</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  notificationChannels?.email && styles.radioActive,
                ]}
              >
                {notificationChannels?.email && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
          onPress={isSaving ? undefined : handleSubmit(onSave)}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.text} size="small" />
          ) : (
            <>
              <CheckCircle2 color={colors.text} size={24} />
              <Text style={styles.saveBtnText}>
                {isEditing ? "Update Reminder" : "Save Reminder"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Document Picker Overlay ── */}
      {docModalOpen && (
        <Animated.View
          style={[styles.modalBackdrop, docBackdropStyle]}
          pointerEvents="auto"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDocModalOpen(false)}
          />
          <Animated.View
            style={[styles.modalSheet, animatedKeyboardStyle, docModalStyle]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Linked Record</Text>
              <TouchableOpacity onPress={() => setDocModalOpen(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchBar}>
              <Search size={18} color={colors.subtleText} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search documents..."
                placeholderTextColor={colors.subtleText}
                value={docSearch}
                onChangeText={setDocSearch}
              />
            </View>
            {docsLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.main}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={filteredDocs}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.docItem}
                    onPress={() => {
                      setValue("documentId", item._id, {
                        shouldValidate: true,
                      });
                      setDocModalOpen(false);
                      Keyboard.dismiss();
                    }}
                  >
                    {getCategoryIcon(item.documentCategory, 24)}
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.docItemTitle}>
                        {item.title || item.originalName}
                      </Text>
                      <Text style={styles.docItemSub}>
                        {item.documentCategory}
                      </Text>
                    </View>
                    {selectedDocId === item._id && (
                      <Check size={20} color={colors.main} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </Animated.View>
        </Animated.View>
      )}

      {/* ── Date Picker Overlay ── */}
      {dateModalOpen && (
        <Animated.View
          style={[styles.modalBackdrop, dateBackdropStyle]}
          pointerEvents="auto"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDateModalOpen(false)}
          />
          <Animated.View
            style={[styles.modalSheet, animatedKeyboardStyle, dateModalStyle]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => {
                  setDateModalOpen(false);
                  Keyboard.dismiss();
                }}
              >
                <X color={colors.text} size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateRow}>
              <View style={styles.datePart}>
                <Text style={styles.datePartLabel}>Day</Text>
                <TextInput
                  style={styles.dateInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                  placeholderTextColor={colors.subtleText}
                  value={tempDate.day}
                  onChangeText={(v) =>
                    setTempDate({
                      ...tempDate,
                      day: v.replace(/\D/g, "").slice(0, 2),
                    })
                  }
                />
              </View>
              <View style={styles.datePart}>
                <Text style={styles.datePartLabel}>Month</Text>
                <TextInput
                  style={styles.dateInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor={colors.subtleText}
                  value={tempDate.month}
                  onChangeText={(v) =>
                    setTempDate({
                      ...tempDate,
                      month: v.replace(/\D/g, "").slice(0, 2),
                    })
                  }
                />
              </View>
              <View style={[styles.datePart, { flex: 1.5 }]}>
                <Text style={styles.datePartLabel}>Year</Text>
                <TextInput
                  style={styles.dateInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="YYYY"
                  placeholderTextColor={colors.subtleText}
                  value={tempDate.year}
                  onChangeText={(v) =>
                    setTempDate({
                      ...tempDate,
                      year: v.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                />
              </View>
            </View>
            <CustomButton
              title="Confirm Date"
              onPress={confirmDate}
              style={{ marginTop: 20 }}
            />
          </Animated.View>
        </Animated.View>
      )}

      {/* ── Time Picker Overlay ── */}
      {timeModalOpen && (
        <Animated.View
          style={[styles.modalBackdrop, timeBackdropStyle]}
          pointerEvents="auto"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setTimeModalOpen(false)}
          />
          <Animated.View
            style={[styles.modalSheet, animatedKeyboardStyle, timeModalStyle]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity
                onPress={() => {
                  setTimeModalOpen(false);
                  Keyboard.dismiss();
                }}
              >
                <X color={colors.text} size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateRow}>
              <View style={styles.datePart}>
                <Text style={styles.datePartLabel}>Hour</Text>
                <TextInput
                  style={styles.dateInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="HH"
                  placeholderTextColor={colors.subtleText}
                  value={tempTime.hour}
                  onChangeText={(v) =>
                    setTempTime({
                      ...tempTime,
                      hour: v.replace(/\D/g, "").slice(0, 2),
                    })
                  }
                />
              </View>
              <View style={styles.datePart}>
                <Text style={styles.datePartLabel}>Minute</Text>
                <TextInput
                  style={styles.dateInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor={colors.subtleText}
                  value={tempTime.minute}
                  onChangeText={(v) =>
                    setTempTime({
                      ...tempTime,
                      minute: v.replace(/\D/g, "").slice(0, 2),
                    })
                  }
                />
              </View>
              <View style={styles.datePart}>
                <Text style={styles.datePartLabel}>Period</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() =>
                    setTempTime({
                      ...tempTime,
                      period: tempTime.period === "AM" ? "PM" : "AM",
                    })
                  }
                >
                  <Text style={[styles.dateTimeText, { marginLeft: 0 }]}>
                    {tempTime.period}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <CustomButton
              title="Confirm Time"
              onPress={confirmTime}
              style={{ marginTop: 20 }}
            />
          </Animated.View>
        </Animated.View>
      )}
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
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "bold" },
  cancelText: { color: colors.mutedText, fontSize: 16 },

  scrollContent: { paddingBottom: 40 },
  label: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 0.5,
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dropdownText: {
    color: colors.text,
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
  },

  inputWrapper: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  textInput: { color: colors.text, fontSize: 16, height: "100%" },

  row: { flexDirection: "row", justifyContent: "space-between" },
  dateTimeField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateTimeText: {
    color: colors.text,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentActive: { backgroundColor: colors.main },
  segmentText: { color: colors.mutedText, fontWeight: "600" },
  segmentTextActive: { color: colors.text },

  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  notifCardActive: {
    borderColor: colors.main,
    backgroundColor: "rgba(254, 212, 76, 0.1)",
  },
  notifIconBox: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(254, 212, 76, 0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notifTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  notifSub: { color: colors.mutedText, fontSize: 12, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.subtleText,
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: colors.main },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.main,
  },

  saveBtn: {
    backgroundColor: colors.main,
    marginBottom: 20,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  inputError: { borderColor: colors.danger },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 5,
    marginLeft: 5,
  },

  // Overlay / Drawer Drawers
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "85%",
    width: "100%",
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
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: colors.text },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: 10, color: colors.text, height: "100%" },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  docItemTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  docItemSub: { color: colors.mutedText, fontSize: 12 },

  // Date/Time specifically
  dateRow: { flexDirection: "row", gap: 15, marginBottom: 10 },
  datePart: { flex: 1 },
  datePartLabel: {
    color: colors.mutedText,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  dateInput: {
    backgroundColor: colors.surface,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
