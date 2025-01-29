import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types'
import { colors, radius } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const Button = ({
    children,
    onPress,
    style,
    loading=false,
}:CustomButtonProps) => {
    if(loading){
        return ( <View style={[style,styles.button,{backgroundColor:"transparent"}]}>
            {/* {Loading component } */}

        </View>)
    }
  return (
    <TouchableOpacity onPress={onPress} style={[style,styles.button]}>
       {
        children
       }
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor:colors.primary,
        borderRadius:radius._17,
        borderCurve:"continuous",
        height:verticalScale(52),
        justifyContent:"center",
        alignItems:"center",
  
    }
})