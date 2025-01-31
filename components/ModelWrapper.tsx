import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
const isIos=Platform.OS == 'ios';
const ModelWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, style && style, { backgroundColor: bg }]}>
      {children}
    </View>
  );
};

export default ModelWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos? spacingY._15: spacingY._50,
    paddingBottom: isIos? spacingY._20: spacingY._10
  },
});
