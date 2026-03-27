import { BG } from "@/components/BG";
import { CustomButton } from "@/components/CustomButton";
import { getErrorMessage } from "@/lib/api-error";
import { authenticateWithFaceLock } from "@/lib/face-lock";
import {
  clearSession,
  setFaceLockVerified,
  updateTokens,
  useRefreshSessionMutation,
} from "@/store/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router, Slot } from "expo-router";
import { ScanFace } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken, faceLockEnabled, faceLockVerified } =
    useAppSelector((state) => state.auth);
  const [refreshSession] = useRefreshSessionMutation();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const hasBootstrapped = useRef(false);
  const hasPrompted = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      if (hasBootstrapped.current) {
        return;
      }

      hasBootstrapped.current = true;

      if (refreshToken) {
        try {
          const tokens = await refreshSession().unwrap();

          if (isMounted) {
            dispatch(updateTokens(tokens));
          }
        } catch (error) {
          if (isMounted) {
            dispatch(clearSession());
            Alert.alert("Session expired", getErrorMessage(error));
          }
        }
      }

      if (isMounted) {
        setIsBootstrapping(false);
      }
    }

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, refreshSession, refreshToken]);

  useEffect(() => {
    if (!isBootstrapping && !accessToken) {
      router.replace("/(auth)");
    }
  }, [accessToken, isBootstrapping]);

  async function unlockWithFaceLock() {
    setIsUnlocking(true);

    const result = await authenticateWithFaceLock();

    setIsUnlocking(false);

    if (!result.success) {
      Alert.alert("Face Unlock", result.message);
      return;
    }

    dispatch(setFaceLockVerified(true));
  }

  useEffect(() => {
    if (
      accessToken &&
      faceLockEnabled &&
      !faceLockVerified &&
      !hasPrompted.current &&
      !isBootstrapping
    ) {
      hasPrompted.current = true;
      void unlockWithFaceLock();
    }
  }, [accessToken, faceLockEnabled, faceLockVerified, isBootstrapping]);

  if (isBootstrapping) {
    return (
      <BG>
        <SafeAreaView style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </BG>
    );
  }

  if (!accessToken) {
    return null;
  }

  if (faceLockEnabled && !faceLockVerified) {
    return (
      <BG>
        <SafeAreaView style={styles.lockedContainer}>
          <View style={styles.lockedCard}>
            <ScanFace size={44} style={styles.icon} />
            <Text style={styles.title}>Face Unlock Enabled</Text>
            <Text style={styles.subtitle}>
              Verify your face to open VaultLife.
            </Text>
            <CustomButton
              title={isUnlocking ? "Checking..." : "Unlock With Face Unlock"}
              onPress={() => void unlockWithFaceLock()}
              disabled={isUnlocking}
            />
            <Text
              style={styles.link}
              onPress={() => {
                dispatch(clearSession());
                router.replace("/(auth)");
              }}
            >
              Use password instead
            </Text>
          </View>
        </SafeAreaView>
      </BG>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
  },
  lockedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  link: {
    color: "#334155",
    fontWeight: "600",
    marginTop: 8,
  },
});
