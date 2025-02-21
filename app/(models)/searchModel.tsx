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
  TransactionList,
} from "@/components";
import { TransactionType, WalletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletSercice";
import * as Icon from "phosphor-react-native";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";

const searchModel = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions?.filter((item) => {
    if (search.length > 1) {
      return (
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <ModelWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{
            marginBottom: spacingY._10,
          }}
        />
        {/* {Form} */}

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Input
              placeholder="books"
              value={search}
              containerStyle={{
                backgroundColor: colors.neutral800,
              }}
              placeholderTextColor={colors.neutral400}
              onChangeText={(value) => setSearch(value)}
            />
          </View>
          <View>
            <TransactionList
              loading={transactionLoading}
              data={filteredTransactions}
              emptyListMessage="No transactions match your search"
            />
          </View>
        </ScrollView>
      </View>
    </ModelWrapper>
  );
};

export default searchModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
