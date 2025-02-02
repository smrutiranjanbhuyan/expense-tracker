import { WalletType, ResponseType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = {
      ...walletData,
      amount: walletData?.id ? walletData.amount : 0,
      totalIncome: walletData?.id ? walletData.totalIncome : 0,
      totalExpenses: walletData?.id ? walletData.totalExpenses : 0,
      created: walletData?.id ? walletData.created : new Date(),
    };

    if (walletData.image) {
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

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });

    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("Error creating or updating wallet", error);
    return { success: false, message: error?.message };
  }
};
