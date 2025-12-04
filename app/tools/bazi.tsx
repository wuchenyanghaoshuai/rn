/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 生辰八字工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Lightbulb } from 'lucide-react-native';
import { Input, Button, GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface BaziResult {
  yearPillar: { heavenlyStem: string; earthlyBranch: string };
  monthPillar: { heavenlyStem: string; earthlyBranch: string };
  dayPillar: { heavenlyStem: string; earthlyBranch: string };
  hourPillar: { heavenlyStem: string; earthlyBranch: string };
  fiveElements: { metal: number; wood: number; water: number; fire: number; earth: number };
  analysis: string;
}

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const stemElements: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};

const branchElements: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

const elementColors: Record<string, string> = {
  '金': '#f59e0b',
  '木': '#22c55e',
  '水': '#3b82f6',
  '火': '#ef4444',
  '土': '#a855f7',
};

export default function BaziScreen() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [result, setResult] = useState<BaziResult | null>(null);

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);
    const h = parseInt(hour);

    if (isNaN(y) || isNaN(m) || isNaN(d) || y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
      Alert.alert('提示', '请输入正确的出生日期');
      return;
    }

    // 简化的八字计算（实际应用中需要更复杂的算法）
    const yearStemIndex = (y - 4) % 10;
    const yearBranchIndex = (y - 4) % 12;

    const monthStemIndex = (y * 12 + m) % 10;
    const monthBranchIndex = (m + 1) % 12;

    const dayStemIndex = (y + Math.floor(y / 4) + d + m * 2) % 10;
    const dayBranchIndex = (y + d + m) % 12;

    const hourIndex = isNaN(h) ? 0 : Math.floor((h + 1) / 2) % 12;
    const hourStemIndex = (dayStemIndex * 2 + hourIndex) % 10;

    const yearPillar = {
      heavenlyStem: heavenlyStems[yearStemIndex],
      earthlyBranch: earthlyBranches[yearBranchIndex],
    };
    const monthPillar = {
      heavenlyStem: heavenlyStems[monthStemIndex],
      earthlyBranch: earthlyBranches[monthBranchIndex],
    };
    const dayPillar = {
      heavenlyStem: heavenlyStems[dayStemIndex],
      earthlyBranch: earthlyBranches[dayBranchIndex],
    };
    const hourPillar = {
      heavenlyStem: heavenlyStems[hourStemIndex],
      earthlyBranch: earthlyBranches[hourIndex],
    };

    // 统计五行
    const elements: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    [yearPillar, monthPillar, dayPillar, hourPillar].forEach((pillar) => {
      elements[stemElements[pillar.heavenlyStem]]++;
      elements[branchElements[pillar.earthlyBranch]]++;
    });

    const fiveElements = {
      metal: elements['金'],
      wood: elements['木'],
      water: elements['水'],
      fire: elements['火'],
      earth: elements['土'],
    };

    // 生成分析
    const maxElement = Object.entries(elements).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const minElement = Object.entries(elements).reduce((a, b) => (a[1] < b[1] ? a : b))[0];

    const analysis = `八字以${maxElement}为旺，${minElement}较弱。日主${dayPillar.heavenlyStem}${stemElements[dayPillar.heavenlyStem]}，建议起名时可补充${minElement}属性的字，以达到五行平衡。`;

    setResult({
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      fiveElements,
      analysis,
    });
  };

  const renderPillar = (
    title: string,
    pillar: { heavenlyStem: string; earthlyBranch: string }
  ) => {
    const stemElement = stemElements[pillar.heavenlyStem];
    const branchElement = branchElements[pillar.earthlyBranch];

    return (
      <View className="flex-1 items-center">
        <Text className="text-neutral-600 text-xs mb-2">{title}</Text>
        <View className="bg-rose-light rounded-lg p-2 w-full items-center">
          <Text
            className="text-2xl font-bold"
            style={{ color: elementColors[stemElement] }}
          >
            {pillar.heavenlyStem}
          </Text>
          <Text className="text-xs" style={{ color: elementColors[stemElement] }}>
            {stemElement}
          </Text>
        </View>
        <View className="bg-butter-light rounded-lg p-2 w-full items-center mt-1">
          <Text
            className="text-2xl font-bold"
            style={{ color: elementColors[branchElement] }}
          >
            {pillar.earthlyBranch}
          </Text>
          <Text className="text-xs" style={{ color: elementColors[branchElement] }}>
            {branchElement}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '生辰八字',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 介绍 */}
          <GradientCard variant="lavender" className="p-5 mb-5">
            <View className="flex-row items-center mb-2">
              <Calendar size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">生辰八字查询</Text>
            </View>
            <Text className="text-neutral-700 leading-5">
              根据出生时间计算八字，分析五行旺衰，为起名提供参考。
            </Text>
          </GradientCard>

          {/* 输入区域 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-neutral-600 text-sm mb-2">年</Text>
                <Input
                  placeholder="2024"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                  maxLength={4}
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
                  maxLength={2}
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
                  maxLength={2}
                  className="text-center"
                />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-600 text-sm mb-2">时(0-23)</Text>
                <Input
                  placeholder="12"
                  value={hour}
                  onChangeText={setHour}
                  keyboardType="number-pad"
                  maxLength={2}
                  className="text-center"
                />
              </View>
            </View>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={calculate}
              icon={<Calendar size={20} color="white" />}
            >
              查询八字
            </Button>
          </GradientCard>

          {/* 结果显示 */}
          {result && (
            <>
              {/* 八字四柱 */}
              <GradientCard variant="white" className="p-5 mb-5">
                <Text className="text-neutral-800 font-bold text-base mb-4 text-center">八字四柱</Text>
                <View className="flex-row gap-3">
                  {renderPillar('年柱', result.yearPillar)}
                  {renderPillar('月柱', result.monthPillar)}
                  {renderPillar('日柱', result.dayPillar)}
                  {renderPillar('时柱', result.hourPillar)}
                </View>
              </GradientCard>

              {/* 五行统计 */}
              <GradientCard variant="mint" className="p-5 mb-5">
                <Text className="text-neutral-800 font-bold text-base mb-4">五行统计</Text>
                <View className="flex-row justify-around">
                  {[
                    { name: '金', count: result.fiveElements.metal, color: elementColors['金'] },
                    { name: '木', count: result.fiveElements.wood, color: elementColors['木'] },
                    { name: '水', count: result.fiveElements.water, color: elementColors['水'] },
                    { name: '火', count: result.fiveElements.fire, color: elementColors['火'] },
                    { name: '土', count: result.fiveElements.earth, color: elementColors['土'] },
                  ].map((item) => (
                    <View key={item.name} className="items-center">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Text className="text-xl font-bold" style={{ color: item.color }}>
                          {item.name}
                        </Text>
                      </View>
                      <Text className="text-neutral-800 font-bold mt-2">{item.count}</Text>
                    </View>
                  ))}
                </View>
              </GradientCard>

              {/* 分析 */}
              <GradientCard variant="butter" className="p-5 mb-5">
                <View className="flex-row items-center mb-3">
                  <Lightbulb size={20} color={Colors.neutral[700]} />
                  <Text className="text-neutral-800 font-bold ml-2">八字分析</Text>
                </View>
                <Text className="text-neutral-700 leading-6">{result.analysis}</Text>
              </GradientCard>
            </>
          )}

          {/* 说明 */}
          <GradientCard variant="sky" className="p-4">
            <Text className="text-neutral-700 text-sm leading-5">
              * 八字命理为传统文化，仅供参考娱乐，不具有科学依据。
              如需专业分析请咨询专业命理师。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
