/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 疫苗日程工具 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Syringe, Clock, Info } from 'lucide-react-native';
import { GradientCard, Tag } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface Vaccine {
  id: string;
  name: string;
  shortName: string;
  ageRange: string;
  doses: string;
  description: string;
  isFree: boolean;
}

const vaccines: Vaccine[] = [
  {
    id: '1',
    name: '乙肝疫苗',
    shortName: 'HepB',
    ageRange: '出生、1月龄、6月龄',
    doses: '3剂',
    description: '预防乙型肝炎病毒感染',
    isFree: true,
  },
  {
    id: '2',
    name: '卡介苗',
    shortName: 'BCG',
    ageRange: '出生',
    doses: '1剂',
    description: '预防结核病',
    isFree: true,
  },
  {
    id: '3',
    name: '脊灰疫苗',
    shortName: 'IPV/bOPV',
    ageRange: '2、3、4月龄，4岁',
    doses: '4剂',
    description: '预防脊髓灰质炎（小儿麻痹症）',
    isFree: true,
  },
  {
    id: '4',
    name: '百白破疫苗',
    shortName: 'DTaP',
    ageRange: '3、4、5月龄，18月龄',
    doses: '4剂',
    description: '预防百日咳、白喉、破伤风',
    isFree: true,
  },
  {
    id: '5',
    name: '麻腮风疫苗',
    shortName: 'MMR',
    ageRange: '8月龄，18月龄',
    doses: '2剂',
    description: '预防麻疹、流行性腮腺炎、风疹',
    isFree: true,
  },
  {
    id: '6',
    name: '乙脑疫苗',
    shortName: 'JE',
    ageRange: '8月龄，2岁，6岁',
    doses: '2-3剂',
    description: '预防流行性乙型脑炎',
    isFree: true,
  },
  {
    id: '7',
    name: 'A群流脑疫苗',
    shortName: 'MenA',
    ageRange: '6-18月龄',
    doses: '2剂',
    description: '预防A群脑膜炎球菌引起的流行性脑脊髓膜炎',
    isFree: true,
  },
  {
    id: '8',
    name: '甲肝疫苗',
    shortName: 'HepA',
    ageRange: '18月龄',
    doses: '1-2剂',
    description: '预防甲型肝炎病毒感染',
    isFree: true,
  },
  {
    id: '9',
    name: '水痘疫苗',
    shortName: 'VZV',
    ageRange: '12月龄，4岁',
    doses: '2剂',
    description: '预防水痘',
    isFree: false,
  },
  {
    id: '10',
    name: '流感疫苗',
    shortName: 'IIV',
    ageRange: '6月龄起每年接种',
    doses: '每年1-2剂',
    description: '预防流行性感冒',
    isFree: false,
  },
  {
    id: '11',
    name: '轮状病毒疫苗',
    shortName: 'RV',
    ageRange: '2-6月龄',
    doses: '2-3剂',
    description: '预防轮状病毒引起的腹泻',
    isFree: false,
  },
  {
    id: '12',
    name: '肺炎疫苗',
    shortName: 'PCV13',
    ageRange: '2、4、6月龄，12-15月龄',
    doses: '4剂',
    description: '预防肺炎球菌引起的肺炎等疾病',
    isFree: false,
  },
];

export default function VaccineScheduleScreen() {
  const [selectedType, setSelectedType] = useState<'all' | 'free' | 'paid'>('all');

  const filteredVaccines = vaccines.filter((v) => {
    if (selectedType === 'all') return true;
    if (selectedType === 'free') return v.isFree;
    return !v.isFree;
  });

  const renderVaccine = ({ item }: { item: Vaccine }) => (
    <GradientCard variant="white" className="p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              item.isFree ? 'bg-mint-light' : 'bg-butter-light'
            }`}
          >
            <Syringe
              size={20}
              color={item.isFree ? Colors.mint.DEFAULT : Colors.butter.DEFAULT}
            />
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-neutral-800 font-semibold">{item.name}</Text>
              <Text className="text-neutral-400 text-sm ml-2">({item.shortName})</Text>
            </View>
            <Text className="text-neutral-500 text-sm mt-0.5">{item.doses}</Text>
          </View>
        </View>
        <Tag
          variant={item.isFree ? 'mint' : 'butter'}
          size="sm"
        >
          {item.isFree ? '免费' : '自费'}
        </Tag>
      </View>

      <View className="mt-3 pt-3 border-t border-neutral-100">
        <View className="flex-row items-center">
          <Clock size={16} color={Colors.neutral[400]} />
          <Text className="text-neutral-600 text-sm ml-1">{item.ageRange}</Text>
        </View>
        <Text className="text-neutral-500 text-sm mt-1">{item.description}</Text>
      </View>
    </GradientCard>
  );

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '疫苗日程',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <View className="flex-1">
        {/* 筛选器 */}
        <View className="bg-white/90 px-4 py-3 flex-row gap-2">
          {[
            { id: 'all', label: '全部' },
            { id: 'free', label: '免费疫苗' },
            { id: 'paid', label: '自费疫苗' },
          ].map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`px-4 py-2 rounded-full ${
                selectedType === type.id ? 'bg-primary-400' : 'bg-neutral-100'
              }`}
              onPress={() => setSelectedType(type.id as any)}
            >
              <Text
                className={`font-medium ${
                  selectedType === type.id ? 'text-white' : 'text-neutral-600'
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 疫苗列表 */}
        <FlatList
          data={filteredVaccines}
          renderItem={renderVaccine}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={() => (
            <GradientCard variant="rose" className="p-4 mb-4">
              <View className="flex-row items-center">
                <Info size={20} color={Colors.neutral[700]} />
                <Text className="text-neutral-800 font-semibold ml-2">温馨提示</Text>
              </View>
              <Text className="text-neutral-700 text-sm mt-2 leading-5">
                以上为国家免疫规划疫苗和常见自费疫苗，具体接种时间请以当地社区卫生服务中心安排为准。
              </Text>
            </GradientCard>
          )}
        />
      </View>
    </LinearGradient>
  );
}
