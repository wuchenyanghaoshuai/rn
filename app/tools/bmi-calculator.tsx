/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description BMI计算器工具 - 方案A设计系统重构版
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
import { Ruler, Weight, Calculator, Info } from 'lucide-react-native';
import { Input, Button, GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface BMIResult {
  bmi: number;
  category: string;
  variant: 'sky' | 'mint' | 'butter' | 'rose';
  advice: string;
}

export default function BMICalculatorScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    if (isNaN(h) || isNaN(w)) {
      Alert.alert('提示', '请输入正确的身高和体重');
      return;
    }

    if (h < 30 || h > 250 || w < 2 || w > 200) {
      Alert.alert('提示', '请输入合理的身高和体重范围');
      return;
    }

    // BMI = 体重(kg) / 身高(m)²
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;

    let category: string;
    let variant: 'sky' | 'mint' | 'butter' | 'rose';
    let advice: string;

    if (bmi < 18.5) {
      category = '偏瘦';
      variant = 'sky';
      advice = '建议适当增加营养摄入，保证蛋白质、碳水化合物的均衡摄入，同时进行适度的力量训练。';
    } else if (bmi < 24) {
      category = '正常';
      variant = 'mint';
      advice = '体重在正常范围内，继续保持健康的饮食习惯和规律的运动。';
    } else if (bmi < 28) {
      category = '偏重';
      variant = 'butter';
      advice = '建议控制饮食热量摄入，减少高糖高脂食物，增加有氧运动，每周至少150分钟中等强度运动。';
    } else {
      category = '肥胖';
      variant = 'rose';
      advice = '建议在医生指导下制定科学的减重计划，控制饮食、规律运动，必要时寻求专业帮助。';
    }

    setResult({
      bmi: bmiRounded,
      category,
      variant,
      advice,
    });
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setResult(null);
  };

  const bmiRanges = [
    { label: '偏瘦', range: '< 18.5', color: Colors.sky.DEFAULT },
    { label: '正常', range: '18.5 - 23.9', color: Colors.mint.DEFAULT },
    { label: '偏重', range: '24 - 27.9', color: Colors.butter.DEFAULT },
    { label: '肥胖', range: '≥ 28', color: Colors.rose.DEFAULT },
  ];

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: 'BMI计算',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 输入区域 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <Input
              label="身高 (cm)"
              placeholder="请输入身高"
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              icon={<Ruler size={20} color={Colors.neutral[400]} />}
              className="mb-4"
            />

            <Input
              label="体重 (kg)"
              placeholder="请输入体重"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              icon={<Weight size={20} color={Colors.neutral[400]} />}
              className="mb-5"
            />

            <View className="flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onPress={calculateBMI}
                icon={<Calculator size={20} color="white" />}
                className="flex-1"
              >
                开始计算
              </Button>
              <Button
                variant="outline"
                size="lg"
                onPress={reset}
              >
                重置
              </Button>
            </View>
          </GradientCard>

          {/* 结果显示 */}
          {result && (
            <GradientCard variant={result.variant} className="p-6">
              <Text className="text-neutral-800 font-bold text-lg mb-4">计算结果</Text>
              <View className="items-center py-4">
                <Text className="text-neutral-600 text-sm mb-2">您的BMI指数</Text>
                <Text className="text-primary-400 font-bold text-5xl mb-1">
                  {result.bmi}
                </Text>
                <View className="bg-white/60 px-4 py-1.5 rounded-full mt-2">
                  <Text className="text-neutral-800 font-semibold">
                    {result.category}
                  </Text>
                </View>
              </View>

              <View className="bg-white/60 rounded-xl p-4 mt-3">
                <Text className="text-neutral-800 font-semibold mb-2">健康建议</Text>
                <Text className="text-neutral-700 text-sm leading-5">{result.advice}</Text>
              </View>
            </GradientCard>
          )}

          {/* BMI 参考表 */}
          <GradientCard variant="white" className="p-5 mt-5">
            <Text className="text-neutral-800 font-bold text-lg mb-4">BMI 参考标准</Text>
            <View className="gap-2">
              {bmiRanges.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-3 px-4 rounded-xl bg-neutral-50"
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-neutral-800 font-medium">{item.label}</Text>
                  </View>
                  <Text className="text-neutral-600">{item.range}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 计算公式 */}
          <GradientCard variant="lavender" className="p-4 mt-5">
            <View className="flex-row items-center mb-2">
              <Info size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-semibold ml-2">计算公式</Text>
            </View>
            <Text className="text-neutral-700 text-base mb-2">
              BMI = 体重 (kg) ÷ 身高 (m)²
            </Text>
            <Text className="text-neutral-600 text-sm leading-5">
              * 以上标准适用于成人，儿童BMI评估需参考年龄别BMI曲线
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
