import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {ScreenWrapper,Typo,Loading,WalletListItem} from '@/components'
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import { WalletType } from "@/types";
import { useCurrency } from "@/contexts/currencyContext";

const Wallet = () => {
  const { user } = useAuth();
    const { currencySymbol } = useCurrency();
  
  const {
    data: wallets,
    loading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  // console.log("Wallets:", wallets.length);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.black);
    }, [])
  );

  const router = useRouter();

  const getTotalBalance = () =>
    wallets.reduce((acc, item) => {
      return acc + (item.amount || 0);
    }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* {Balance view} */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              {currencySymbol}{getTotalBalance()}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total balance
            </Typo>
          </View>
        </View>

        {/* {Wallets} */}
        <View style={styles.wallets}>
          {/* {Header} */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(models)/walletModel")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}
          <FlatList
            contentContainerStyle={styles.listStyle}
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem index={index} item={item} router={router} />
              );
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },

  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
