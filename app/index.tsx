import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { colors } from "../constants/theme";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper"

const index = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/welcome");
  //   }, 2000);
  // }, []);

  return (
   <ScreenWrapper>
     <View style={style.container}>
      <Image
        style={style.logo}
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
   </ScreenWrapper>
  );
};

export default index;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
