import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  ModelWrapper,
  Header,
  BackButton,
  Typo,
  Button,
  Input,
  ImageUpload,
} from "@/components";
import { WalletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletSercice";
import * as Icon from "phosphor-react-native";

const walletModel = () => {
  const router = useRouter();
  const { user } = useAuth();

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();
  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet.image,
      });
    }
  }, []);

  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  let onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }
    const data: WalletType = {
      name: name.trim(),
      image,
      uid: user?.uid,
      amount: 0,
      created: new Date(),
      totalIncome: 0,
      totalExpenses: 0,
    };

    if (oldWallet?.id) data.id = oldWallet.id;

    // console.log("Submitting data:", data);

    setLoading(true);

    const res = await createOrUpdateWallet(data);
    // console.log("Result:", res);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.message || "Failed to update wallet");
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.message || "Failed to delete wallet");
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Wallet",
      "Are you sure you want to delete this wallet? This action will remove all transactions related to this wallet.",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModelWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Edit Wallet" : "Add Wallet"}
          leftIcon={<BackButton />}
          style={{
            marginBottom: spacingY._10,
          }}
        />
        {/* {Form} */}

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              placeholder="Upload Image"
              file={wallet.image}
              onSelect={(file) =>
                setWallet({
                  ...wallet,
                  image: file,
                })
              }
              onClear={() =>
                setWallet({
                  ...wallet,
                  image: null,
                })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icon.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ModelWrapper>
  );
};

export default walletModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacingX._15,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
