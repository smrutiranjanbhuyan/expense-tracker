import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {ScreenWrapper,Typo,Button,HomeCard,TransactionList,Header,Loading} from '@/components'
import { useFocusEffect } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";

import { useAuth } from "@/contexts/authContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transactionService";
import { TransactionType } from "@/types";
import { useCurrency } from "@/contexts/currencyContext";

const Stastics = () => {
  const { user } = useAuth();
    const { currencySymbol } = useCurrency();
  
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.neutral900);
    }, [])
  );
  const [chatLoading, setChatLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyStats();
    }
    if (activeIndex == 1) {
      getMonthlyStats();
    }
    if (activeIndex == 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChatLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChatLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };
  const getMonthlyStats = async () => {
    setChatLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChatLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };
  const getYearlyStats = async () => {
    setChatLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChatLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };
  const maxValue = Math.max(...transactions.map((item) => item.amount));

  const noOfSections = 3;
  
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`; 
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`; 
    } else {
      return num.toFixed(1); 
    }
  };
  
  const yAxisLabels = Array.from(
    { length: noOfSections + 1 },
    (_, i) => `${currencySymbol}${formatNumber((maxValue / noOfSections) * i)}`
  );
  

  

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            padding: spacingX._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{
              ...styles.segmentFontStyle,
              color: colors.white,
            }}
          />
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix={currencySymbol}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(65) : scale(60)
                }
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={noOfSections}
                yAxisLabelTexts={yAxisLabels}
              />
            ) : (
              <View style={styles.noChat} />
            )}
            {chatLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white} />
              </View>
            )}
          </View>
          {/* {Display trans} */}
          <View>
            <TransactionList
              title="Transactions"
              emptyListMessage="No transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Stastics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {},
  noChat: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: verticalScale(35),
    height: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
