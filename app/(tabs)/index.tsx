import { StatusBar, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useFocusEffect } from "expo-router";
import { colors } from "@/constants/theme";

const Home = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.neutral900);
    }, [])
  );
  const { user } = useAuth();

  const handelLogout = async () => {
    await signOut(auth);
  };
  return (
    <ScreenWrapper>
      <View>
        <Button onPress={handelLogout}>
          <Typo color="black">Logout</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
