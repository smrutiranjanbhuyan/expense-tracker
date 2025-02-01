import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import CustomStatusBar from '@/components/StatusBar'

const Wallet = () => {
  return (
    <ScreenWrapper>
            <CustomStatusBar barStyle="light-content" backgroundColor={colors.black}/>
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