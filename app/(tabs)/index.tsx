import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import {ScreenWrapper,Typo,Button,HomeCard,TransactionList} from '@/components'
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { useFocusEffect, useRouter } from "expo-router";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType, WalletType } from "@/types";

const Home = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.neutral900);
    }, [])
  );
  const { user } = useAuth();
  const router=useRouter();

  const constraints=[
    where('uid','==',user?.uid),
    orderBy('date','desc'),
    limit(30)
  ];

  const {
    data: recentTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);
  const handelLogout = async () => {
    await signOut(auth);
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* {Header} */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Welcome back,
            </Typo>
            <Typo size={20} color={colors.neutral100} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchItem} onPress={()=>router.push('/(models)/searchModel')}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroolViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* {Card} */}
          <View>
            <HomeCard />
          </View>


          <TransactionList data={recentTransactions} 
          loading={transactionLoading}
          emptyListMessage="No Transactions added yet"
          title="Recent Transactions" />
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(models)/transactionModel")}
         
        >
          <Icons.Plus
            size={verticalScale(24)}
            color={colors.black}
            weight="bold"
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchItem: {
    backgroundColor: colors.neutral700,
    padding: spacingY._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scroolViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
