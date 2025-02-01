import { StyleSheet,  View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import ScreenWrapper from '@/components/ScreenWrapper'
import StatusBar from '@/components/StatusBar'
import { colors } from '@/constants/theme'
const Home = () => {
  const { user } = useAuth()

  
  const handelLogout= async()=>{
    await signOut(auth)

  }
  return (
   <ScreenWrapper>
    <StatusBar backgroundColor={colors.black} barStyle='light-content' />
     <View>
    
    <Button onPress={handelLogout}>
      <Typo color='black'>
        Logout
      </Typo>
    </Button>
  </View>
   </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})