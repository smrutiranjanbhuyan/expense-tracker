import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import StatusBar  from "@/components/StatusBar";
import { colors } from "@/constants/theme";
const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen
    name="(models)/profileModel"
    options={
      {
        presentation :'modal',
         animation: 'slide_from_bottom',
      }
    }
    />
  </Stack>;
};

export default function Rootlayout() {
  return (
    <AuthProvider>
      <StatusBar  backgroundColor={colors.neutral900} barStyle="light-content" />
      <StackLayout />
    </AuthProvider>
  );
}
