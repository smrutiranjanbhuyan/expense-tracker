import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";

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
      <StackLayout />
    </AuthProvider>
  );
}
