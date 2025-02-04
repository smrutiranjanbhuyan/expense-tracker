import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import StatusBar from "@/components/StatusBar";
import { colors } from "@/constants/theme";
const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right",
        gestureEnabled: true,
        animationTypeForReplace: "pop",
      }}
    >
      <Stack.Screen
        name="(models)/profileModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="(models)/walletModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
       <Stack.Screen
        name="(models)/transactionModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
    
  );
};

export default function Rootlayout() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.neutral900} barStyle="light-content" />
      <StackLayout />
    </AuthProvider>
  );
}
