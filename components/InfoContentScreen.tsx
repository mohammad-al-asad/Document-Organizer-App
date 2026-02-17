import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { BG } from "./BG";

interface InfoContentScreenProps {
  title: string;
  data: string[];
}

const InfoContentScreen: React.FC<InfoContentScreenProps> = ({
  title,
  data,
}) => {
  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - Consistent with previous screens */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {/* Number Column - White text for dark mode */}
              <Text style={styles.numberText}>{index + 1}.</Text>

              {/* Text Column - White text for dark mode */}
              <Text style={styles.contentText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </BG>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerBtn: { width: 40, alignItems: "center" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  scrollContent: {
    paddingVertical: moderateScale(20),
    paddingTop: verticalScale(10),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: verticalScale(20),
  },
  numberText: {
    fontSize: moderateScale(14),
    color: "white", // Changed from #000 to white
    fontWeight: "500",
    marginRight: moderateScale(8),
    width: moderateScale(20),
  },
  contentText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "white", // Changed from #000 to white
    lineHeight: verticalScale(20),
    textAlign: "left", // Design shows standard left alignment
  },
});

export default InfoContentScreen;
