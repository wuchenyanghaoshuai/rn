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

export default function HeightPredictionScreen() {
  const [fatherHeight, setFatherHeight] = useState('');
  const [motherHeight, setMotherHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{
    predicted: number;
    range: [number, number];
  } | null>(null);

  const calculateHeight = () => {
    const father = parseFloat(fatherHeight);
    const mother = parseFloat(motherHeight);

    if (isNaN(father) || isNaN(mother)) {
      Alert.alert('提示', '请输入正确的身高数值');
      return;
    }

    if (father < 140 || father > 220 || mother < 130 || mother > 200) {
      Alert.alert('提示', '请输入合理的身高范围');
      return;
    }

    // 使用 FPH (Father-Plus-Mother) 公式
    let predicted: number;
    if (gender === 'male') {
      // 男孩 = (父亲身高 + 母亲身高 + 13) / 2
      predicted = (father + mother + 13) / 2;
    } else {
      // 女孩 = (父亲身高 + 母亲身高 - 13) / 2
      predicted = (father + mother - 13) / 2;
    }

    // ±5cm 的误差范围
    setResult({
      predicted: Math.round(predicted * 10) / 10,
      range: [Math.round((predicted - 5) * 10) / 10, Math.round((predicted + 5) * 10) / 10],
    });
  };

  const reset = () => {
    setFatherHeight('');
    setMotherHeight('');
    setResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: '身高预测' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 说明卡片 */}
          <View className="bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="analytics-outline" size={24} color="#fff" />
              <Text className="text-white text-lg font-bold ml-2">科学预测身高</Text>
            </View>
            <Text className="text-white/80 mt-2 text-sm leading-5">
              根据父母身高，使用国际通用的 FPH 公式预测孩子成年后的身高范围。
            </Text>
          </View>

          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {/* 性别选择 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">孩子性别</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                    gender === 'male' ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setGender('male')}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={gender === 'male' ? '#fff' : '#6b7280'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      gender === 'male' ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    男孩
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                    gender === 'female' ? 'bg-pink-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setGender('female')}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={gender === 'female' ? '#fff' : '#6b7280'}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      gender === 'female' ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    女孩
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 父亲身高 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">父亲身高 (cm)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入父亲身高"
                placeholderTextColor="#9ca3af"
                value={fatherHeight}
                onChangeText={setFatherHeight}
                keyboardType="decimal-pad"
                maxLength={5}
              />
            </View>

            {/* 母亲身高 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">母亲身高 (cm)</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入母亲身高"
                placeholderTextColor="#9ca3af"
                value={motherHeight}
                onChangeText={setMotherHeight}
                keyboardType="decimal-pad"
                maxLength={5}
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
                onPress={calculateHeight}
              >
                <Text className="text-white font-semibold">计算预测</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 结果显示 */}
          {result && (
            <View className="mt-6 bg-white rounded-2xl p-6 shadow-sm items-center">
              <Text className="text-gray-500">预测成年身高</Text>
              <View className="flex-row items-end mt-2">
                <Text className="text-5xl font-bold text-primary-500">
                  {result.predicted}
                </Text>
                <Text className="text-xl text-gray-400 mb-2 ml-1">cm</Text>
              </View>
              <View className="bg-gray-50 rounded-xl px-4 py-2 mt-4">
                <Text className="text-gray-500">
                  预测范围：{result.range[0]} - {result.range[1]} cm
                </Text>
              </View>

              <View className="w-full mt-6 pt-4 border-t border-gray-100">
                <Text className="text-gray-400 text-sm text-center leading-5">
                  * 预测结果仅供参考，实际身高受遗传、营养、运动、睡眠等多种因素影响
                </Text>
              </View>
            </View>
          )}

          {/* 计算公式说明 */}
          <View className="mt-6 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="calculator-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-700 font-medium ml-2">计算公式</Text>
            </View>
            <View className="mt-3">
              <Text className="text-blue-600 text-sm">
                男孩身高 = (父身高 + 母身高 + 13) ÷ 2
              </Text>
              <Text className="text-blue-600 text-sm mt-1">
                女孩身高 = (父身高 + 母身高 - 13) ÷ 2
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
