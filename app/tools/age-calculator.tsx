/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 年龄计算器工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Cake, Star } from 'lucide-react-native';
import { Input, GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

export default function AgeCalculatorScreen() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const calculateAge = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return null;
    }

    const birth = new Date(y, m - 1, d);
    const now = new Date();

    if (birth > now) {
      return null;
    }

    // 计算详细年龄
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // 计算总天数
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // 下一个生日
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBirthday = Math.ceil(
      (nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      daysToNextBirthday,
      zodiac: getZodiac(birth),
      constellation: getConstellation(m, d),
    };
  };

  const getZodiac = (date: Date) => {
    const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiacs[(date.getFullYear() - 4) % 12];
  };

  const getConstellation = (month: number, day: number) => {
    const constellations = [
      { name: '摩羯座', end: [1, 19] },
      { name: '水瓶座', end: [2, 18] },
      { name: '双鱼座', end: [3, 20] },
      { name: '白羊座', end: [4, 19] },
      { name: '金牛座', end: [5, 20] },
      { name: '双子座', end: [6, 21] },
      { name: '巨蟹座', end: [7, 22] },
      { name: '狮子座', end: [8, 22] },
      { name: '处女座', end: [9, 22] },
      { name: '天秤座', end: [10, 23] },
      { name: '天蝎座', end: [11, 22] },
      { name: '射手座', end: [12, 21] },
      { name: '摩羯座', end: [12, 31] },
    ];

    for (const c of constellations) {
      if (month < c.end[0] || (month === c.end[0] && day <= c.end[1])) {
        return c.name;
      }
    }
    return '摩羯座';
  };

  const result = calculateAge();

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '年龄计算',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 日期输入 */}
          <GradientCard variant="white" className="p-5">
            <View className="flex-row items-center mb-4">
              <Calendar size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-bold text-lg ml-2">选择出生日期</Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-neutral-600 text-sm mb-2">年</Text>
                <Input
                  placeholder="2020"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                  className="text-center"
                />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-600 text-sm mb-2">月</Text>
                <Input
                  placeholder="1"
                  value={month}
                  onChangeText={setMonth}
                  keyboardType="number-pad"
                  className="text-center"
                />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-600 text-sm mb-2">日</Text>
                <Input
                  placeholder="1"
                  value={day}
                  onChangeText={setDay}
                  keyboardType="number-pad"
                  className="text-center"
                />
              </View>
            </View>
          </GradientCard>

          {/* 结果显示 */}
          {result && (
            <>
              {/* 主要年龄 */}
              <GradientCard variant="mint" className="mt-5 p-6 items-center">
                <Text className="text-neutral-700 text-sm">宝宝已经</Text>
                <View className="flex-row items-end mt-2">
                  {result.years > 0 && (
                    <>
                      <Text className="text-neutral-800 text-5xl font-bold">{result.years}</Text>
                      <Text className="text-neutral-700 text-xl mb-2 ml-1">岁</Text>
                    </>
                  )}
                  {result.months > 0 && (
                    <>
                      <Text className="text-neutral-800 text-5xl font-bold ml-2">{result.months}</Text>
                      <Text className="text-neutral-700 text-xl mb-2 ml-1">个月</Text>
                    </>
                  )}
                  <Text className="text-neutral-800 text-5xl font-bold ml-2">{result.days}</Text>
                  <Text className="text-neutral-700 text-xl mb-2 ml-1">天</Text>
                </View>
              </GradientCard>

              {/* 详细信息 */}
              <GradientCard variant="white" className="p-5 mt-5">
                <Text className="text-neutral-800 font-bold text-base mb-4">详细信息</Text>

                <View className="flex-row flex-wrap gap-3">
                  <View className="bg-sky-light rounded-xl p-3 flex-1 min-w-[45%]">
                    <Text className="text-neutral-700 text-sm">总天数</Text>
                    <Text className="text-neutral-800 text-xl font-bold mt-1">
                      {result.totalDays.toLocaleString()} 天
                    </Text>
                  </View>
                  <View className="bg-mint-light rounded-xl p-3 flex-1 min-w-[45%]">
                    <Text className="text-neutral-700 text-sm">总周数</Text>
                    <Text className="text-neutral-800 text-xl font-bold mt-1">
                      {result.totalWeeks.toLocaleString()} 周
                    </Text>
                  </View>
                  <View className="bg-lavender-light rounded-xl p-3 flex-1 min-w-[45%]">
                    <Text className="text-neutral-700 text-sm">总月数</Text>
                    <Text className="text-neutral-800 text-xl font-bold mt-1">
                      {result.totalMonths} 个月
                    </Text>
                  </View>
                  <View className="bg-butter-light rounded-xl p-3 flex-1 min-w-[45%]">
                    <Text className="text-neutral-700 text-sm">距下次生日</Text>
                    <Text className="text-neutral-800 text-xl font-bold mt-1">
                      {result.daysToNextBirthday} 天
                    </Text>
                  </View>
                </View>
              </GradientCard>

              {/* 生肖和星座 */}
              <View className="mt-5 flex-row gap-3">
                <GradientCard variant="rose" className="flex-1 p-5 items-center">
                  <Cake size={28} color={Colors.neutral[700]} />
                  <Text className="text-neutral-700 text-sm mt-2">生肖</Text>
                  <Text className="text-neutral-800 text-xl font-bold mt-1">
                    {result.zodiac}
                  </Text>
                </GradientCard>
                <GradientCard variant="lavender" className="flex-1 p-5 items-center">
                  <Star size={28} color={Colors.neutral[700]} />
                  <Text className="text-neutral-700 text-sm mt-2">星座</Text>
                  <Text className="text-neutral-800 text-xl font-bold mt-1">
                    {result.constellation}
                  </Text>
                </GradientCard>
              </View>
            </>
          )}

          {/* 提示 */}
          {!result && year && month && day && (
            <GradientCard variant="rose" className="p-4 mt-5">
              <Text className="text-neutral-800 font-semibold">请输入正确的出生日期</Text>
            </GradientCard>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
