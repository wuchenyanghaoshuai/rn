/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 睡眠管理工具 - 方案A设计系统重构版
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
import { Moon, BedDouble, Sun, Clock, AlarmClock, Lightbulb } from 'lucide-react-native';
import { GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

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
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '睡眠管理',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 年龄选择 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 -mx-5 px-5">
            <View className="flex-row gap-2">
              {schedules.map((s, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-2.5 rounded-full ${
                    selectedAge === index ? 'bg-primary-400' : 'bg-white'
                  }`}
                  onPress={() => setSelectedAge(index)}
                >
                  <Text
                    className={`font-medium ${
                      selectedAge === index ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {s.ageRange}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 睡眠时长卡片 */}
          <GradientCard variant="lavender" className="p-5 mb-5">
            <View className="flex-row items-center">
              <Moon size={24} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 text-lg font-bold ml-2">推荐睡眠时长</Text>
            </View>
            <Text className="text-neutral-800 text-4xl font-bold mt-3">{schedule.totalSleep}</Text>
            <Text className="text-neutral-700 mt-1">{schedule.ageRange} 宝宝每日总睡眠</Text>
          </GradientCard>

          {/* 详细信息 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <Text className="text-neutral-800 font-bold text-base mb-4">睡眠安排</Text>

            <View className="gap-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-lavender-light rounded-full items-center justify-center">
                  <BedDouble size={20} color={Colors.lavender.DEFAULT} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-neutral-600 text-sm">夜间睡眠</Text>
                  <Text className="text-neutral-800 font-semibold">{schedule.nightSleep}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-butter-light rounded-full items-center justify-center">
                  <Sun size={20} color={Colors.butter.DEFAULT} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-neutral-600 text-sm">日间小睡</Text>
                  <Text className="text-neutral-800 font-semibold">{schedule.naps}</Text>
                  <Text className="text-neutral-500 text-sm">{schedule.napTimes}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-sky-light rounded-full items-center justify-center">
                  <Clock size={20} color={Colors.sky.DEFAULT} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-neutral-600 text-sm">建议入睡时间</Text>
                  <Text className="text-neutral-800 font-semibold">{schedule.bedtime}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-rose-light rounded-full items-center justify-center">
                  <AlarmClock size={20} color={Colors.rose.DEFAULT} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-neutral-600 text-sm">建议起床时间</Text>
                  <Text className="text-neutral-800 font-semibold">{schedule.wakeTime}</Text>
                </View>
              </View>
            </View>
          </GradientCard>

          {/* 睡眠小贴士 */}
          <GradientCard variant="mint" className="p-5 mb-5">
            <View className="flex-row items-center mb-3">
              <Lightbulb size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-bold ml-2">睡眠小贴士</Text>
            </View>
            {schedule.tips.map((tip, index) => (
              <View key={index} className="flex-row mb-3 last:mb-0">
                <View className="w-6 h-6 bg-white/60 rounded-full items-center justify-center mt-0.5 flex-shrink-0">
                  <Text className="text-neutral-800 text-xs font-bold">{index + 1}</Text>
                </View>
                <Text className="text-neutral-700 flex-1 ml-2 leading-5">{tip}</Text>
              </View>
            ))}
          </GradientCard>

          {/* 提示 */}
          <GradientCard variant="lavender" className="p-4">
            <Text className="text-neutral-700 text-sm leading-5">
              * 每个宝宝的睡眠需求可能有所不同，以上为一般建议。如果您对宝宝的睡眠有疑虑，建议咨询儿科医生。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
