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
    // 简化的字符分析逻辑
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

    // 分析每个字
    const charAnalyses = fullName.split('').map(analyzeCharacter);
    const totalStrokes = charAnalyses.reduce((sum, a) => sum + a.strokeCount, 0);
    const elements = charAnalyses.map(a => a.element).join('、');

    // 计算各项得分 (简化版，实际应有更复杂的算法)
    const baseScore = 60 + (totalStrokes % 30);
    const fiveElementsScore = 65 + Math.floor(Math.random() * 25);
    const soundScore = 70 + Math.floor(Math.random() * 20);
    const meaningScore = 75 + Math.floor(Math.random() * 20);
    const structureScore = 68 + Math.floor(Math.random() * 22);

    const totalScore = Math.round(
      (fiveElementsScore + soundScore + meaningScore + structureScore) / 4
    );

    // 生成分析结果
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
    if (score >= 85) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    return '一般';
  };

  return (
    <>
      <Stack.Screen options={{ title: '姓名测试' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold text-lg mb-4">输入姓名</Text>

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
                    男
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center ${
                    gender === 'female' ? 'bg-pink-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setGender('female')}
                >
                  <Text className={gender === 'female' ? 'text-white' : 'text-gray-600'}>
                    女
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 姓氏输入 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">姓氏</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入姓氏"
                placeholderTextColor="#9ca3af"
                value={surname}
                onChangeText={setSurname}
                maxLength={2}
              />
            </View>

            {/* 名字输入 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">名字</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="请输入名字"
                placeholderTextColor="#9ca3af"
                value={givenName}
                onChangeText={setGivenName}
                maxLength={2}
              />
            </View>

            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center"
              onPress={analyze}
            >
              <Text className="text-white font-semibold text-lg">开始测试</Text>
            </TouchableOpacity>
          </View>

          {/* 结果显示 */}
          {result && (
            <>
              {/* 总分 */}
              <View className="mt-6 bg-white rounded-2xl p-6 shadow-sm items-center">
                <Text className="text-gray-500 mb-2">综合评分</Text>
                <Text
                  className="text-6xl font-bold"
                  style={{ color: getScoreColor(result.totalScore) }}
                >
                  {result.totalScore}
                </Text>
                <View
                  className="px-4 py-1 rounded-full mt-2"
                  style={{ backgroundColor: `${getScoreColor(result.totalScore)}20` }}
                >
                  <Text
                    className="font-medium"
                    style={{ color: getScoreColor(result.totalScore) }}
                  >
                    {getScoreLabel(result.totalScore)}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-3">
                  {surname}{givenName} · 五行：{result.fiveElements}
                </Text>
              </View>

              {/* 详细得分 */}
              <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-800 font-bold mb-4">详细分析</Text>

                {[
                  { label: '五行得分', score: result.fiveElementsScore, desc: result.fiveElements },
                  { label: '音韵得分', score: result.soundScore, desc: result.soundAnalysis },
                  { label: '寓意得分', score: result.meaningScore, desc: result.meaningAnalysis },
                  { label: '结构得分', score: result.structureScore, desc: result.structureAnalysis },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-700 font-medium">{item.label}</Text>
                      <Text
                        className="font-bold text-lg"
                        style={{ color: getScoreColor(item.score) }}
                      >
                        {item.score}分
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-sm mt-1">{item.desc}</Text>
                  </View>
                ))}
              </View>

              {/* 建议 */}
              <View className="mt-4 bg-amber-50 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
                  <Text className="text-amber-700 font-bold ml-2">温馨提示</Text>
                </View>
                {result.suggestions.map((suggestion, index) => (
                  <Text key={index} className="text-amber-600 text-sm leading-5 mt-1">
                    • {suggestion}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* 说明 */}
          <View className="mt-6 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 姓名测试仅供娱乐参考，不具有科学依据。名字的好坏更多在于父母的期望和祝福。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
