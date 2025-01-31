import { firestore } from "@/config/firebase";
import { UserDataType, ResponseType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {

    // Image pending
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updateData);

    return { success: true, message: "updated sucessfully" };
  } catch (error: any) {
    console.log("Error updating the user", error);
    return { success: false, message: error?.message };
  }
};
