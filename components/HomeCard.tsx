import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
const HomeCard = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    loading: walletLoading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expense = totals.expense + Number(item.totalExpenses);
        return totals;
      },
      {
        balance: 0,
        income: 0,
        expense: 0,
      }
    );
  };
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBalanceBox}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutline
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            ₹ {walletLoading ?'----' :getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* Expenses and incomes */}

        <View style={styles.stats}>
          {/* Income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                ₹ {walletLoading ?'----':getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>

          {/* Expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                ₹ {walletLoading ?'----':getTotals()?.expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingY._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
