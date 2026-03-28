import { colors } from "@/config/colors";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";
import RenderHtml from "react-native-render-html";
import { BG } from "./BG";

interface InfoContentScreenProps {
  title: string;
  htmlContent?: string;
  isLoading?: boolean;
}

const InfoContentScreen: React.FC<InfoContentScreenProps> = ({
  title,
  htmlContent,
  isLoading,
}) => {
  const { width } = useWindowDimensions();

  return (
    <BG style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header - Consistent with previous screens */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/(tab)/profile")}
            style={styles.headerBtn}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerBtn} />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.main} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {htmlContent ? (
              <RenderHtml
                contentWidth={width - moderateScale(40)}
                source={{ html: htmlContent }}
                baseStyle={{ color: colors.text, fontSize: moderateScale(14), lineHeight: verticalScale(20) }}
                tagsStyles={{
                  h1: { color: colors.text },
                  h2: { color: colors.text },
                  h3: { color: colors.text },
                  h4: { color: colors.text },
                  h5: { color: colors.text },
                  h6: { color: colors.text },
                  p: { color: colors.text, marginBottom: verticalScale(10) },
                  li: { color: colors.text },
                  a: { color: colors.main },
                }}
              />
            ) : (
              <Text style={styles.contentText}>No content available.</Text>
            )}
          </ScrollView>
        )}
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
    paddingHorizontal: moderateScale(20),
    paddingVertical: 15,
  },
  headerBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  scrollContent: {
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: moderateScale(14),
    color: colors.text,
    lineHeight: verticalScale(20),
    textAlign: "left",
  },
});

export default InfoContentScreen;
