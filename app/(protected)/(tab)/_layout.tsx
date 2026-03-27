import { colors } from "@/config/colors";
import { router } from "expo-router";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { Bell, Folder, LayoutGrid, Plus, User } from "lucide-react-native";
import React, { Ref } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.tabsContainer}>
      <TabSlot />

      <TabList
        style={[
          styles.tabList,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ]}
      >
        <TabTrigger name="index" href="/(protected)/(tab)/(home)" asChild>
          <CustomTabTrigger label="Home" icon={LayoutGrid} />
        </TabTrigger>

        <TabTrigger name="files" href="/(protected)/(tab)/files" asChild>
          <CustomTabTrigger label="Files" icon={Folder} />
        </TabTrigger>

        {/* Floating Center Button */}
        {/* <TabTrigger name="new" href="/(protected)/new" asChild> */}
        <Pressable
          onPress={() => {
            router.push("/(protected)/new");
          }}
          style={styles.fabTrigger}
        >
          <View style={styles.fab}>
            <Plus color={colors.text} size={28} strokeWidth={2.5} />
          </View>
        </Pressable>
        {/* </TabTrigger> */}

        <TabTrigger name="alerts" href="/(protected)/(tab)/alerts" asChild>
          <CustomTabTrigger label="Alerts" icon={Bell} />
        </TabTrigger>

        <TabTrigger name="profile" href="/(protected)/(tab)/profile" asChild>
          <CustomTabTrigger label="Profile" icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

export type TabButtonProps = TabTriggerSlotProps & {
  icon: any;
  ref?: Ref<View>;
  label: string;
};

function CustomTabTrigger({
  icon: Icon,
  label,
  isFocused,
  ...props
}: TabButtonProps) {
  return (
    <Pressable {...props} style={styles.tabTrigger}>
      <Icon color={isFocused ? colors.main : colors.mutedText} size={24} />
      <Text style={[styles.label, isFocused && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
  },

  tabList: {
    flexDirection: "row",
    height: 70,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },

  tabTrigger: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  label: {
    fontSize: 11,
    color: colors.mutedText,
  },

  labelActive: {
    color: colors.text,
    fontWeight: "600",
  },

  /* Floating Action Button */

  fabTrigger: {
    alignSelf: "center",
    top: -20,
    zIndex: 20,
  },

  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.main,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});
