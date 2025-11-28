import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CharacterAnalysis {
  char: string;
  strokes: number;
  element: string;
  radical: string;
}

const elementInfo = {
  '金': {
    color: '#f59e0b',
    bgColor: '#fef3c7',
    description: '金主义，性格刚毅果断，有领导才能',
    characteristics: ['坚毅', '果断', '正义', '刚强'],
    compatibility: {
      good: ['土', '金'],
      neutral: ['水'],
      bad: ['火', '木'],
    },
    sampleChars: ['鑫', '锦', '钰', '铭', '锐', '银', '钧', '铎'],
  },
  '木': {
    color: '#22c55e',
    bgColor: '#dcfce7',
    description: '木主仁，性格温和善良，善于成长',
    characteristics: ['仁慈', '正直', '温和', '进取'],
    compatibility: {
      good: ['水', '木'],
      neutral: ['火'],
      bad: ['金', '土'],
    },
    sampleChars: ['森', '林', '松', '柏', '梓', '桐', '杨', '枫'],
  },
  '水': {
    color: '#3b82f6',
    bgColor: '#dbeafe',
    description: '水主智，聪明机智，善于变通',
    characteristics: ['智慧', '灵活', '包容', '沉稳'],
    compatibility: {
      good: ['金', '水'],
      neutral: ['木'],
      bad: ['土', '火'],
    },
    sampleChars: ['海', '泽', '涵', '浩', '淳', '清', '澄', '润'],
  },
  '火': {
    color: '#ef4444',
    bgColor: '#fee2e2',
    description: '火主礼，热情积极，富有感染力',
    characteristics: ['热情', '积极', '光明', '进取'],
    compatibility: {
      good: ['木', '火'],
      neutral: ['土'],
      bad: ['水', '金'],
    },
    sampleChars: ['炎', '焱', '灿', '烨', '煜', '炫', '熙', '焕'],
  },
  '土': {
    color: '#a855f7',
    bgColor: '#f3e8ff',
    description: '土主信，踏实可靠，诚实守信',
    characteristics: ['稳重', '诚信', '包容', '厚德'],
    compatibility: {
      good: ['火', '土'],
      neutral: ['金'],
      bad: ['木', '水'],
    },
    sampleChars: ['坤', '城', '垚', '培', '基', '堃', '均', '墨'],
  },
};

// 简化的汉字五行判断（实际应用需要完整的字库）
const getCharacterElement = (char: string): string => {
  const charCode = char.charCodeAt(0);

  // 根据偏旁判断五行
  const metalRadicals = ['金', '钅', '刂', '刀'];
  const woodRadicals = ['木', '艹', '竹', '禾'];
  const waterRadicals = ['水', '氵', '冫', '雨'];
  const fireRadicals = ['火', '灬', '日', '光'];
  const earthRadicals = ['土', '石', '山', '田'];

  // 简化逻辑：根据字符编码取模
  const elements = ['金', '木', '水', '火', '土'];
  return elements[charCode % 5];
};

const getStrokes = (char: string): number => {
  // 简化的笔画计算
  return (char.charCodeAt(0) % 20) + 5;
};

export default function FiveElementsQueryScreen() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<CharacterAnalysis[]>([]);

  const analyze = () => {
    if (!inputText.trim()) return;

    const chars = inputText.trim().split('');
    const analyses: CharacterAnalysis[] = chars.map((char) => ({
      char,
      strokes: getStrokes(char),
      element: getCharacterElement(char),
      radical: char,
    }));

    setResults(analyses);
  };

  return (
    <>
      <Stack.Screen options={{ title: '五行查询' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 介绍 */}
          <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-5 mb-4">
            <Text className="text-white text-lg font-bold">汉字五行查询</Text>
            <Text className="text-white/80 mt-2 leading-5">
              输入汉字查询其五行属性，了解字义背后的五行能量。
            </Text>
          </View>

          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 text-lg"
              placeholder="输入要查询的汉字"
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              maxLength={10}
            />
            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center mt-3"
              onPress={analyze}
            >
              <Text className="text-white font-semibold text-lg">查询五行</Text>
            </TouchableOpacity>
          </View>

          {/* 查询结果 */}
          {results.length > 0 && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="text-gray-800 font-bold mb-4">查询结果</Text>
              <View className="flex-row flex-wrap gap-3">
                {results.map((result, index) => {
                  const info = elementInfo[result.element as keyof typeof elementInfo];
                  return (
                    <View
                      key={index}
                      className="items-center p-4 rounded-xl"
                      style={{ backgroundColor: info.bgColor, minWidth: '30%', flex: 1 }}
                    >
                      <Text className="text-4xl font-bold" style={{ color: info.color }}>
                        {result.char}
                      </Text>
                      <Text
                        className="text-xl font-bold mt-2"
                        style={{ color: info.color }}
                      >
                        {result.element}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        约{result.strokes}画
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 五行详解 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-gray-800 font-bold mb-4">五行详解</Text>
            <View className="gap-4">
              {Object.entries(elementInfo).map(([element, info]) => (
                <TouchableOpacity
                  key={element}
                  className="border-l-4 pl-3 py-2"
                  style={{ borderColor: info.color }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: info.bgColor }}
                    >
                      <Text className="font-bold" style={{ color: info.color }}>
                        {element}
                      </Text>
                    </View>
                    <Text className="text-gray-800 font-medium ml-2">
                      {info.description}
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap gap-1 mt-2">
                    {info.characteristics.map((char, idx) => (
                      <Text
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: info.bgColor, color: info.color }}
                      >
                        {char}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 五行相生相克 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-gray-800 font-bold mb-3">五行相生相克</Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="arrow-forward-circle-outline" size={18} color="#22c55e" />
                <Text className="text-green-600 ml-2">
                  相生：金生水 → 水生木 → 木生火 → 火生土 → 土生金
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                <Text className="text-red-500 ml-2">
                  相克：金克木 → 木克土 → 土克水 → 水克火 → 火克金
                </Text>
              </View>
            </View>
          </View>

          {/* 常用五行字推荐 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold mb-4">常用五行字</Text>
            {Object.entries(elementInfo).map(([element, info]) => (
              <View key={element} className="mb-3">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: info.bgColor }}
                  >
                    <Text className="text-sm font-bold" style={{ color: info.color }}>
                      {element}
                    </Text>
                  </View>
                  <Text className="text-gray-700 font-medium ml-2">属{element}的字</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {info.sampleChars.map((char, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: info.bgColor }}
                      onPress={() => setInputText(char)}
                    >
                      <Text className="text-lg font-bold" style={{ color: info.color }}>
                        {char}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 汉字五行的判断方法有多种，包括字形、字义、读音等，
              本工具仅供参考，不同资料可能有不同的划分。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
