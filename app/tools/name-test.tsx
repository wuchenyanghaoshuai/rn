/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 姓名测试工具 - 方案A设计系统重构版
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
import { Sparkles, Lightbulb } from 'lucide-react-native';
import { Input, Button, GradientCard, Radio } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface NameAnalysis {
  totalScore: number;
  fiveElementsScore: number;
  soundScore: number;
  meaningScore: number;
  structureScore: number;
  fiveElements: string;
  soundAnalysis: string;
  meaningAnalysis: string;
  structureAnalysis: string;
  suggestions: string[];
}

export default function NameTestScreen() {
  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<NameAnalysis | null>(null);

  const analyzeCharacter = (char: string) => {
    const code = char.charCodeAt(0);
    const strokeCount = (code % 20) + 5;
    const elements = ['金', '木', '水', '火', '土'];
    const element = elements[strokeCount % 5];
    return { strokeCount, element };
  };

  const analyze = () => {
    if (!surname.trim() || !givenName.trim()) {
      Alert.alert('提示', '请输入完整的姓名');
      return;
    }

    const fullName = surname + givenName;
    const charAnalyses = fullName.split('').map(analyzeCharacter);
    const totalStrokes = charAnalyses.reduce((sum, a) => sum + a.strokeCount, 0);
    const elements = charAnalyses.map(a => a.element).join('、');

    const baseScore = 60 + (totalStrokes % 30);
    const fiveElementsScore = 65 + Math.floor(Math.random() * 25);
    const soundScore = 70 + Math.floor(Math.random() * 20);
    const meaningScore = 75 + Math.floor(Math.random() * 20);
    const structureScore = 68 + Math.floor(Math.random() * 22);

    const totalScore = Math.round(
      (fiveElementsScore + soundScore + meaningScore + structureScore) / 4
    );

    const soundAnalyses = [
      '声调搭配和谐，朗朗上口',
      '音韵优美，富有节奏感',
      '发音清晰，易于记忆',
      '声音响亮，给人积极印象',
    ];

    const meaningAnalyses = [
      '寓意美好，包含父母的期望',
      '字义积极向上，富有内涵',
      '蕴含深厚的文化底蕴',
      '表达了对孩子未来的美好祝愿',
    ];

    const structureAnalyses = [
      '笔画搭配均衡，书写美观',
      '结构协调，视觉效果佳',
      '字形端正，给人稳重感',
      '笔画适中，便于书写',
    ];

    const suggestions = [
      '整体来看是一个不错的名字',
      '可以考虑五行平衡来进一步优化',
      '建议查阅专业命理师意见',
    ];

    setResult({
      totalScore,
      fiveElementsScore,
      soundScore,
      meaningScore,
      structureScore,
      fiveElements: elements,
      soundAnalysis: soundAnalyses[Math.floor(Math.random() * soundAnalyses.length)],
      meaningAnalysis: meaningAnalyses[Math.floor(Math.random() * meaningAnalyses.length)],
      structureAnalysis: structureAnalyses[Math.floor(Math.random() * structureAnalyses.length)],
      suggestions,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return Colors.mint.DEFAULT;
    if (score >= 70) return Colors.butter.DEFAULT;
    return Colors.rose.DEFAULT;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    return '一般';
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '姓名测试',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 输入区域 */}
          <GradientCard variant="white" className="p-5">
            <Text className="text-neutral-800 font-bold text-lg mb-4">输入姓名</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-neutral-700 mb-3">性别</Text>
              <View className="flex-row gap-3">
                <Radio
                  selected={gender === 'male'}
                  onSelect={() => setGender('male')}
                  label="男"
                  className="flex-1"
                />
                <Radio
                  selected={gender === 'female'}
                  onSelect={() => setGender('female')}
                  label="女"
                  className="flex-1"
                />
              </View>
            </View>

            <Input
              label="姓氏"
              placeholder="请输入姓氏"
              value={surname}
              onChangeText={setSurname}
              maxLength={2}
              className="mb-4"
            />

            <Input
              label="名字"
              placeholder="请输入名字"
              value={givenName}
              onChangeText={setGivenName}
              maxLength={2}
              className="mb-5"
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={analyze}
              icon={<Sparkles size={20} color="white" />}
            >
              开始测试
            </Button>
          </GradientCard>

          {/* 结果显示 */}
          {result && (
            <>
              {/* 总分 */}
              <GradientCard variant="lavender" className="p-6 mt-5 items-center">
                <Text className="text-neutral-600 mb-2">综合评分</Text>
                <Text
                  className="text-6xl font-bold"
                  style={{ color: getScoreColor(result.totalScore) }}
                >
                  {result.totalScore}
                </Text>
                <View
                  className="px-4 py-1 rounded-full mt-2 bg-white/60"
                >
                  <Text
                    className="font-medium"
                    style={{ color: getScoreColor(result.totalScore) }}
                  >
                    {getScoreLabel(result.totalScore)}
                  </Text>
                </View>
                <Text className="text-neutral-700 mt-3">
                  {surname}{givenName} · 五行：{result.fiveElements}
                </Text>
              </GradientCard>

              {/* 详细得分 */}
              <GradientCard variant="white" className="p-5 mt-5">
                <Text className="text-neutral-800 font-bold text-base mb-4">详细分析</Text>

                {[
                  { label: '五行得分', score: result.fiveElementsScore, desc: result.fiveElements },
                  { label: '音韵得分', score: result.soundScore, desc: result.soundAnalysis },
                  { label: '寓意得分', score: result.meaningScore, desc: result.meaningAnalysis },
                  { label: '结构得分', score: result.structureScore, desc: result.structureAnalysis },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="py-3 border-b border-neutral-100 last:border-b-0"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-neutral-800 font-medium">{item.label}</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: getScoreColor(item.score) }}
                      >
                        {item.score}分
                      </Text>
                    </View>
                    <Text className="text-neutral-600 text-sm mt-1">{item.desc}</Text>
                  </View>
                ))}
              </GradientCard>

              {/* 建议 */}
              <GradientCard variant="butter" className="p-4 mt-5">
                <View className="flex-row items-center mb-2">
                  <Lightbulb size={20} color={Colors.neutral[700]} />
                  <Text className="text-neutral-800 font-semibold ml-2">温馨提示</Text>
                </View>
                {result.suggestions.map((suggestion, index) => (
                  <Text key={index} className="text-neutral-700 text-sm leading-5 mt-1">
                    • {suggestion}
                  </Text>
                ))}
              </GradientCard>
            </>
          )}

          {/* 说明 */}
          <GradientCard variant="lavender" className="p-4 mt-5">
            <Text className="text-neutral-700 text-sm leading-5">
              * 姓名测试仅供娱乐参考，不具有科学依据。名字的好坏更多在于父母的期望和祝福。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
