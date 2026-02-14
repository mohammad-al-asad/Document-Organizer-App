import SplashScreen from "@/components/Splash";
import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  const [isSplash, setIsSplash] = useState(true);
  if (isSplash) {
    return <SplashScreen onFinish={() => setIsSplash(false)} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
