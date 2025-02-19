import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useFocusEffect } from "expo-router";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import Typo from "@/components/Typo";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/authContext";

const Stastics = () => {
  const {user}=useAuth();
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor(colors.neutral900);
    }, [])
  );
  const [chatLoading, setChatLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([
    {
      value: Math.floor(Math.random() * 100),
      label: "Mon",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    {
      value: Math.floor(Math.random() * 100),
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Tue",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    {
      value: Math.floor(Math.random() * 100),
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Wed",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    {
      value: Math.floor(Math.random() * 100),
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Thu",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    {
      value: Math.floor(Math.random() * 100),
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Fri",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Sat",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar

    {
      value: Math.floor(Math.random() * 100),
      label: "Sun",
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.primary,
    }, // Income
    {
      value: Math.floor(Math.random() * 100),
      spacing: scale(5),
      labelWidth: scale(20),
      frontColor: colors.rose,
    }, // Expense
    { spacing: scale(5), labelWidth: scale(20) }, // Blank bar
  ]);

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
    //
  };
  const getMonthlyStats = async () => {
    //
  };
  const getYearlyStats = async () => {
    //
  };
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
                yAxisLabelPrefix="₹"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                }
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={3}
                // hideYAxisText
                // maxValue={100}
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
