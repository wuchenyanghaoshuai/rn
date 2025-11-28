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

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
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
    let color: string;
    let advice: string;

    if (bmi < 18.5) {
      category = '偏瘦';
      color = '#3b82f6';
      advice = '建议适当增加营养摄入，保证蛋白质、碳水化合物的均衡摄入，同时进行适度的力量训练。';
    } else if (bmi < 24) {
      category = '正常';
      color = '#22c55e';
      advice = '体重在正常范围内，继续保持健康的饮食习惯和规律的运动。';
    } else if (bmi < 28) {
      category = '偏重';
      color = '#f59e0b';
      advice = '建议控制饮食热量摄入，减少高糖高脂食物，增加有氧运动，每周至少150分钟中等强度运动。';
    } else {
      category = '肥胖';
      color = '#ef4444';
      advice = '建议在医生指导下制定科学的减重计划，控制饮食、规律运动，必要时寻求专业帮助。';
    }

    setResult({
      bmi: bmiRounded,
      category,
      color,
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
    { label: '偏瘦', range: '< 18.5', color: '#3b82f6' },
    { label: '正常', range: '18.5 - 23.9', color: '#22c55e' },
    { label: '偏重', range: '24 - 27.9', color: '#f59e0b' },
    { label: '肥胖', range: '≥ 28', color: '#ef4444' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'BMI计算' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {/* 身高输入 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">身高 (cm)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入身高"
                placeholderTextColor="#9ca3af"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                maxLength={5}
              />
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
                maxLength={5}
              />
            </View>

            {/* 年龄输入（可选） */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">年龄（可选）</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入年龄"
                placeholderTextColor="#9ca3af"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* 计算按钮 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
                onPress={reset}
              >
                <Text className="text-gray-600 font-medium">重置</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-2 bg-primary-500 py-4 rounded-xl items-center px-8"
                onPress={calculateBMI}
              >
                <Text className="text-white font-semibold">开始计算</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 结果显示 */}
          {result && (
            <View className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
              <View className="items-center">
                <Text className="text-gray-500">您的BMI指数</Text>
                <Text
                  className="text-5xl font-bold mt-2"
                  style={{ color: result.color }}
                >
                  {result.bmi}
                </Text>
                <View
                  className="px-4 py-1 rounded-full mt-2"
                  style={{ backgroundColor: `${result.color}20` }}
                >
                  <Text style={{ color: result.color }} className="font-medium">
                    {result.category}
                  </Text>
                </View>
              </View>

              <View className="mt-6 pt-4 border-t border-gray-100">
                <Text className="text-gray-600 font-medium mb-2">健康建议</Text>
                <Text className="text-gray-500 leading-6">{result.advice}</Text>
              </View>
            </View>
          )}

          {/* BMI 参考表 */}
          <View className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold mb-4">BMI 参考标准</Text>
            <View className="gap-2">
              {bmiRanges.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-gray-700">{item.label}</Text>
                  </View>
                  <Text className="text-gray-500">{item.range}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 计算公式 */}
          <View className="mt-6 bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
              <Text className="text-gray-600 font-medium ml-2">计算公式</Text>
            </View>
            <Text className="text-gray-500 mt-2">
              BMI = 体重 (kg) ÷ 身高 (m)²
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              * 以上标准适用于成人，儿童BMI评估需参考年龄别BMI曲线
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
