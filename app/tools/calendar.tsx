/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 育儿日历工具 - 方案A设计系统重构版
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
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Syringe,
  Activity,
  Star,
  Gift,
  Clock,
  Info,
} from 'lucide-react-native';
import { GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'vaccine' | 'checkup' | 'milestone' | 'birthday' | 'custom';
  description?: string;
}

const eventTypeConfig = {
  vaccine: { label: '疫苗', color: '#ef4444', icon: Syringe },
  checkup: { label: '体检', color: '#3b82f6', icon: Activity },
  milestone: { label: '里程碑', color: '#22c55e', icon: Star },
  birthday: { label: '生日', color: '#f59e0b', icon: Gift },
  custom: { label: '自定义', color: '#8b5cf6', icon: Calendar },
};

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '百白破疫苗第4剂',
    date: '2024-12-15',
    type: 'vaccine',
    description: '18月龄接种',
  },
  {
    id: '2',
    title: '1岁半体检',
    date: '2024-12-20',
    type: 'checkup',
    description: '身高体重、运动发育检查',
  },
  {
    id: '3',
    title: '宝宝会说话了',
    date: '2024-12-10',
    type: 'milestone',
    description: '第一次清晰地叫妈妈',
  },
  {
    id: '4',
    title: '宝宝2岁生日',
    date: '2025-01-15',
    type: 'birthday',
  },
];

const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarScreen() {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [events] = useState<CalendarEvent[]>(sampleEvents);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days: (number | null)[] = [];

    // 填充月初空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const changeMonth = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const isToday = (day: number) => {
    return (
      day === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() &&
      selectedYear === currentDate.getFullYear()
    );
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '育儿日历',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 日历头部 */}
          <GradientCard variant="white" className="overflow-hidden mb-5">
            {/* 月份切换 */}
            <View className="flex-row items-center justify-between bg-primary-400 px-4 py-3">
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-bold">
                {selectedYear}年 {months[selectedMonth]}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* 星期头部 */}
            <View className="flex-row border-b border-neutral-100">
              {weekDays.map((day) => (
                <View key={day} className="flex-1 py-2">
                  <Text className="text-neutral-600 text-center text-sm">{day}</Text>
                </View>
              ))}
            </View>

            {/* 日历网格 */}
            <View className="flex-row flex-wrap p-2">
              {generateCalendarDays().map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                return (
                  <View
                    key={index}
                    className="w-[14.28%] aspect-square p-0.5"
                  >
                    {day && (
                      <TouchableOpacity
                        className={`flex-1 rounded-lg items-center justify-center ${
                          isToday(day) ? 'bg-primary-400' : ''
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            isToday(day) ? 'text-white' : 'text-neutral-800'
                          }`}
                        >
                          {day}
                        </Text>
                        {dayEvents.length > 0 && (
                          <View className="flex-row gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((e) => (
                              <View
                                key={e.id}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: eventTypeConfig[e.type].color,
                                }}
                              />
                            ))}
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </GradientCard>

          {/* 事件类型图例 */}
          <GradientCard variant="lavender" className="p-5 mb-5">
            <Text className="text-neutral-800 font-bold text-base mb-3">事件类型</Text>
            <View className="flex-row flex-wrap gap-3">
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <View key={key} className="flex-row items-center">
                  <View
                    className="w-3 h-3 rounded-full mr-1.5"
                    style={{ backgroundColor: config.color }}
                  />
                  <Text className="text-neutral-700 text-sm">{config.label}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 即将到来的事件 */}
          <GradientCard variant="white" className="p-5 mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-neutral-800 font-bold text-base">即将到来</Text>
              <TouchableOpacity>
                <Text className="text-primary-400 text-sm font-medium">添加事件</Text>
              </TouchableOpacity>
            </View>

            {upcomingEvents.length === 0 ? (
              <View className="py-8 items-center">
                <Calendar size={48} color={Colors.neutral[300]} />
                <Text className="text-neutral-400 mt-2">暂无即将到来的事件</Text>
              </View>
            ) : (
              <View className="gap-3">
                {upcomingEvents.map((event) => {
                  const config = eventTypeConfig[event.type];
                  const IconComponent = config.icon;
                  return (
                    <TouchableOpacity
                      key={event.id}
                      className="flex-row items-center bg-neutral-50 rounded-xl p-3"
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <IconComponent size={20} color={config.color} />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-neutral-800 font-medium">{event.title}</Text>
                        <View className="flex-row items-center mt-1">
                          <Clock size={12} color={Colors.neutral[400]} />
                          <Text className="text-neutral-500 text-sm ml-1">
                            {event.date}
                          </Text>
                          <View
                            className="ml-2 px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${config.color}20` }}
                          >
                            <Text
                              className="text-xs font-medium"
                              style={{ color: config.color }}
                            >
                              {config.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <ChevronRight size={20} color={Colors.neutral[300]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </GradientCard>

          {/* 提示 */}
          <GradientCard variant="sky" className="p-5">
            <View className="flex-row items-center mb-2">
              <Info size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-semibold ml-2">温馨提示</Text>
            </View>
            <Text className="text-neutral-700 text-sm leading-5">
              及时记录宝宝的重要日程，包括疫苗接种、体检、成长里程碑等，让育儿更有计划性。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
