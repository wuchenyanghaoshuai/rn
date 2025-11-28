import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    <>
      <Stack.Screen options={{ title: '营养计算' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {/* 性别选择 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">性别</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center ${
                    gender === 'male' ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setGender('male')}
                >
                  <Text className={gender === 'male' ? 'text-white' : 'text-gray-600'}>
                    男宝
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center ${
                    gender === 'female' ? 'bg-pink-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setGender('female')}
                >
                  <Text className={gender === 'female' ? 'text-white' : 'text-gray-600'}>
                    女宝
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 年龄输入 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">年龄</Text>
              <View className="flex-row gap-3">
                <TextInput
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                  placeholder="请输入年龄"
                  placeholderTextColor="#9ca3af"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="decimal-pad"
                />
                <View className="flex-row bg-gray-100 rounded-xl p-1">
                  <TouchableOpacity
                    className={`px-3 py-2 rounded-lg ${
                      ageUnit === 'months' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => setAgeUnit('months')}
                  >
                    <Text className={ageUnit === 'months' ? 'text-primary-500' : 'text-gray-500'}>
                      月
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-3 py-2 rounded-lg ${
                      ageUnit === 'years' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => setAgeUnit('years')}
                  >
                    <Text className={ageUnit === 'years' ? 'text-primary-500' : 'text-gray-500'}>
                      岁
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 体重输入 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">体重 (kg)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入体重"
                placeholderTextColor="#9ca3af"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center"
              onPress={calculate}
            >
              <Text className="text-white font-semibold text-lg">计算营养需求</Text>
            </TouchableOpacity>
          </View>

          {/* 结果显示 */}
          {result && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">每日营养需求</Text>

              {/* 能量 */}
              <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                    <Ionicons name="flame-outline" size={20} color="#f97316" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-500 text-sm">热量</Text>
                    <Text className="text-gray-800 text-xl font-bold">
                      {result.calories} kcal
                    </Text>
                  </View>
                </View>
              </View>

              {/* 三大营养素 */}
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-500 text-sm">蛋白质</Text>
                  <Text className="text-red-500 text-xl font-bold">{result.protein}g</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-500 text-sm">碳水</Text>
                  <Text className="text-amber-500 text-xl font-bold">{result.carbs}g</Text>
                </View>
                <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                  <Text className="text-gray-500 text-sm">脂肪</Text>
                  <Text className="text-blue-500 text-xl font-bold">{result.fat}g</Text>
                </View>
              </View>

              {/* 微量元素 */}
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <Text className="text-gray-800 font-medium mb-3">微量元素</Text>
                <View className="flex-row flex-wrap gap-3">
                  <View className="bg-green-50 rounded-lg p-3 min-w-[45%] flex-1">
                    <Text className="text-green-600 text-sm">钙</Text>
                    <Text className="text-green-700 font-bold">{result.calcium}mg</Text>
                  </View>
                  <View className="bg-red-50 rounded-lg p-3 min-w-[45%] flex-1">
                    <Text className="text-red-600 text-sm">铁</Text>
                    <Text className="text-red-700 font-bold">{result.iron}mg</Text>
                  </View>
                  <View className="bg-purple-50 rounded-lg p-3 min-w-[45%] flex-1">
                    <Text className="text-purple-600 text-sm">维生素A</Text>
                    <Text className="text-purple-700 font-bold">{result.vitaminA}μg</Text>
                  </View>
                  <View className="bg-yellow-50 rounded-lg p-3 min-w-[45%] flex-1">
                    <Text className="text-yellow-600 text-sm">维生素C</Text>
                    <Text className="text-yellow-700 font-bold">{result.vitaminC}mg</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 提示 */}
          <View className="mt-6 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 以上数据根据《中国居民膳食营养素参考摄入量》计算，仅供参考。
              实际营养需求因个体差异、活动量等因素有所不同。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
