import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'


const Wallet = () => {
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