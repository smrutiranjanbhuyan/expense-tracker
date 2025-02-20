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
    const [emailVerified, setEmailVerified] = useState(auth.currentUser?.emailVerified || false);
  
    // Handle verification button click
    const handleVerifyEmail = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Refresh user data
        const isVerified = auth.currentUser.emailVerified;
        setEmailVerified(isVerified);
  
        if (isVerified) {
          Alert.alert("✅ Verified", "Your email is already verified.");
        } else {
          await sendEmailVerification(auth.currentUser)
            .then(() => {
              Alert.alert("📩 Verification Sent", "Check your inbox.");
            })
            .catch((error) => {
              console.error("Error sending verification email:", error);
              Alert.alert("Error", error.message);
            });
        }
      }
    };
  
    // Define settings options
    const settingsOptions = [
      {
        title: "Verify Email",
        icon: emailVerified ? (
          <Icon.CheckCircle size={24} color={colors.white} />
        ) : (
          <Icon.EnvelopeSimple size={24} color={colors.white} />
        ),
        onPress: handleVerifyEmail,
        bgColor: emailVerified ? "#22c55e" : "#6366f1",
      },
      {
        title: "Forgot Password",
        icon: <Icon.LockKey size={24} color={colors.white} />,
        onPress: () => alert("Forgot Password clicked"),
        bgColor: "#059669",
      },
      {
        title: "Delete Account",
        icon: <Icon.Trash size={24} color={colors.white} />,
        onPress: () => alert("Delete Account clicked"),
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
      gap: spacingY._15,
      marginTop: spacingY._10,
    },
    listItem: {
      marginBottom: verticalScale(17),
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
  