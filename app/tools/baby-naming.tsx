import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    <>
      <Stack.Screen options={{ title: '宝宝起名' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 输入区域 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
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
                  <Ionicons
                    name="male"
                    size={20}
                    color={gender === 'male' ? '#fff' : '#6b7280'}
                  />
                  <Text
                    className={`mt-1 ${
                      gender === 'male' ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    男宝
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center ${
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
                    className={`mt-1 ${
                      gender === 'female' ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    女宝
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 风格选择 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">起名风格</Text>
              <View className="flex-row gap-2">
                {styles.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      style === s.id ? 'bg-primary-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setStyle(s.id as any)}
                  >
                    <Ionicons
                      name={s.icon as any}
                      size={18}
                      color={style === s.id ? '#fff' : '#6b7280'}
                    />
                    <Text
                      className={`text-xs mt-1 ${
                        style === s.id ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 生成按钮 */}
            <TouchableOpacity
              className={`bg-primary-500 py-4 rounded-xl items-center ${
                isGenerating ? 'opacity-70' : ''
              }`}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">开始起名</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 结果列表 */}
          {results.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">推荐好名</Text>
              {results.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-800">
                      {result.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#f59e0b" />
                      <Text className="text-amber-500 font-bold ml-1">
                        {result.score}分
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 mt-2">{result.meaning}</Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-secondary-50 px-2 py-1 rounded">
                      <Text className="text-secondary-600 text-xs">
                        五行：{result.elements}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 提示信息 */}
          <View className="mt-6 bg-amber-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text className="text-amber-700 font-medium ml-2">温馨提示</Text>
            </View>
            <Text className="text-amber-600 text-sm mt-2 leading-5">
              起名仅供参考，好名字需结合宝宝的生辰八字、家族辈分等因素综合考虑。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
