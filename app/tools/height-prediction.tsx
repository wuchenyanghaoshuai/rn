/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 身高预测工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Ruler } from 'lucide-react-native';
import { Input, Button, GradientCard, Radio } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

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

    let predicted: number;
    if (gender === 'male') {
      predicted = (father + mother + 13) / 2;
    } else {
      predicted = (father + mother - 13) / 2;
    }

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
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '身高预测',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          <GradientCard variant="mint" className="p-5 mb-5">
            <View className="flex-row items-center mb-2">
              <TrendingUp size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">科学预测身高</Text>
            </View>
            <Text className="text-neutral-700 text-sm leading-5">
              根据父母身高，使用国际通用的 FPH 公式预测孩子成年后的身高范围。
            </Text>
          </GradientCard>

          <GradientCard variant="white" className="p-5">
            <View className="mb-4">
              <Text className="text-sm font-medium text-neutral-700 mb-3">孩子性别</Text>
              <View className="flex-row gap-3">
                <Radio selected={gender === 'male'} onSelect={() => setGender('male')} label="男孩" className="flex-1" />
                <Radio selected={gender === 'female'} onSelect={() => setGender('female')} label="女孩" className="flex-1" />
              </View>
            </View>

            <Input label="父亲身高 (cm)" placeholder="请输入父亲身高" value={fatherHeight} onChangeText={setFatherHeight} keyboardType="decimal-pad" icon={<Ruler size={20} color={Colors.neutral[400]} />} className="mb-4" />
            <Input label="母亲身高 (cm)" placeholder="请输入母亲身高" value={motherHeight} onChangeText={setMotherHeight} keyboardType="decimal-pad" icon={<Ruler size={20} color={Colors.neutral[400]} />} className="mb-5" />

            <View className="flex-row gap-3">
              <Button variant="primary" size="lg" onPress={calculateHeight} icon={<TrendingUp size={20} color="white" />} className="flex-1">开始预测</Button>
              <Button variant="outline" size="lg" onPress={reset}>重置</Button>
            </View>
          </GradientCard>

          {result && (
            <GradientCard variant="sky" className="p-5 mt-5">
              <Text className="text-neutral-800 font-bold text-lg mb-4">预测结果</Text>
              <View className="items-center py-4">
                <Text className="text-neutral-600 text-sm mb-2">预测成年身高</Text>
                <Text className="text-primary-400 font-bold text-5xl mb-1">{result.predicted}</Text>
                <Text className="text-neutral-600 text-lg">厘米 (cm)</Text>
              </View>
              <View className="bg-white/60 rounded-xl p-4 mt-3">
                <Text className="text-neutral-700 text-sm text-center">
                  身高范围：<Text className="font-semibold">{result.range[0]} - {result.range[1]} cm</Text>
                </Text>
                <Text className="text-neutral-600 text-xs text-center mt-2">±5cm 的浮动范围属于正常</Text>
              </View>
            </GradientCard>
          )}

          <GradientCard variant="butter" className="p-4 mt-5">
            <Text className="text-neutral-800 font-semibold mb-2">📌 温馨提示</Text>
            <Text className="text-neutral-700 text-sm leading-5">
              身高预测结果仅供参考，实际身高受遗传、营养、运动、睡眠等多种因素影响。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
