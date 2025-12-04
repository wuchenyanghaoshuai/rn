/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 宝宝起名工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Baby } from 'lucide-react-native';
import { Input, Button, GradientCard, Radio, Divider } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface NameResult {
  name: string;
  meaning: string;
  score: number;
  elements: string;
}

export default function BabyNamingScreen() {
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [style, setStyle] = useState<'classic' | 'modern' | 'poetic'>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<NameResult[]>([]);

  const styles = [
    { id: 'classic', label: '经典大气', icon: 'library-outline' },
    { id: 'modern', label: '时尚简约', icon: 'sparkles-outline' },
    { id: 'poetic', label: '诗意唯美', icon: 'book-outline' },
  ];

  const handleGenerate = async () => {
    if (!surname.trim()) {
      Alert.alert('提示', '请输入姓氏');
      return;
    }

    setIsGenerating(true);

    // 模拟生成过程
    setTimeout(() => {
      const mockResults: NameResult[] = [
        {
          name: `${surname}子轩`,
          meaning: '子意为孩子、后代，轩意为高远、轩昂',
          score: 95,
          elements: '金水木',
        },
        {
          name: `${surname}梓萱`,
          meaning: '梓为梓树，萱为忘忧草，寓意健康快乐',
          score: 92,
          elements: '木木木',
        },
        {
          name: `${surname}浩然`,
          meaning: '浩意为广大，然意为如此，寓意正气浩然',
          score: 90,
          elements: '水金火',
        },
        {
          name: `${surname}思颖`,
          meaning: '思意为思考，颖意为聪慧，寓意聪明伶俐',
          score: 88,
          elements: '金木木',
        },
        {
          name: `${surname}宇航`,
          meaning: '宇为宇宙，航为航行，寓意志向远大',
          score: 86,
          elements: '土水水',
        },
      ];
      setResults(mockResults);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '宝宝起名',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 输入卡片 */}
          <GradientCard variant="white" className="p-5 mb-5">
            {/* 姓氏输入 */}
            <Input
              label="姓氏"
              placeholder="请输入姓氏"
              value={surname}
              onChangeText={setSurname}
              maxLength={2}
              icon={<Baby size={20} color={Colors.neutral[400]} />}
              className="mb-4"
            />

            {/* 性别选择 */}
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

            {/* 风格选择 */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-neutral-700 mb-3">起名风格</Text>
              <View className="flex-row gap-2">
                {styles.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    className={`flex-1 py-3 px-2 rounded-xl items-center ${
                      style === s.id ? 'bg-primary-50 border-2 border-primary-400' : 'bg-neutral-100'
                    }`}
                    onPress={() => setStyle(s.id as any)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        style === s.id ? 'text-primary-400' : 'text-neutral-600'
                      }`}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 生成按钮 */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isGenerating}
              onPress={handleGenerate}
              icon={<Sparkles size={20} color="white" />}
            >
              开始起名
            </Button>
          </GradientCard>

          {/* 结果列表 */}
          {results.length > 0 && (
            <View>
              <Text className="text-lg font-bold text-neutral-800 mb-3">推荐好名</Text>
              {results.map((result, index) => (
                <GradientCard
                  key={index}
                  variant="white"
                  className="p-5 mb-3"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-neutral-800">
                      {result.name}
                    </Text>
                    <View className="bg-butter-light px-3 py-1 rounded-full">
                      <Text className="text-amber-700 font-bold">
                        {result.score}分
                      </Text>
                    </View>
                  </View>
                  <Text className="text-neutral-600 text-base leading-6 mb-3">
                    {result.meaning}
                  </Text>
                  <View className="bg-mint-light px-3 py-1.5 rounded-lg self-start">
                    <Text className="text-neutral-700 text-sm">
                      五行：{result.elements}
                    </Text>
                  </View>
                </GradientCard>
              ))}
            </View>
          )}

          {/* 提示信息 */}
          <GradientCard variant="butter" className="p-4 mt-4">
            <Text className="text-neutral-800 font-semibold mb-2">💡 温馨提示</Text>
            <Text className="text-neutral-700 text-sm leading-5">
              起名仅供参考，好名字需结合宝宝的生辰八字、家族辈分等因素综合考虑。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
