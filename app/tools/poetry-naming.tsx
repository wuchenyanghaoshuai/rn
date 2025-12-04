/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 诗词起名工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Flower, Leaf, Heart, Sparkles } from 'lucide-react-native';
import { Input, Button, GradientCard, Radio } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

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
      poem: '思齐大任,文王之母',
      meaning: '思虑周全,品德高尚',
    },
    {
      name: '维桢',
      source: '《诗经·大雅》',
      poem: '王国克生,维周之桢',
      meaning: '国家栋梁,坚贞不屈',
    },
    {
      name: '浩然',
      source: '《孟子》',
      poem: '吾善养吾浩然之气',
      meaning: '正气凛然,胸怀坦荡',
    },
    {
      name: '博文',
      source: '《论语》',
      poem: '君子博学于文,约之以礼',
      meaning: '学识渊博,知书达礼',
    },
    {
      name: '致远',
      source: '《诫子书》',
      poem: '非淡泊无以明志,非宁静无以致远',
      meaning: '志存高远,宁静致远',
    },
    {
      name: '子衿',
      source: '《诗经·郑风》',
      poem: '青青子衿,悠悠我心',
      meaning: '青春朝气,令人思慕',
    },
    {
      name: '星辰',
      source: '《夜泊牛渚怀古》',
      poem: '危楼高百尺,手可摘星辰',
      meaning: '志向远大,追求卓越',
    },
    {
      name: '云帆',
      source: '《行路难》',
      poem: '长风破浪会有时,直挂云帆济沧海',
      meaning: '乘风破浪,勇往直前',
    },
  ],
  female: [
    {
      name: '婉清',
      source: '《诗经·郑风》',
      poem: '有美一人,清扬婉兮',
      meaning: '温婉清雅,美丽动人',
    },
    {
      name: '静姝',
      source: '《诗经·邶风》',
      poem: '静女其姝,俟我于城隅',
      meaning: '文静美好,温柔贤淑',
    },
    {
      name: '燕婉',
      source: '《诗经·邶风》',
      poem: '燕婉之求,得此戚施',
      meaning: '美丽温顺,和婉可人',
    },
    {
      name: '舒窈',
      source: '《诗经·陈风》',
      poem: '月出皎兮,佼人僚兮,舒窈纠兮',
      meaning: '身姿曼妙,优雅动人',
    },
    {
      name: '如玉',
      source: '《诗经·小雅》',
      poem: '言念君子,温其如玉',
      meaning: '温润如玉,品性高洁',
    },
    {
      name: '嘉卉',
      source: '《诗经·小雅》',
      poem: '山有嘉卉,侯栗侯梅',
      meaning: '美丽芬芳,如花似玉',
    },
    {
      name: '晴岚',
      source: '《山中》',
      poem: '晴岚暖翠忽然无,淡烟疏雨自相扶',
      meaning: '清新明丽,如诗如画',
    },
    {
      name: '若兮',
      source: '《洛神赋》',
      poem: '翩若惊鸿,婉若游龙',
      meaning: '轻盈灵动,飘逸若仙',
    },
  ],
};

type StyleType = 'classic' | 'elegant' | 'fresh';

const styles: Array<{ id: StyleType; name: string; icon: any }> = [
  { id: 'classic', name: '经典诗经', icon: BookOpen },
  { id: 'elegant', name: '唐诗宋词', icon: Flower },
  { id: 'fresh', name: '清新文艺', icon: Leaf },
];

export default function PoetryNamingScreen() {
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [style, setStyle] = useState<StyleType>('classic');
  const [results, setResults] = useState<PoetryName[]>([]);

  const generate = () => {
    const names = poetryNames[gender];
    // 随机选择6个名字
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setResults(shuffled.slice(0, 6));
  };

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '诗词起名',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 介绍横幅 */}
          <GradientCard variant="rose" className="p-5 mb-5">
            <View className="flex-row items-center mb-2">
              <Sparkles size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">诗词起名</Text>
            </View>
            <Text className="text-neutral-700 leading-5">
              从经典诗词中撷取灵感,为宝宝取一个富有文化底蕴的好名字。
            </Text>
          </GradientCard>

          {/* 输入区域 */}
          <GradientCard variant="white" className="p-5 mb-5">
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

            {/* 姓氏输入 */}
            <Input
              label="姓氏"
              placeholder="请输入姓氏"
              value={surname}
              onChangeText={setSurname}
              maxLength={2}
              className="mb-4"
            />

            {/* 风格选择 */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-neutral-700 mb-3">诗词风格</Text>
              <View className="flex-row gap-2">
                {styles.map((s) => {
                  const IconComponent = s.icon;
                  const isSelected = style === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                        isSelected ? 'bg-primary-400' : 'bg-neutral-100'
                      }`}
                      onPress={() => setStyle(s.id)}
                    >
                      <IconComponent
                        size={16}
                        color={isSelected ? '#fff' : Colors.neutral[500]}
                      />
                      <Text
                        className={`ml-1.5 text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-neutral-600'
                        }`}
                      >
                        {s.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={generate}
              icon={<Sparkles size={20} color="white" />}
            >
              生成名字
            </Button>
          </GradientCard>

          {/* 结果显示 */}
          {results.length > 0 && (
            <View className="mb-5">
              <Text className="text-neutral-800 font-bold text-base mb-3">推荐名字</Text>
              <View className="gap-3">
                {results.map((item, index) => (
                  <GradientCard key={index} variant="white" className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-neutral-800 font-bold text-2xl">
                        {surname}{item.name}
                      </Text>
                      <TouchableOpacity className="bg-rose-light px-3 py-1.5 rounded-full">
                        <Text className="text-rose-DEFAULT text-sm font-medium">收藏</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="bg-lavender-light rounded-xl p-3 mb-3">
                      <Text className="text-neutral-800 italic leading-6">
                        「{item.poem}」
                      </Text>
                      <Text className="text-neutral-600 text-sm mt-1">
                        —— {item.source}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Heart size={16} color={Colors.neutral[400]} />
                      <Text className="text-neutral-600 text-sm ml-1.5">
                        寓意：{item.meaning}
                      </Text>
                    </View>
                  </GradientCard>
                ))}
              </View>
            </View>
          )}

          {/* 诗词名句推荐 */}
          <GradientCard variant="mint" className="p-5 mb-5">
            <Text className="text-neutral-800 font-bold text-base mb-4">经典起名诗句</Text>
            <View className="gap-3">
              {[
                { poem: '青青子衿,悠悠我心', source: '《诗经》' },
                { poem: '桃之夭夭,灼灼其华', source: '《诗经》' },
                { poem: '山有扶苏,隰有荷华', source: '《诗经》' },
                { poem: '皎皎白驹,在彼空谷', source: '《诗经》' },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-2.5 border-b border-neutral-700/10 last:border-b-0"
                >
                  <Text className="text-neutral-800 flex-1">{item.poem}</Text>
                  <Text className="text-neutral-500 text-sm ml-2">{item.source}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 提示 */}
          <GradientCard variant="lavender" className="p-4">
            <Text className="text-neutral-700 text-sm leading-5">
              * 诗词起名源于中华传统文化,寓意深远,是为宝宝取名的好选择。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
