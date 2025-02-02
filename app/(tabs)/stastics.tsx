import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useFocusEffect } from 'expo-router';
import { colors } from '@/constants/theme';

const Stastics = () => {
    useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor(colors.neutral900);
      }, [])
    );
  return (
    <ScreenWrapper>
      <View>
      <Text>stastics</Text>
    </View>
    </ScreenWrapper>
  )
}

export default Stastics

const styles = StyleSheet.create({})