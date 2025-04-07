import { WalletType, ResponseType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    if (!walletData) {
      return { success: false, message: "Invalid wallet data" };
    }

    let walletToSave = {
      ...walletData,
    };
    if (walletData.id && "amount" in walletToSave) {
      delete walletToSave.amount;
    }

    
    // Handle Image Upload
    if (walletData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        { uri: walletData.image.uri },
        "wallets"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    // Create or update wallet
    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });

    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.error("Error creating or updating wallet", error);
    return { success: false, message: error?.message || "An error occurred" };
  }     
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);
    deleteTransactionByWalletId(walletId);

    return { success: true, message: "Wallet deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting wallet", error);
    return { success: false, message: error?.message || "An error occurred" };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransaction = true;

    while (hasMoreTransaction) {
      const transactionQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );
      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size == 0) {
        hasMoreTransaction = false;
        break;
      }

      const batch = writeBatch(firestore);

      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });
      await batch.commit();
    }

    return { success: true, message: "All transactions deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting wallet", error);
    return { success: false, message: error?.message || "An error occurred" };
  }
};
