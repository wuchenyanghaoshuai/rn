/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 生长曲线工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Info, Lightbulb } from 'lucide-react-native';
import { GradientCard, Radio } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface GrowthStandard {
  age: string;
  maleHeight: { p3: number; p50: number; p97: number };
  maleWeight: { p3: number; p50: number; p97: number };
  femaleHeight: { p3: number; p50: number; p97: number };
  femaleWeight: { p3: number; p50: number; p97: number };
}

const growthStandards: GrowthStandard[] = [
  {
    age: '出生',
    maleHeight: { p3: 46.1, p50: 50.0, p97: 53.9 },
    maleWeight: { p3: 2.5, p50: 3.3, p97: 4.4 },
    femaleHeight: { p3: 45.4, p50: 49.1, p97: 52.9 },
    femaleWeight: { p3: 2.4, p50: 3.2, p97: 4.2 },
  },
  {
    age: '1个月',
    maleHeight: { p3: 50.8, p50: 54.7, p97: 58.6 },
    maleWeight: { p3: 3.4, p50: 4.5, p97: 5.8 },
    femaleHeight: { p3: 49.8, p50: 53.7, p97: 57.6 },
    femaleWeight: { p3: 3.2, p50: 4.2, p97: 5.5 },
  },
  {
    age: '3个月',
    maleHeight: { p3: 57.3, p50: 61.4, p97: 65.5 },
    maleWeight: { p3: 5.0, p50: 6.4, p97: 8.0 },
    femaleHeight: { p3: 55.6, p50: 59.8, p97: 64.0 },
    femaleWeight: { p3: 4.5, p50: 5.8, p97: 7.5 },
  },
  {
    age: '6个月',
    maleHeight: { p3: 63.3, p50: 67.6, p97: 71.9 },
    maleWeight: { p3: 6.4, p50: 7.9, p97: 9.8 },
    femaleHeight: { p3: 61.2, p50: 65.7, p97: 70.3 },
    femaleWeight: { p3: 5.7, p50: 7.3, p97: 9.3 },
  },
  {
    age: '9个月',
    maleHeight: { p3: 67.5, p50: 72.0, p97: 76.5 },
    maleWeight: { p3: 7.2, p50: 8.9, p97: 10.9 },
    femaleHeight: { p3: 65.3, p50: 70.1, p97: 75.0 },
    femaleWeight: { p3: 6.5, p50: 8.2, p97: 10.4 },
  },
  {
    age: '12个月',
    maleHeight: { p3: 71.0, p50: 75.7, p97: 80.5 },
    maleWeight: { p3: 7.9, p50: 9.6, p97: 11.8 },
    femaleHeight: { p3: 68.9, p50: 74.0, p97: 79.2 },
    femaleWeight: { p3: 7.2, p50: 9.0, p97: 11.3 },
  },
  {
    age: '18个月',
    maleHeight: { p3: 77.1, p50: 82.3, p97: 87.5 },
    maleWeight: { p3: 9.0, p50: 10.9, p97: 13.4 },
    femaleHeight: { p3: 74.9, p50: 80.7, p97: 86.5 },
    femaleWeight: { p3: 8.2, p50: 10.2, p97: 12.8 },
  },
  {
    age: '2岁',
    maleHeight: { p3: 82.4, p50: 87.8, p97: 93.2 },
    maleWeight: { p3: 10.0, p50: 12.1, p97: 15.0 },
    femaleHeight: { p3: 80.2, p50: 86.4, p97: 92.6 },
    femaleWeight: { p3: 9.2, p50: 11.5, p97: 14.6 },
  },
  {
    age: '3岁',
    maleHeight: { p3: 89.4, p50: 96.1, p97: 102.7 },
    maleWeight: { p3: 11.3, p50: 14.0, p97: 17.6 },
    femaleHeight: { p3: 87.8, p50: 95.1, p97: 102.3 },
    femaleWeight: { p3: 10.8, p50: 13.6, p97: 17.4 },
  },
];

