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

interface FiveElementsResult {
  element: string;
  needElements: string[];
  avoidElements: string[];
  suggestedNames: { name: string; meaning: string }[];
  elementAnalysis: string;
}

const fiveElementsData = {
  金: {
    color: '#f59e0b',
    complementary: ['土', '金'],
    avoid: ['火'],
    chars: ['鑫', '锦', '钰', '铭', '锐', '银', '镇', '钧', '铎', '锡'],
  },
  木: {
    color: '#22c55e',
    complementary: ['水', '木'],
    avoid: ['金'],
    chars: ['森', '林', '松', '柏', '梓', '桐', '杨', '枫', '栋', '楠'],
  },
  水: {
    color: '#3b82f6',
    complementary: ['金', '水'],
    avoid: ['土'],
    chars: ['海', '泽', '涵', '浩', '淳', '清', '澄', '润', '沛', '洋'],
  },
  火: {
    color: '#ef4444',
    complementary: ['木', '火'],
    avoid: ['水'],
    chars: ['炎', '焱', '灿', '烨', '煜', '炫', '熙', '焕', '炳', '煦'],
  },
  土: {
    color: '#a855f7',
    complementary: ['火', '土'],
    avoid: ['木'],
    chars: ['坤', '城', '垚', '培', '基', '堃', '均', '墨', '坚', '圣'],
  },
};

const nameMeanings: Record<string, string> = {
  鑫: '财富兴盛',
  锦: '前程似锦',
  钰: '珍贵美好',
  森: '茁壮成长',
  林: '繁茂昌盛',
  海: '胸怀广阔',
  泽: '润泽万物',
  炎: '热情洋溢',
  烨: '光辉灿烂',
  坤: '厚德载物',
};

export default function FiveElementsNamingScreen() {
  const [surname, setSurname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<FiveElementsResult | null>(null);

  const calculateElement = (year: number) => {
    const elements = ['金', '水', '木', '火', '土'];
    // 简化的年份五行计算
    const index = (year - 4) % 10;
    const elementIndex = Math.floor(index / 2);
    return elements[elementIndex];
  };

  const generate = () => {
    if (!surname.trim()) {
      Alert.alert('提示', '请输入姓氏');
      return;
    }

    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > 2100) {
      Alert.alert('提示', '请输入正确的出生年份');
      return;
    }

    const element = calculateElement(year);
    const elementData = fiveElementsData[element as keyof typeof fiveElementsData];

    // 生成推荐名字
    const suggestedNames: { name: string; meaning: string }[] = [];
    elementData.complementary.forEach((e) => {
      const chars = fiveElementsData[e as keyof typeof fiveElementsData].chars;
      const selectedChars = chars.slice(0, 3);
      selectedChars.forEach((char) => {
        suggestedNames.push({
          name: surname + char,
          meaning: nameMeanings[char] || '寓意美好',
        });
      });
    });

    setResult({
      element,
      needElements: elementData.complementary,
      avoidElements: elementData.avoid,
      suggestedNames: suggestedNames.slice(0, 6),
      elementAnalysis: getElementAnalysis(element),
    });
  };

  const getElementAnalysis = (element: string) => {
    const analyses: Record<string, string> = {
      金: '金代表坚毅、果断、正义。金命之人往往意志坚定，做事果断，有领导才能。',
      木: '木代表仁慈、正直、成长。木命之人通常善良温和，富有同情心，善于成长进步。',
      水: '水代表智慧、灵活、包容。水命之人聪明机智，善于变通，心胸宽广。',
      火: '火代表热情、积极、光明。火命之人热情洋溢，积极向上，富有感染力。',
      土: '土代表稳重、诚信、包容。土命之人踏实可靠，诚实守信，有责任心。',
    };
    return analyses[element] || '';
  };

  return (
    <>
      <Stack.Screen options={{ title: '五行起名' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 五行介绍 */}
          <View className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-5 mb-4">
            <Text className="text-white text-lg font-bold">五行起名</Text>
            <Text className="text-white/80 mt-2 leading-5">
              根据出生年份计算五行属性，结合五行相生相克原理，为宝宝选择五行平衡的好名字。
            </Text>
          </View>

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

            {/* 出生年份 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">出生年份</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                placeholder="如：2024"
                placeholderTextColor="#9ca3af"
                value={birthYear}
                onChangeText={setBirthYear}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center"
              onPress={generate}
            >
              <Text className="text-white font-semibold text-lg">开始起名</Text>
            </TouchableOpacity>
          </View>

          {/* 结果显示 */}
          {result && (
            <>
              {/* 五行分析 */}
              <View className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="planet-outline" size={24} color="#8b5cf6" />
                  <Text className="text-gray-800 font-bold ml-2 text-lg">五行分析</Text>
                </View>

                <View className="bg-purple-50 rounded-xl p-4 mb-4">
                  <Text className="text-purple-700 font-bold text-xl text-center">
                    五行属「{result.element}」
                  </Text>
                  <Text className="text-purple-600 text-center mt-2">
                    {result.elementAnalysis}
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1 bg-green-50 rounded-xl p-3">
                    <Text className="text-green-600 text-sm font-medium">宜用五行</Text>
                    <Text className="text-green-700 font-bold text-lg mt-1">
                      {result.needElements.join('、')}
                    </Text>
                  </View>
                  <View className="flex-1 bg-red-50 rounded-xl p-3">
                    <Text className="text-red-600 text-sm font-medium">慎用五行</Text>
                    <Text className="text-red-700 font-bold text-lg mt-1">
                      {result.avoidElements.join('、')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 推荐名字 */}
              <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-800 font-bold mb-4">推荐名字</Text>
                <View className="gap-3">
                  {result.suggestedNames.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4"
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
                          <Text className="text-primary-500 font-bold">{index + 1}</Text>
                        </View>
                        <Text className="text-gray-800 font-bold text-xl ml-3">
                          {item.name}
                        </Text>
                      </View>
                      <Text className="text-gray-500">{item.meaning}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* 五行相生相克图 */}
          <View className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold mb-4">五行相生相克</Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-green-600 leading-6">
                相生：金生水 → 水生木 → 木生火 → 火生土 → 土生金
              </Text>
              <Text className="text-red-500 leading-6 mt-2">
                相克：金克木 → 木克土 → 土克水 → 水克火 → 火克金
              </Text>
            </View>
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 五行起名仅供参考，建议结合专业命理师意见。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
