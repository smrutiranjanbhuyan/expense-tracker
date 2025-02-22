import { Alert, ScrollView, StyleSheet, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {
  ModelWrapper,
  Header,
  BackButton,
  Typo,
  Button,
  ImageUpload,
  Input
} from "@/components";
import { TransactionType, WalletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletSercice";
import * as Icon from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { transactionTypes, expenseCategories } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  createOrUpdateTransactions,
  deleteTransaction,
} from "@/services/transactionService";
import { useCurrency } from "@/contexts/currencyContext";

const transactionModel = () => {
  const { currencySymbol, setCurrency } = useCurrency();
  const router = useRouter();
  const { user } = useAuth();

  type parameterType = {
    id: string;
    type: string;
    amount: string;
    category: string;
    date: string;
    description: string;
    image: any;
    uid: string;
    walletId: string;
  };

  const oldTransaction: parameterType = useLocalSearchParams();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction?.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image || null,
      });
    }
  }, []);

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(false);
  };

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaction", "Plese fill all the fields");
      return;
    }
    // console.log("good to go");
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };
    // console.log("Trans data", transactionData);
    // Todo:Include transaction id

    if (oldTransaction?.id) {
      transactionData.id = oldTransaction.id;
    }
    setLoading(true);
    const res = await createOrUpdateTransactions(transactionData);
    setLoading(false);
    if (res?.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.message);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction?.walletId
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.message || "Failed to delete transaction");
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
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

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  return (
    <ModelWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
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
            <Typo color={colors.neutral200} size={16}>
              Type
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              selectedTextStyle={styles.dropDownselectedText}
              iconStyle={styles.dropDownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={{ color: colors.white }}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropDownListContainer}
              placeholder={"Select type"}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Wallet
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              selectedTextStyle={styles.dropDownselectedText}
              iconStyle={styles.dropDownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet.name} ${currencySymbol}(${wallet.amount})`,
                value: wallet.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={{ color: colors.white }}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropDownListContainer}
              placeholderStyle={styles.dropDownPlaceholder}
              placeholder={"Select wallet"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                selectedTextStyle={styles.dropDownselectedText}
                iconStyle={styles.dropDownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={{ color: colors.white }}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropDownListContainer}
                placeholderStyle={styles.dropDownPlaceholder}
                placeholder={"Select category"}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                />
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Amount
            </Typo>
            <Input
              // placeholder="Salary"
              value={transaction.amount?.toString()}
              keyboardType="numeric"
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/^0-9/g, "")),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>
            <Input
              // placeholder="Salary"
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Reciet
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>
            <ImageUpload
              placeholder="Upload Image"
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({
                  ...transaction,
                  image: file,
                })
              }
              onClear={() =>
                setTransaction({
                  ...transaction,
                  image: null,
                })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
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
            {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          </Typo>
        </Button>
      </View>
    </ModelWrapper>
  );
};

export default transactionModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._5,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderWidth: 1,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderCurve: "continuous",
  },
  dropDownPlaceholder: {
    color: colors.white,
  },
  dropDownselectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  inputContainer: {
    gap: spacingY._10,
  },
  dropDownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    marginHorizontal: spacingX._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dateInput: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    justifyContent: "center",
    borderRadius: radius._15,
  },
});