export default function GrowthChartScreen() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [metric, setMetric] = useState<'height' | 'weight'>('height');

  const getDataForGender = (standard: GrowthStandard) => {
    if (gender === 'male') {
      return metric === 'height' ? standard.maleHeight : standard.maleWeight;
    }
    return metric === 'height' ? standard.femaleHeight : standard.femaleWeight;
  };

  const getPercentileColor = (percentile: 'p3' | 'p50' | 'p97') => {
    switch (percentile) {
      case 'p3':
        return Colors.rose.DEFAULT;
      case 'p50':
        return Colors.mint.DEFAULT;
      case 'p97':
        return Colors.sky.DEFAULT;
    }
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '生长曲线',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 说明卡片 */}
          <GradientCard variant="sky" className="p-5 mb-5">
            <View className="flex-row items-center mb-2">
              <TrendingUp size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">WHO生长标准曲线</Text>
            </View>
            <Text className="text-neutral-700 text-sm leading-5">
              根据世界卫生组织(WHO)发布的儿童生长发育标准数据，帮助您了解宝宝的生长状况。
            </Text>
          </GradientCard>

          {/* 筛选器 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <View className="mb-4">
              <Text className="text-sm font-medium text-neutral-700 mb-3">性别</Text>
              <View className="flex-row gap-3">
                <Radio
                  selected={gender === 'male'}
                  onSelect={() => setGender('male')}
                  label="男宝"
                  className="flex-1"
                />
                <Radio
                  selected={gender === 'female'}
                  onSelect={() => setGender('female')}
                  label="女宝"
                  className="flex-1"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-700 mb-3">查看指标</Text>
              <View className="flex-row gap-3">
                <Radio
                  selected={metric === 'height'}
                  onSelect={() => setMetric('height')}
                  label="身高"
                  className="flex-1"
                />
                <Radio
                  selected={metric === 'weight'}
                  onSelect={() => setMetric('weight')}
                  label="体重"
                  className="flex-1"
                />
              </View>
            </View>
          </GradientCard>

          {/* 百分位说明 */}
          <GradientCard variant="mint" className="p-4 mb-5">
            <Text className="text-neutral-800 font-bold mb-3">百分位说明</Text>
            <View className="flex-row justify-around">
              {[
                { label: 'P3', desc: '偏低', color: Colors.rose.DEFAULT },
                { label: 'P50', desc: '中位数', color: Colors.mint.DEFAULT },
                { label: 'P97', desc: '偏高', color: Colors.sky.DEFAULT },
              ].map((item) => (
                <View key={item.label} className="items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center bg-white/60"
                  >
                    <Text className="font-bold text-sm" style={{ color: item.color }}>
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-neutral-700 text-xs mt-1">{item.desc}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 数据表格 */}
          <GradientCard variant="white" className="p-5">
            <Text className="text-neutral-800 font-bold text-lg mb-4">
              {gender === 'male' ? '男宝' : '女宝'}
              {metric === 'height' ? '身高' : '体重'}标准参考
              ({metric === 'height' ? 'cm' : 'kg'})
            </Text>

            {/* 表头 */}
            <View className="flex-row bg-neutral-50 rounded-xl py-3 px-2">
              <Text className="flex-1 text-neutral-700 font-semibold text-center">年龄</Text>
              <Text className="flex-1 text-neutral-700 font-semibold text-center">P3</Text>
              <Text className="flex-1 text-neutral-700 font-semibold text-center">P50</Text>
              <Text className="flex-1 text-neutral-700 font-semibold text-center">P97</Text>
            </View>

            {/* 数据行 */}
            {growthStandards.map((standard, index) => {
              const data = getDataForGender(standard);
              return (
                <View
                  key={index}
                  className={`flex-row py-3 px-2 border-b border-neutral-100 ${
                    index === growthStandards.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <Text className="flex-1 text-neutral-800 text-center font-medium">
                    {standard.age}
                  </Text>
                  <Text
                    className="flex-1 text-center font-medium"
                    style={{ color: getPercentileColor('p3') }}
                  >
                    {data.p3}
                  </Text>
                  <Text
                    className="flex-1 text-center font-bold"
                    style={{ color: getPercentileColor('p50') }}
                  >
                    {data.p50}
                  </Text>
                  <Text
                    className="flex-1 text-center font-medium"
                    style={{ color: getPercentileColor('p97') }}
                  >
                    {data.p97}
                  </Text>
                </View>
              );
            })}
          </GradientCard>

          {/* 解读说明 */}
          <GradientCard variant="butter" className="p-4 mt-5">
            <View className="flex-row items-center mb-2">
              <Lightbulb size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-semibold ml-2">如何解读</Text>
            </View>
            <Text className="text-neutral-700 text-sm leading-6">
              • P50 代表同龄儿童的中位数，大多数健康儿童在这个范围{'\n'}
              • 位于 P3-P97 之间通常被认为是正常范围{'\n'}
              • 低于 P3 或高于 P97 建议咨询儿科医生{'\n'}
              • 生长趋势比单次测量更重要，持续跟踪是关键
            </Text>
          </GradientCard>

          {/* 数据来源 */}
          <GradientCard variant="lavender" className="p-4 mt-5">
            <View className="flex-row items-center">
              <Info size={16} color={Colors.neutral[600]} />
              <Text className="text-neutral-700 text-sm ml-2">
                数据来源：世界卫生组织(WHO) 儿童生长标准
              </Text>
            </View>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
