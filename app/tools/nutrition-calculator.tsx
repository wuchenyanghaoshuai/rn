/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 营养计算器工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calculator, Flame, Weight } from 'lucide-react-native';
import { Input, Button, GradientCard, Radio } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
}

export default function NutritionCalculatorScreen() {
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('months');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<NutritionResult | null>(null);

  const calculate = () => {
    const ageValue = parseFloat(age);
    const weightValue = parseFloat(weight);

    if (isNaN(ageValue) || isNaN(weightValue)) {
      Alert.alert('提示', '请输入正确的年龄和体重');
      return;
    }

    // 转换为月龄
    const ageInMonths = ageUnit === 'years' ? ageValue * 12 : ageValue;

    // 根据年龄计算每日营养需求（简化版本）
    let calories: number;
    let protein: number;

    if (ageInMonths < 6) {
      calories = weightValue * 110;
      protein = weightValue * 1.8;
    } else if (ageInMonths < 12) {
      calories = weightValue * 100;
      protein = weightValue * 1.5;
    } else if (ageInMonths < 36) {
      calories = weightValue * 95;
      protein = weightValue * 1.2;
    } else if (ageInMonths < 72) {
      calories = weightValue * 90;
      protein = weightValue * 1.1;
    } else {
      calories = weightValue * 80;
      protein = weightValue * 1.0;
    }

    // 计算三大营养素
    const carbsCalories = calories * 0.55;
    const fatCalories = calories * 0.3;
    const carbs = carbsCalories / 4;
    const fat = fatCalories / 9;

    // 微量元素（根据年龄推荐）
    let calcium: number;
    let iron: number;
    let vitaminA: number;
    let vitaminC: number;

    if (ageInMonths < 6) {
      calcium = 200;
      iron = 0.3;
      vitaminA = 400;
      vitaminC = 40;
    } else if (ageInMonths < 12) {
      calcium = 250;
      iron = 10;
      vitaminA = 400;
      vitaminC = 50;
    } else if (ageInMonths < 48) {
      calcium = 600;
      iron = 9;
      vitaminA = 500;
      vitaminC = 60;
    } else {
      calcium = 800;
      iron = 10;
      vitaminA = 600;
      vitaminC = 70;
    }

    setResult({
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      calcium,
      iron,
      vitaminA,
      vitaminC,
    });
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '营养计算',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 输入区域 */}
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

            {/* 年龄输入 */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-neutral-700 mb-3">年龄</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    placeholder="请输入年龄"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="flex-row bg-neutral-100 rounded-xl p-1">
                  <TouchableOpacity
                    className={`px-4 py-2.5 rounded-lg ${
                      ageUnit === 'months' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => setAgeUnit('months')}
                  >
                    <Text className={`font-medium ${ageUnit === 'months' ? 'text-primary-400' : 'text-neutral-500'}`}>
                      月
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-4 py-2.5 rounded-lg ${
                      ageUnit === 'years' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => setAgeUnit('years')}
                  >
                    <Text className={`font-medium ${ageUnit === 'years' ? 'text-primary-400' : 'text-neutral-500'}`}>
                      岁
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Input
              label="体重 (kg)"
              placeholder="请输入体重"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              icon={<Weight size={20} color={Colors.neutral[400]} />}
              className="mb-5"
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={calculate}
              icon={<Calculator size={20} color="white" />}
            >
              计算营养需求
            </Button>
          </GradientCard>

          {/* 结果显示 */}
          {result && (
            <View>
              <Text className="text-lg font-bold text-neutral-800 mb-3">每日营养需求</Text>

              {/* 能量 */}
              <GradientCard variant="butter" className="p-5 mb-3">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white/60 rounded-full items-center justify-center">
                    <Flame size={24} color={Colors.butter.DEFAULT} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-neutral-600 text-sm">热量</Text>
                    <Text className="text-neutral-800 text-2xl font-bold">
                      {result.calories} kcal
                    </Text>
                  </View>
                </View>
              </GradientCard>

              {/* 三大营养素 */}
              <View className="flex-row gap-3 mb-3">
                <GradientCard variant="rose" className="flex-1 p-4">
                  <Text className="text-neutral-700 text-sm">蛋白质</Text>
                  <Text className="text-neutral-800 text-xl font-bold mt-1">{result.protein}g</Text>
                </GradientCard>
                <GradientCard variant="mint" className="flex-1 p-4">
                  <Text className="text-neutral-700 text-sm">碳水</Text>
                  <Text className="text-neutral-800 text-xl font-bold mt-1">{result.carbs}g</Text>
                </GradientCard>
                <GradientCard variant="sky" className="flex-1 p-4">
                  <Text className="text-neutral-700 text-sm">脂肪</Text>
                  <Text className="text-neutral-800 text-xl font-bold mt-1">{result.fat}g</Text>
                </GradientCard>
              </View>

              {/* 微量元素 */}
              <GradientCard variant="white" className="p-5">
                <Text className="text-neutral-800 font-bold text-base mb-3">微量元素</Text>
                <View className="flex-row flex-wrap gap-3">
                  <View className="bg-mint-light rounded-xl p-3 min-w-[45%] flex-1">
                    <Text className="text-neutral-700 text-sm">钙</Text>
                    <Text className="text-neutral-800 font-bold mt-0.5">{result.calcium}mg</Text>
                  </View>
                  <View className="bg-rose-light rounded-xl p-3 min-w-[45%] flex-1">
                    <Text className="text-neutral-700 text-sm">铁</Text>
                    <Text className="text-neutral-800 font-bold mt-0.5">{result.iron}mg</Text>
                  </View>
                  <View className="bg-lavender-light rounded-xl p-3 min-w-[45%] flex-1">
                    <Text className="text-neutral-700 text-sm">维生素A</Text>
                    <Text className="text-neutral-800 font-bold mt-0.5">{result.vitaminA}μg</Text>
                  </View>
                  <View className="bg-butter-light rounded-xl p-3 min-w-[45%] flex-1">
                    <Text className="text-neutral-700 text-sm">维生素C</Text>
                    <Text className="text-neutral-800 font-bold mt-0.5">{result.vitaminC}mg</Text>
                  </View>
                </View>
              </GradientCard>
            </View>
          )}

          {/* 提示 */}
          <GradientCard variant="lavender" className="p-4 mt-5">
            <Text className="text-neutral-700 text-sm leading-5">
              * 以上数据根据《中国居民膳食营养素参考摄入量》计算，仅供参考。实际营养需求因个体差异、活动量等因素有所不同。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
