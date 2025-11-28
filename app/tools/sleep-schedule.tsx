import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SleepSchedule {
  ageRange: string;
  totalSleep: string;
  nightSleep: string;
  naps: string;
  napTimes: string;
  bedtime: string;
  wakeTime: string;
  tips: string[];
}

const schedules: SleepSchedule[] = [
  {
    ageRange: '0-3个月',
    totalSleep: '14-17小时',
    nightSleep: '8-9小时',
    naps: '3-5次',
    napTimes: '每次30分钟-2小时',
    bedtime: '无固定，随吃随睡',
    wakeTime: '无固定',
    tips: [
      '建立昼夜节律：白天保持房间明亮，夜间保持黑暗安静',
      '学会识别疲倦信号：打哈欠、揉眼睛、烦躁',
      '不要让宝宝过度疲劳再睡觉',
    ],
  },
  {
    ageRange: '4-6个月',
    totalSleep: '12-15小时',
    nightSleep: '9-11小时',
    naps: '3次',
    napTimes: '上午、下午各1-2小时',
    bedtime: '18:00-20:00',
    wakeTime: '6:00-7:00',
    tips: [
      '可以开始建立固定的睡前仪式',
      '尝试让宝宝在困倦但清醒时放入床上',
      '逐渐减少夜间喂奶次数',
    ],
  },
  {
    ageRange: '7-12个月',
    totalSleep: '12-14小时',
    nightSleep: '10-12小时',
    naps: '2次',
    napTimes: '上午1小时，下午1.5-2小时',
    bedtime: '18:30-19:30',
    wakeTime: '6:00-7:00',
    tips: [
      '保持规律的作息时间表',
      '建立稳定的睡前仪式（洗澡、换衣、讲故事）',
      '避免睡前过度兴奋的活动',
    ],
  },
  {
    ageRange: '1-2岁',
    totalSleep: '11-14小时',
    nightSleep: '10-12小时',
    naps: '1-2次',
    napTimes: '午睡1.5-3小时',
    bedtime: '19:00-20:00',
    wakeTime: '6:30-7:30',
    tips: [
      '午睡时间不要太晚，建议下午3点前结束',
      '逐渐过渡到一次午睡',
      '睡前避免使用电子设备',
    ],
  },
  {
    ageRange: '3-5岁',
    totalSleep: '10-13小时',
    nightSleep: '10-12小时',
    naps: '0-1次',
    napTimes: '午睡1-2小时（可选）',
    bedtime: '19:00-20:30',
    wakeTime: '6:30-7:30',
    tips: [
      '部分孩子可能不再需要午睡',
      '如果不午睡，可以安排安静活动时间',
      '保持每天相同的睡觉和起床时间',
    ],
  },
  {
    ageRange: '6-12岁',
    totalSleep: '9-12小时',
    nightSleep: '9-12小时',
    naps: '无',
    napTimes: '不需要',
    bedtime: '20:00-21:00',
    wakeTime: '6:30-7:30',
    tips: [
      '确保卧室安静、黑暗、凉爽',
      '睡前1小时避免电子设备',
      '规律运动有助于睡眠，但避免睡前剧烈运动',
    ],
  },
];

export default function SleepScheduleScreen() {
  const [selectedAge, setSelectedAge] = useState(0);

  const schedule = schedules[selectedAge];

  return (
    <>
      <Stack.Screen options={{ title: '睡眠管理' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 年龄选择 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {schedules.map((s, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-2 rounded-full ${
                    selectedAge === index ? 'bg-primary-500' : 'bg-white'
                  }`}
                  onPress={() => setSelectedAge(index)}
                >
                  <Text
                    className={`font-medium ${
                      selectedAge === index ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {s.ageRange}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 睡眠时长卡片 */}
          <View className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={24} color="#fff" />
              <Text className="text-white text-lg font-bold ml-2">推荐睡眠时长</Text>
            </View>
            <Text className="text-white text-4xl font-bold mt-3">{schedule.totalSleep}</Text>
            <Text className="text-white/70 mt-1">{schedule.ageRange} 宝宝每日总睡眠</Text>
          </View>

          {/* 详细信息 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-gray-800 font-bold mb-4">睡眠安排</Text>

            <View className="gap-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center">
                  <Ionicons name="bed-outline" size={20} color="#6366f1" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-500 text-sm">夜间睡眠</Text>
                  <Text className="text-gray-800 font-semibold">{schedule.nightSleep}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center">
                  <Ionicons name="sunny-outline" size={20} color="#f59e0b" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-500 text-sm">日间小睡</Text>
                  <Text className="text-gray-800 font-semibold">{schedule.naps}</Text>
                  <Text className="text-gray-400 text-sm">{schedule.napTimes}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="time-outline" size={20} color="#8b5cf6" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-500 text-sm">建议入睡时间</Text>
                  <Text className="text-gray-800 font-semibold">{schedule.bedtime}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                  <Ionicons name="alarm-outline" size={20} color="#f97316" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-500 text-sm">建议起床时间</Text>
                  <Text className="text-gray-800 font-semibold">{schedule.wakeTime}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 睡眠小贴士 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text className="text-gray-800 font-bold ml-2">睡眠小贴士</Text>
            </View>
            {schedule.tips.map((tip, index) => (
              <View key={index} className="flex-row mb-2">
                <View className="w-5 h-5 bg-amber-100 rounded-full items-center justify-center mt-0.5">
                  <Text className="text-amber-600 text-xs font-bold">{index + 1}</Text>
                </View>
                <Text className="text-gray-600 flex-1 ml-2 leading-5">{tip}</Text>
              </View>
            ))}
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 每个宝宝的睡眠需求可能有所不同，以上为一般建议。
              如果您对宝宝的睡眠有疑虑，建议咨询儿科医生。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
