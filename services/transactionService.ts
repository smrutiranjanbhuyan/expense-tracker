import { firestore } from "@/config/firebase";
import { TransactionType, WalletType, ResponseType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletSercice";
import { gatLast7Days, getLast12Months, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

// Create or Update Transaction
export const createOrUpdateTransactions = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, image, amount } = transactionData;

    // Basic Validation
    if (!amount || amount <= 0 || !walletId || !type) {
      return {
        success: false,
        message: "Invalid transaction data",
      };
    }

    // If ID exists, handle Update
    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

      // Check if critical fields changed
      const shouldRevertOriginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;

      if (shouldRevertOriginal) {
        const res = await revertAndUpdateWallets(
          oldTransaction,
          amount,
          type,
          walletId
        );
        if (!res.success) {
          return res;
        }
      }
    } else {
      // Handle New Transaction
      const res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type
      );
      if (!res.success) return res;
    }

    // Handle Image Upload
    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || "Failed to upload receipt",
        };
      }
      transactionData.image = imageUploadRes.data;
    }

    // Save Transaction
    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, {
      merge: true,
    });

    return {
      success: true,
      message: "Transaction created or updated successfully",
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (err: any) {
    console.log("Error creating transaction: ", err);
    return {
      success: false,
      message: err?.message || "Error creating transaction",
    };
  }
};

// Update Wallet for New Transaction
const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      return {
        success: false,
        message: "Wallet not found",
      };
    }

    const walletData = walletSnapShot.data() as WalletType;
    const updatedType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    // Ensure wallet balance is not negative
    if (type === "expense" && updatedWalletAmount < 0) {
      return {
        success: false,
        message: "Insufficient balance for transaction",
      };
    }

    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updatedTotals,
    });

    return {
      success: true,
      message: "Wallet updated successfully",
    };
  } catch (err: any) {
    console.log("Error updating wallet for new transaction: ", err);
    return {
      success: false,
      message: err?.message || "Error updating wallet",
    };
  }
};

// Revert and Update Wallets for Edited Transaction
const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
): Promise<ResponseType> => {
  try {
    // Revert Old Transaction from Original Wallet
    const originalWalletRef = doc(
      firestore,
      "wallets",
      oldTransaction.walletId
    );
    const originalWalletSnapshot = await getDoc(originalWalletRef);
    const originalWalletData = originalWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertedWalletAmount =
      oldTransaction.type === "income"
        ? Number(originalWalletData.amount) - Number(oldTransaction.amount)
        : Number(originalWalletData.amount) + Number(oldTransaction.amount);

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]:
        Number(originalWalletData[revertType]) - Number(oldTransaction.amount),
    });

    // Update with the New Transaction Details
    const newTransactionResult = await updateWalletForNewTransaction(
      newWalletId,
      newTransactionAmount,
      newTransactionType
    );

    return newTransactionResult;
  } catch (err: any) {
    console.log("Error updating wallet for transaction: ", err);
    return {
      success: false,
      message: err?.message || "Error updating wallet transaction",
    };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    const transactionData = transactionSnapshot.data() as TransactionType;

    if (!transactionSnapshot.exists()) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }
    // Delete the transaction from the transactions collection

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    // Fetch wallet

    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    const walletData = walletSnapShot.data() as WalletType;

    // Check if the transaction is in the wallet

    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      transactionType === "income"
        ? walletData.amount! - transactionAmount
        : walletData.amount! + transactionAmount;

    const newExpenseIncomeAmount = walletData[updateType]! - transactionAmount;

    // below code is for updating the wallet amount in the database

    if (transactionType == "expense" && newWalletAmount < 0) {
      return {
        success: false,
        message:
          "Can not delete expense transaction as it will make wallet amount negative",
      };
    }
    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newExpenseIncomeAmount,
    });

    deleteDoc(transactionRef);

    return { success: true };
  } catch (err: any) {
    console.log("Error updating wallet for transaction: ", err);
    return {
      success: false,
      message: err?.message || "Error updating wallet transaction",
    };
  }
};

export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDayAgo = new Date(today);
    sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDayAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = gatLast7Days();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];
      const dayData = weeklyData.find((day) => day.date == transactionDate);
      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        }
        if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });
    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (err: any) {
    console.log("Error updating wallet for transaction: ", err);
    return {
      success: false,
      message: "Error fetching weekly stats",
    };
  }
};

export const fetchMonthlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0]
        .slice(0, 7);

      const monthData = monthlyData.find((month) =>
        month.fullDate.startsWith(transactionDate)
      );
      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        }
        if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(6),
        labelWidth: scale(35),
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (err: any) {
    console.log("Error fetching monthly stats: ", err);
    return {
      success: false,
      message: "Error fetching monthly stats",
    };
  }
};

export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const startYear = today.getFullYear() - 4;
    const endYear = today.getFullYear();

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(new Date(`${startYear}-01-01`))),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const yearlyData = getYearsRange(startYear, endYear);
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear()
        .toString();

      const yearData = yearlyData.find(
        (year: { year: string }) => year.year === transactionYear
      );
      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        }
        if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap(
      (year: { year: string; income: number; expense: number }) => [
        {
          value: year.income,
          label: year.year,
          spacing: scale(8),
          labelWidth: scale(40),
          frontColor: colors.primary,
        },
        {
          value: year.expense,
          frontColor: colors.rose,
        },
      ]
    );

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (err: any) {
    console.log("Error fetching yearly stats: ", err);
    return {
      success: false,
      message: "Error fetching yearly stats",
    };
  }
};
