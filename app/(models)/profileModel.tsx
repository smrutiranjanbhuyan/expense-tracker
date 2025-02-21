import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import {ModelWrapper,Header,BackButton,Typo,Button,Input} from '@/components'
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icon from "phosphor-react-native";
import { UserDataType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";

import * as ImagePicker from "expo-image-picker";

const profileModel = () => {
  const router = useRouter();
  const { user, updateUserData } = useAuth();
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };
  let onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Plese fill all the fields");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);
    if (res.success == true) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", "Failed to update user");
    }
  };
  return (
    <ModelWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{
            marginBottom: spacingY._10,
          }}
        />
        {/* {Form} */}

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avtarContainer}>
            <Image
              style={styles?.avtar}
              source={getProfileImage(userData?.image)}
              contentFit="cover"
              transition={100}
            />
            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
              <Icon.Pencil size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModelWrapper>
  );
};

export default profileModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacingX._15,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avtarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avtar: {
    alignItems: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._7,
    right: spacingY._7,
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    padding: spacingY._7,
  },

  inputContainer: {
    gap: spacingY._10,
  },
});
