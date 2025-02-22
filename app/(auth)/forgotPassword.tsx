import React, { useState, useCallback } from "react";
import { View, Alert, Pressable, StyleSheet } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { ScreenWrapper, Typo, Button, BackButton, Input } from "@/components";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleResetPassword = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "A password reset link has been sent to your email."
      );
      router.back();
    } catch (error: any) {
      // console.error("Password Reset Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, auth, router]);

  return (
    <ScreenWrapper>
      <View style={styles.backButtonContainer}>
        <BackButton iconSize={28} />
      </View>
      <View style={styles.container}>
        <Typo size={24} fontWeight="700">
          Forgot Password?
        </Typo>
        <Typo size={16} color={colors.textLight}>
          Enter your email to receive a reset link.
        </Typo>

        <Input
          placeholder="Enter your email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          icon={
            <Icons.At
              size={verticalScale(26)}
              color={colors.neutral300}
              weight="fill"
            />
          }
        />

        <Button
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={isLoading}
        >
          <Typo fontWeight="700" color={colors.black} size={18}>
            Reset Password
          </Typo>
        </Button>

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Typo size={14} color={colors.primary}>
            Back to Login
          </Typo>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._20,
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonContainer: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    alignSelf: "flex-start",
  },
});
