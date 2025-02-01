import { firestore } from "@/config/firebase";
import { UserDataType, ResponseType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
 
    
    if (updateData.image && updateData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        { uri:updateData.image.uri  },
        "users"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || "Failed to upload image",
        };
      }
      updateData.image = imageUploadRes.data;
    }
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updateData);

    return { success: true, message: "updated sucessfully" };
  } catch (error: any) {
    console.log("Error updating the user", error);
    return { success: false, message: error?.message };
  }
};
