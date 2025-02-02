import { StatusBar, StyleSheet, Text, View ,} from 'react-native'
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'


const Wallet = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.black);
    }, [])
  );

  return (
    <ScreenWrapper>
          
      <View>
    <Typo color="white">
    Wallet
    </Typo>
    </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({})