import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              item.isFree ? 'bg-green-100' : 'bg-amber-100'
            }`}
          >
            <Ionicons
              name="medical-outline"
              size={20}
              color={item.isFree ? '#22c55e' : '#f59e0b'}
            />
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-semibold">{item.name}</Text>
              <Text className="text-gray-400 text-sm ml-2">({item.shortName})</Text>
            </View>
            <Text className="text-gray-500 text-sm mt-0.5">{item.doses}</Text>
          </View>
        </View>
        <View
          className={`px-2 py-1 rounded ${
            item.isFree ? 'bg-green-50' : 'bg-amber-50'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              item.isFree ? 'text-green-600' : 'text-amber-600'
            }`}
          >
            {item.isFree ? '免费' : '自费'}
          </Text>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#9ca3af" />
          <Text className="text-gray-500 text-sm ml-1">{item.ageRange}</Text>
        </View>
        <Text className="text-gray-400 text-sm mt-1">{item.description}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: '疫苗日程' }} />

      <View className="flex-1 bg-background">
        {/* 筛选器 */}
        <View className="bg-white px-4 py-3 flex-row gap-2">
          {[
            { id: 'all', label: '全部' },
            { id: 'free', label: '免费疫苗' },
            { id: 'paid', label: '自费疫苗' },
          ].map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`px-4 py-2 rounded-full ${
                selectedType === type.id ? 'bg-primary-500' : 'bg-gray-100'
              }`}
              onPress={() => setSelectedType(type.id as any)}
            >
              <Text
                className={`font-medium ${
                  selectedType === type.id ? 'text-white' : 'text-gray-600'
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
            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                <Text className="text-blue-700 font-medium ml-2">温馨提示</Text>
              </View>
              <Text className="text-blue-600 text-sm mt-2 leading-5">
                以上为国家免疫规划疫苗和常见自费疫苗，具体接种时间请以当地社区卫生服务中心安排为准。
              </Text>
            </View>
          )}
        />
      </View>
    </>
  );
}
