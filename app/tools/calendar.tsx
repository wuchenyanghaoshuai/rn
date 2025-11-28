import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'vaccine' | 'checkup' | 'milestone' | 'birthday' | 'custom';
  description?: string;
}

const eventTypeConfig = {
  vaccine: { label: '疫苗', color: '#ef4444', icon: 'medkit-outline' },
  checkup: { label: '体检', color: '#3b82f6', icon: 'fitness-outline' },
  milestone: { label: '里程碑', color: '#22c55e', icon: 'star-outline' },
  birthday: { label: '生日', color: '#f59e0b', icon: 'gift-outline' },
  custom: { label: '自定义', color: '#8b5cf6', icon: 'calendar-outline' },
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
    <>
      <Stack.Screen options={{ title: '育儿日历' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 日历头部 */}
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            {/* 月份切换 */}
            <View className="flex-row items-center justify-between bg-primary-500 px-4 py-3">
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-bold">
                {selectedYear}年 {months[selectedMonth]}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* 星期头部 */}
            <View className="flex-row border-b border-gray-100">
              {weekDays.map((day) => (
                <View key={day} className="flex-1 py-2">
                  <Text className="text-gray-500 text-center text-sm">{day}</Text>
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
                          isToday(day) ? 'bg-primary-500' : ''
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            isToday(day) ? 'text-white' : 'text-gray-700'
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
          </View>

          {/* 事件类型图例 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-gray-800 font-bold mb-3">事件类型</Text>
            <View className="flex-row flex-wrap gap-3">
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <View key={key} className="flex-row items-center">
                  <View
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: config.color }}
                  />
                  <Text className="text-gray-600 text-sm">{config.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 即将到来的事件 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 font-bold">即将到来</Text>
              <TouchableOpacity>
                <Text className="text-primary-500 text-sm">添加事件</Text>
              </TouchableOpacity>
            </View>

            {upcomingEvents.length === 0 ? (
              <View className="py-8 items-center">
                <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-400 mt-2">暂无即将到来的事件</Text>
              </View>
            ) : (
              <View className="gap-3">
                {upcomingEvents.map((event) => {
                  const config = eventTypeConfig[event.type];
                  return (
                    <TouchableOpacity
                      key={event.id}
                      className="flex-row items-center bg-gray-50 rounded-xl p-3"
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <Ionicons
                          name={config.icon as any}
                          size={20}
                          color={config.color}
                        />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-gray-800 font-medium">{event.title}</Text>
                        <View className="flex-row items-center mt-1">
                          <Ionicons name="time-outline" size={12} color="#9ca3af" />
                          <Text className="text-gray-400 text-sm ml-1">
                            {event.date}
                          </Text>
                          <View
                            className="ml-2 px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${config.color}20` }}
                          >
                            <Text
                              className="text-xs"
                              style={{ color: config.color }}
                            >
                              {config.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-700 font-medium ml-2">温馨提示</Text>
            </View>
            <Text className="text-blue-600 text-sm mt-2 leading-5">
              及时记录宝宝的重要日程，包括疫苗接种、体检、成长里程碑等，让育儿更有计划性。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
