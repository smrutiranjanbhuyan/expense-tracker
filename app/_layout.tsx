import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function Rootlayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
