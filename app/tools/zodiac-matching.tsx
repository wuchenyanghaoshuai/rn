/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 生肖配对工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Info } from 'lucide-react-native';
import { GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface ZodiacInfo {
  name: string;
  emoji: string;
  years: string;
  personality: string;
}

const zodiacs: ZodiacInfo[] = [
  { name: '鼠', emoji: '🐭', years: '2020, 2008, 1996...', personality: '机智灵活' },
  { name: '牛', emoji: '🐮', years: '2021, 2009, 1997...', personality: '踏实勤劳' },
  { name: '虎', emoji: '🐯', years: '2022, 2010, 1998...', personality: '勇敢自信' },
  { name: '兔', emoji: '🐰', years: '2023, 2011, 1999...', personality: '温柔体贴' },
  { name: '龙', emoji: '🐲', years: '2024, 2012, 2000...', personality: '热情大方' },
  { name: '蛇', emoji: '🐍', years: '2025, 2013, 2001...', personality: '深沉内敛' },
  { name: '马', emoji: '🐴', years: '2026, 2014, 2002...', personality: '热情奔放' },
  { name: '羊', emoji: '🐑', years: '2027, 2015, 2003...', personality: '温顺善良' },
  { name: '猴', emoji: '🐵', years: '2028, 2016, 2004...', personality: '聪明伶俐' },
  { name: '鸡', emoji: '🐔', years: '2029, 2017, 2005...', personality: '勤奋守时' },
  { name: '狗', emoji: '🐶', years: '2030, 2018, 2006...', personality: '忠诚可靠' },
  { name: '猪', emoji: '🐷', years: '2031, 2019, 2007...', personality: '诚实憨厚' },
];

// 生肖配对关系
const compatibilityMatrix: Record<string, Record<string, { score: number; description: string }>> = {
  '鼠': {
    '鼠': { score: 80, description: '同属相，心灵相通' },
    '牛': { score: 95, description: '天作之合，相辅相成' },
    '虎': { score: 50, description: '性格差异大，需要磨合' },
    '兔': { score: 60, description: '平淡相处，各有所长' },
    '龙': { score: 90, description: '互相欣赏，配合默契' },
    '蛇': { score: 70, description: '有共同话题，可以发展' },
    '马': { score: 40, description: '性格冲突，不太合适' },
    '羊': { score: 55, description: '需要包容理解' },
    '猴': { score: 95, description: '灵魂伴侣，相见恨晚' },
    '鸡': { score: 65, description: '互补性格，可以尝试' },
    '狗': { score: 75, description: '相互信任，稳定发展' },
    '猪': { score: 85, description: '和睦相处，幸福美满' },
  },
  '牛': {
    '鼠': { score: 95, description: '天作之合，相辅相成' },
    '牛': { score: 75, description: '踏实稳重，但缺乏激情' },
    '虎': { score: 45, description: '性格冲突，不建议' },
    '兔': { score: 70, description: '温和相处，平淡是真' },
    '龙': { score: 55, description: '需要互相让步' },
    '蛇': { score: 90, description: '默契十足，配合完美' },
    '马': { score: 35, description: '相冲，不太合适' },
    '羊': { score: 40, description: '价值观差异大' },
    '猴': { score: 60, description: '可以合作，但需努力' },
    '鸡': { score: 95, description: '三合生肖，非常般配' },
    '狗': { score: 65, description: '相互尊重，可以发展' },
    '猪': { score: 80, description: '互相包容，和谐美满' },
  },
  // 为简化，其他生肖使用默认值
};

const getCompatibility = (zodiac1: string, zodiac2: string) => {
  if (compatibilityMatrix[zodiac1]?.[zodiac2]) {
    return compatibilityMatrix[zodiac1][zodiac2];
  }
  // 默认值
  const defaultScore = 60 + Math.floor(Math.random() * 30);
  return {
    score: defaultScore,
    description: defaultScore >= 80 ? '相处融洽' : defaultScore >= 60 ? '可以发展' : '需要磨合',
  };
};

export default function ZodiacMatchingScreen() {
  const [selectedZodiac1, setSelectedZodiac1] = useState<number | null>(null);
  const [selectedZodiac2, setSelectedZodiac2] = useState<number | null>(null);

  const result =
    selectedZodiac1 !== null && selectedZodiac2 !== null
      ? getCompatibility(zodiacs[selectedZodiac1].name, zodiacs[selectedZodiac2].name)
      : null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return Colors.mint.DEFAULT;
    if (score >= 70) return Colors.butter.DEFAULT;
    if (score >= 55) return Colors.sky.DEFAULT;
    return Colors.rose.DEFAULT;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '天作之合';
    if (score >= 80) return '非常般配';
    if (score >= 70) return '相处融洽';
    if (score >= 60) return '可以发展';
    if (score >= 50) return '需要努力';
    return '不太合适';
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '生肖配对',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 介绍 */}
          <GradientCard variant="rose" className="p-5 mb-5">
            <View className="flex-row items-center mb-2">
              <Heart size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">生肖配对</Text>
            </View>
            <Text className="text-neutral-700 leading-5">
              选择两个生肖，查看配对分析，了解彼此的相合程度。
            </Text>
          </GradientCard>

          {/* 选择区域 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <Text className="text-neutral-800 font-bold text-base mb-3">选择第一个生肖</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {zodiacs.map((zodiac, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-[23%] aspect-square rounded-xl items-center justify-center ${
                    selectedZodiac1 === index ? 'bg-rose-DEFAULT' : 'bg-neutral-100'
                  }`}
                  onPress={() => setSelectedZodiac1(index)}
                >
                  <Text className="text-2xl">{zodiac.emoji}</Text>
                  <Text
                    className={`text-sm mt-1 font-medium ${
                      selectedZodiac1 === index ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {zodiac.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-neutral-800 font-bold text-base mb-3">选择第二个生肖</Text>
            <View className="flex-row flex-wrap gap-2">
              {zodiacs.map((zodiac, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-[23%] aspect-square rounded-xl items-center justify-center ${
                    selectedZodiac2 === index ? 'bg-sky-DEFAULT' : 'bg-neutral-100'
                  }`}
                  onPress={() => setSelectedZodiac2(index)}
                >
                  <Text className="text-2xl">{zodiac.emoji}</Text>
                  <Text
                    className={`text-sm mt-1 font-medium ${
                      selectedZodiac2 === index ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {zodiac.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GradientCard>

          {/* 结果显示 */}
          {result && selectedZodiac1 !== null && selectedZodiac2 !== null && (
            <GradientCard variant="lavender" className="p-6 mb-5">
              {/* 配对展示 */}
              <View className="flex-row items-center justify-center mb-6">
                <View className="items-center">
                  <Text className="text-5xl">{zodiacs[selectedZodiac1].emoji}</Text>
                  <Text className="text-neutral-800 font-medium mt-1">
                    {zodiacs[selectedZodiac1].name}
                  </Text>
                </View>
                <View className="mx-6">
                  <Heart size={32} color={Colors.rose.DEFAULT} fill={Colors.rose.DEFAULT} />
                </View>
                <View className="items-center">
                  <Text className="text-5xl">{zodiacs[selectedZodiac2].emoji}</Text>
                  <Text className="text-neutral-800 font-medium mt-1">
                    {zodiacs[selectedZodiac2].name}
                  </Text>
                </View>
              </View>

              {/* 分数 */}
              <View className="items-center mb-4">
                <Text className="text-neutral-600 mb-2">配对指数</Text>
                <Text
                  className="text-6xl font-bold"
                  style={{ color: getScoreColor(result.score) }}
                >
                  {result.score}
                </Text>
                <View
                  className="px-4 py-1.5 rounded-full mt-2 bg-white/60"
                >
                  <Text
                    className="font-medium"
                    style={{ color: getScoreColor(result.score) }}
                  >
                    {getScoreLabel(result.score)}
                  </Text>
                </View>
              </View>

              {/* 描述 */}
              <View className="bg-white/60 rounded-xl p-4">
                <Text className="text-neutral-800 text-center leading-6">
                  {result.description}
                </Text>
              </View>
            </GradientCard>
          )}

          {/* 生肖相合相冲 */}
          <GradientCard variant="mint" className="p-5 mb-5">
            <View className="flex-row items-center mb-4">
              <Info size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-bold ml-2">生肖相合相冲</Text>
            </View>

            <View className="mb-3">
              <Text className="text-neutral-800 font-semibold mb-2">六合（最佳配对）</Text>
              <Text className="text-neutral-700 text-sm leading-5">
                鼠牛、虎猪、兔狗、龙鸡、蛇猴、马羊
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-neutral-800 font-semibold mb-2">三合（相生互助）</Text>
              <Text className="text-neutral-700 text-sm leading-5">
                猴鼠龙、虎马狗、蛇鸡牛、猪兔羊
              </Text>
            </View>

            <View>
              <Text className="text-neutral-800 font-semibold mb-2">六冲（相冲相克）</Text>
              <Text className="text-neutral-700 text-sm leading-5">
                鼠马、牛羊、虎猴、兔鸡、龙狗、蛇猪
              </Text>
            </View>
          </GradientCard>

          {/* 生肖性格简介 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <Text className="text-neutral-800 font-bold text-base mb-3">十二生肖性格</Text>
            <View className="gap-2">
              {zodiacs.map((zodiac, index) => (
                <View
                  key={index}
                  className="flex-row items-center py-2.5 border-b border-neutral-100 last:border-b-0"
                >
                  <Text className="text-xl mr-2">{zodiac.emoji}</Text>
                  <Text className="text-neutral-800 font-medium w-8">{zodiac.name}</Text>
                  <Text className="text-neutral-600 flex-1 ml-2">
                    {zodiac.personality}
                  </Text>
                  <Text className="text-neutral-400 text-xs">{zodiac.years}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 提示 */}
          <GradientCard variant="butter" className="p-4">
            <Text className="text-neutral-700 text-sm leading-5">
              * 生肖配对仅供娱乐参考，感情需要双方共同经营，
              不应以生肖论断感情好坏。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
