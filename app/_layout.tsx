import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import StatusBar from "@/components/StatusBar";
import { colors } from "@/constants/theme";
import { CurrencyProvider } from "@/contexts/currencyContext";
import Svg, { Path } from "react-native-svg";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://94b754d72c2b3fd87baf4cd4fc590305@o4508377155108864.ingest.us.sentry.io/4509778588270592',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
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
       <Stack.Screen
        name="(models)/searchModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
       <Stack.Screen
        name="(models)/privecyPolicyModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
       <Stack.Screen
        name="(models)/settingsModel"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      
    </Stack>
    
  );
};

export default Sentry.wrap(function Rootlayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
      <StatusBar backgroundColor={colors.neutral900} barStyle="light-content" />
      <StackLayout />
      </CurrencyProvider>
    </AuthProvider>
  );
});