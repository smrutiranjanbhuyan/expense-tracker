import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import {ScreenWrapper,Typo,Header} from '@/components'
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import * as Icon from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useFocusEffect, useRouter } from "expo-router";

const Profile = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.neutral900);
    }, [])
  );
  const router = useRouter();
  const { user } = useAuth();
  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icon.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(models)/profileModel",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icon.GearSix size={26} color={colors.white} weight="fill" />,
      routeName: "/(models)/settingsModel",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icon.Lock size={26} color={colors.white} weight="fill" />,
      routeName: "/(models)/privecyPolicyModel",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icon.Power size={26} color={colors.white} weight="fill" />,
      // routeName: "/(models)/profileModel",
      bgColor: "#e11d48",
    },
  ];
  const handelLogout = async () => {
    await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert("Conform", "Are you sure you want to log out", [
      {
        text: "Cancel",
        // onPress: () => console.log("Cancelled Logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handelLogout(),
        style: "destructive",
      },
    ]);
  };
  const handelPress = (item: accountOptionType) => {
    if (item.title == "Logout") {
      showLogoutAlert();
    }

    if (item.routeName) {
      router.push(item.routeName);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Profile"
          style={{
            marginVertical: spacingY._10,
          }}
        />
        {/* {User info} */}
        <View style={styles.userInfo}>
          {/* {Avatar} */}
          <Image
            source={getProfileImage(user?.image)}
            style={styles.avatar}
            contentFit="cover"
            transition={100}
          />
          <View></View>
          {/* {Email and password} */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* {Account options} */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
                key={index}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handelPress(item)}
                >
                  {/* {Icon} */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item?.title}
                  </Typo>
                  <Icon.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  userInfo: {
    margin: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avtarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    paddingStart: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignContent: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
