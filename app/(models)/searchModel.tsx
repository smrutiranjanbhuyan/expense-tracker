import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModelWrapper from "@/components/ModelWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletSercice";
import * as Icon from "phosphor-react-native";

const searchModel = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
const [search, setSearch] = useState('');




  return (
    <ModelWrapper style={{backgroundColor:colors.neutral300}}>
      <View style={styles.container}>
        <Header
          title={'Search'}
          leftIcon={<BackButton />}
          style={{
            marginBottom: spacingY._10,
          }}
        />
        {/* {Form} */}

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            
            <Input
              placeholder="books"
              value={search}
              containerStyle={{
                backgroundColor:colors.neutral800
              }}
              placeholderTextColor={colors.neutral400}
              onChangeText={(value) => setSearch(value)}
            />
          </View>
      
        </ScrollView>
      </View>

   
    </ModelWrapper>
  );
};

export default searchModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
