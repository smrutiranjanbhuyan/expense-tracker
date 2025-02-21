import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import {ModelWrapper,Header,BackButton,Typo,Button} from '@/components'
import { useRouter } from "expo-router";

const PrivacyPolicyModal = () => {
  const router = useRouter();

  return (
    <ModelWrapper>
      <View style={styles.container}>
        <Header
          title="🔒 Privacy Policy"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Typo size={18} color={colors.primary} fontWeight="700">
            🛡️ Your Privacy Matters
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            We value your privacy and are committed to{" "}
            <Typo color={colors.white} fontWeight="600">protecting your personal data.</Typo> 
            This Privacy Policy outlines how we{" "}
            <Typo color={colors.white} fontWeight="600">collect, use, and safeguard</Typo> your information.
          </Typo>

          <Typo size={16} color={colors.primary} fontWeight="700" style={styles.sectionTitle}>
            📌 1. Information We Collect
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            We may collect{" "}
            <Typo color={colors.white} fontWeight="600">personal data</Typo> such as{" "}
            <Typo color={colors.white} fontWeight="600">name, email, and transaction history</Typo> 
            to enhance your experience.
          </Typo>

          <Typo size={16} color={colors.primary} fontWeight="700" style={styles.sectionTitle}>
            🚀 2. How We Use Your Data
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            Your data helps us improve the app by{" "}
            <Typo color={colors.white} fontWeight="600">tracking transactions</Typo> and{" "}
            <Typo color={colors.white} fontWeight="600">providing insights</Typo> tailored to you.
          </Typo>

          <Typo size={16} color={colors.primary} fontWeight="700" style={styles.sectionTitle}>
            🔐 3. Data Security
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            We implement{" "}
            <Typo color={colors.white} fontWeight="600">strong security measures</Typo> 
            to protect your data and prevent{" "}
            <Typo color={colors.white} fontWeight="600">unauthorized access</Typo>.
          </Typo>

          <Typo size={16} color={colors.primary} fontWeight="700" style={styles.sectionTitle}>
            📩 4. Contact Us
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            If you have{" "}
            <Typo color={colors.white} fontWeight="600">any questions</Typo>, reach out to our{" "}
            <Typo color={colors.white} fontWeight="600">support team</Typo> for assistance.
          </Typo>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={() => router.back()} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>✅ Accept & Continue</Typo>
        </Button>
      </View>
    </ModelWrapper>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  content: {
    gap: spacingY._15,
    paddingVertical: spacingY._15,
  },
  sectionTitle: {
    marginTop: spacingY._15,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacingY._20,
    borderTopColor: colors.neutral700,
    borderWidth: 1,
  },
});
