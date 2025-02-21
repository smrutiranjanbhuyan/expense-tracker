import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import ModelWrapper from "@/components/ModelWrapper";
import Header from "@/components/Header";
import * as Icon from "phosphor-react-native";
import Typo from "@/components/Typo";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { auth } from "@/config/firebase";
import { sendEmailVerification } from "firebase/auth";

const SettingsModel = () => {
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(
    auth.currentUser?.emailVerified || false
  );

  const handleVerifyEmail = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const isVerified = auth.currentUser.emailVerified;
      setEmailVerified(isVerified);

      if (isVerified) {
        Alert.alert("✅ Verified", "Your account is already verified.");
      } else {
        await sendEmailVerification(auth.currentUser)
          .then(() => {
            Alert.alert(
              "Verification Email Sent",
              "We've just sent a verification link to your email. Please check your inbox (and spam folder) and follow the instructions to verify your account."
            );
            
          })
          .catch((error) => {
                 
            if (error.message.includes('Firebase: Error (auth/too-many-requests).')) {
              Alert.alert(
                "Too Many Requests",
                "You've made too many attempts. Please wait a few minutes before trying again."
              );
            } else{
              Alert.alert("Error", error.message || "An unknown error occurred.");
            }
         
          });
      }
    }
  };

  const deleteAccount = () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is currently signed in.");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            user
              .delete()
              .then(() => {
                Alert.alert(
                  "Account Deleted",
                  "Your account has been successfully deleted."
                );
              })
              .catch((error: any) => {
                if (error.code === "auth/requires-recent-login") {
                  Alert.alert(
                    "Reauthentication Required",
                    "Your login session is too old. Please reauthenticate and try again."
                  );
                } else {
                  Alert.alert(
                    "Error",
                    error.message || "An unknown error occurred while deleting your account."
                  );
                }
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Define settings options
  const settingsOptions = [
    {
      title: emailVerified ? "Account verified" : "Plese verify your account",
      icon: emailVerified ? (
        <Icon.CheckCircle size={24} color={colors.white} />
      ) : (
        <Icon.EnvelopeSimple size={24} color={colors.white} />
      ),
      onPress: handleVerifyEmail,
      bgColor: emailVerified ? "#22c55e" : "#6366f1",
    },
    {
      title: "Reset Password",
      icon: <Icon.LockKey size={24} color={colors.white} />,
      onPress: () => router.navigate("/(auth)/forgotPassword"),
      bgColor: "#059669",
    },
    {
      title: "Delete Account",
      icon: <Icon.Trash size={24} color={colors.white} />,
      onPress: deleteAccount,
      bgColor: "#e11d48",
    },
  ];

  return (
    <ModelWrapper>
      <View style={styles.container}>
        <Header
          title="⚙️ Settings"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.list}>
          {settingsOptions.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                  {item.title}
                </Typo>
                <Icon.CaretRight
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ModelWrapper>
  );
};

export default SettingsModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  list: {
    gap: spacingY._10,
    marginTop: spacingY._10,
  },
  listItem: {
    marginBottom: verticalScale(10),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingY._15,
    borderRadius: 14,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  iconContainer: {
    height: verticalScale(44),
    width: verticalScale(44),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    marginRight: spacingX._12,
  },
});
