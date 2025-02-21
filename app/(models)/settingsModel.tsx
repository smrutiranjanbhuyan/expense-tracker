import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import {ModelWrapper,Header,BackButton,Typo,Button} from '@/components'
import * as Icon from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { auth } from "@/config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useCurrency } from "@/contexts/currencyContext"; 
import { currencyList } from "@/constants/data";

const SettingsModel = () => {
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(
    auth.currentUser?.emailVerified || false
  );

  // Get currency values from the CurrencyContext
  const { currency, setCurrency } = useCurrency();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            if (
              error.message.includes(
                "Firebase: Error (auth/too-many-requests)."
              )
            ) {
              Alert.alert(
                "Too Many Requests",
                "You've made too many attempts. Please wait a few minutes before trying again."
              );
            } else {
              Alert.alert(
                "Error",
                error.message || "An unknown error occurred."
              );
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
              .catch((error) => {
                if (error.code === "auth/requires-recent-login") {
                  Alert.alert(
                    "Reauthentication Required",
                    "Your login session is too old. Please reauthenticate and try again."
                  );
                } else {
                  Alert.alert(
                    "Error",
                    error.message ||
                      "An unknown error occurred while deleting your account."
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
      title: "Preferred Currency",
      icon: <Icon.CurrencyDollarSimple size={24} color={colors.white} />,
      onPress: () => setModalVisible(true),
      bgColor: "#6366f1",
    },
    {
      title: emailVerified ? "Account verified" : "Please verify your account",
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

  // Filter currencies based on search query
  const filteredCurrencies = currencyList.filter(({ code, symbol }) =>
    `${symbol} ${code}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              entering={FadeInDown.delay(index * 100)
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Typo size={18} fontWeight={"600"} style={styles.modalTitle}>
                    Select Currency
                  </Typo>

                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButtonIcon}
                  >
                    <Icon.X size={24} color={colors.white} />
                  </Pressable>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search currency..."
                  placeholderTextColor={colors.neutral500}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <ScrollView>
                  {filteredCurrencies.map(({ code, symbol }) => (
                    <Pressable
                      key={code}
                      style={styles.currencyOption}
                      onPress={() => {
                        setCurrency(code);
                        setModalVisible(false);
                      }}
                    >
                      <Typo size={16} fontWeight={"500"}>
                        {symbol} {code}
                      </Typo>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Typo size={16} fontWeight={"500"}>
                    Close
                  </Typo>
                </Pressable>
              </View>
            </View>
          </Modal>
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
  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: spacingY._10,
  },
  closeButtonIcon: {
    padding: spacingX._5,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: verticalScale(150),
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    padding: spacingY._20,
  },
  modalTitle: {
    marginBottom: spacingY._10,
  },
  searchInput: {
    height: 40,
    borderColor: colors.neutral700,
    borderWidth: 1,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._10,
    marginBottom: spacingY._10,
    color: colors.white,
  },
  currencyOption: {
    paddingVertical: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
  },
  closeButton: {
    marginTop: spacingY._10,
    paddingVertical: spacingY._10,
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
  },
});
