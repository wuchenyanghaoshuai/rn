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

interface PoetryName {
  name: string;
  source: string;
  poem: string;
  meaning: string;
}

const poetryNames: { male: PoetryName[]; female: PoetryName[] } = {
  male: [
    {
      name: '思齐',
      source: '《诗经·文王之什》',
      poem: '思齐大任，文王之母',
      meaning: '思虑周全，品德高尚',
    },
    {
      name: '维桢',
      source: '《诗经·大雅》',
      poem: '王国克生，维周之桢',
      meaning: '国家栋梁，坚贞不屈',
    },
    {
      name: '浩然',
      source: '《孟子》',
      poem: '吾善养吾浩然之气',
      meaning: '正气凛然，胸怀坦荡',
    },
    {
      name: '博文',
      source: '《论语》',
      poem: '君子博学于文，约之以礼',
      meaning: '学识渊博，知书达礼',
    },
    {
      name: '致远',
      source: '《诫子书》',
      poem: '非淡泊无以明志，非宁静无以致远',
      meaning: '志存高远，宁静致远',
    },
    {
      name: '子衿',
      source: '《诗经·郑风》',
      poem: '青青子衿，悠悠我心',
      meaning: '青春朝气，令人思慕',
    },
    {
      name: '星辰',
      source: '《夜泊牛渚怀古》',
      poem: '危楼高百尺，手可摘星辰',
      meaning: '志向远大，追求卓越',
    },
    {
      name: '云帆',
      source: '《行路难》',
      poem: '长风破浪会有时，直挂云帆济沧海',
      meaning: '乘风破浪，勇往直前',
    },
  ],
  female: [
    {
      name: '婉清',
      source: '《诗经·郑风》',
      poem: '有美一人，清扬婉兮',
      meaning: '温婉清雅，美丽动人',
    },
    {
      name: '静姝',
      source: '《诗经·邶风》',
      poem: '静女其姝，俟我于城隅',
      meaning: '文静美好，温柔贤淑',
    },
    {
      name: '燕婉',
      source: '《诗经·邶风》',
      poem: '燕婉之求，得此戚施',
      meaning: '美丽温顺，和婉可人',
    },
    {
      name: '舒窈',
      source: '《诗经·陈风》',
      poem: '月出皎兮，佼人僚兮，舒窈纠兮',
      meaning: '身姿曼妙，优雅动人',
    },
    {
      name: '如玉',
      source: '《诗经·小雅》',
      poem: '言念君子，温其如玉',
      meaning: '温润如玉，品性高洁',
    },
    {
      name: '嘉卉',
      source: '《诗经·小雅》',
      poem: '山有嘉卉，侯栗侯梅',
      meaning: '美丽芬芳，如花似玉',
    },
    {
      name: '晴岚',
      source: '《山中》',
      poem: '晴岚暖翠忽然无，淡烟疏雨自相扶',
      meaning: '清新明丽，如诗如画',
    },
    {
      name: '若兮',
      source: '《洛神赋》',
      poem: '翩若惊鸿，婉若游龙',
      meaning: '轻盈灵动，飘逸若仙',
    },
  ],
};

export default function PoetryNamingScreen() {
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [style, setStyle] = useState<'classic' | 'elegant' | 'fresh'>('classic');
  const [results, setResults] = useState<PoetryName[]>([]);

  const styles = [
    { id: 'classic', name: '经典诗经', icon: 'book-outline' },
    { id: 'elegant', name: '唐诗宋词', icon: 'flower-outline' },
    { id: 'fresh', name: '清新文艺', icon: 'leaf-outline' },
  ];

  const generate = () => {
    const names = poetryNames[gender];
    // 随机选择6个名字
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setResults(shuffled.slice(0, 6));
  };

  return (
    <>
      <Stack.Screen options={{ title: '诗词起名' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 介绍横幅 */}
          <View className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 mb-4">
            <Text className="text-white text-lg font-bold">诗词起名</Text>
            <Text className="text-white/80 mt-2 leading-5">
              从经典诗词中撷取灵感，为宝宝取一个富有文化底蕴的好名字。
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

            {/* 风格选择 */}
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">诗词风格</Text>
              <View className="flex-row gap-2">
                {styles.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                      style === s.id ? 'bg-primary-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setStyle(s.id as any)}
                  >
                    <Ionicons
                      name={s.icon as any}
                      size={16}
                      color={style === s.id ? '#fff' : '#6b7280'}
                    />
                    <Text
                      className={`ml-1 text-sm ${
                        style === s.id ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-xl items-center"
              onPress={generate}
            >
              <Text className="text-white font-semibold text-lg">生成名字</Text>
            </TouchableOpacity>
          </View>

          {/* 结果显示 */}
          {results.length > 0 && (
            <View className="mt-6">
              <Text className="text-gray-800 font-bold text-lg mb-3">推荐名字</Text>
              <View className="gap-3">
                {results.map((item, index) => (
                  <View
                    key={index}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-gray-800 font-bold text-2xl">
                        {surname}{item.name}
                      </Text>
                      <TouchableOpacity className="bg-primary-50 px-3 py-1 rounded-full">
                        <Text className="text-primary-500 text-sm">收藏</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="bg-rose-50 rounded-xl p-3 mb-3">
                      <Text className="text-rose-700 italic leading-6">
                        「{item.poem}」
                      </Text>
                      <Text className="text-rose-500 text-sm mt-1">
                        —— {item.source}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons name="heart-outline" size={16} color="#9ca3af" />
                      <Text className="text-gray-500 text-sm ml-1">
                        寓意：{item.meaning}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 诗词名句推荐 */}
          <View className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold mb-4">经典起名诗句</Text>
            <View className="gap-3">
              {[
                { poem: '青青子衿，悠悠我心', source: '《诗经》' },
                { poem: '桃之夭夭，灼灼其华', source: '《诗经》' },
                { poem: '山有扶苏，隰有荷华', source: '《诗经》' },
                { poem: '皎皎白驹，在彼空谷', source: '《诗经》' },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <Text className="text-gray-700">{item.poem}</Text>
                  <Text className="text-gray-400 text-sm">{item.source}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 诗词起名源于中华传统文化，寓意深远，是为宝宝取名的好选择。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
