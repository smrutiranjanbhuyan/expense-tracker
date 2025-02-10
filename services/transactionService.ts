import { firestore } from "@/config/firebase";
import { TransactionType, WalletType ,ResponseType} from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransactions = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, image, amount } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return {
        success: false,
        message: "Invalid transaction data",
      };
    }
    if (id) {
      // Todo
    } else {
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res?.success) return res;
    }

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
    console.log("Error creating transaction; ", err);
    return {
      success: false,
      message: err?.message || "Error creating transaction",
    };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      console.log("Error updating wallet for new transaction ");
      return {
        success: false,
        message: "Wallet not found",
      };
    }
    const walletData = walletSnapShot.data() as WalletType;
    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        message: "Selected wallet does not have sufficient balance",
      };
    }

    const updatedType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;
    const updatedTotals =
      type == "income"
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
    console.log("Error updating wallet for new transaction ", err);
    return {
      success: false,
      message: err?.message || "Error updating wallet",
    };
  }
};