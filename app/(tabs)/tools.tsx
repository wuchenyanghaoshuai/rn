import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  color: string;
  route: string;
}

const tools: Tool[] = [
  // 起名工具
  {
    id: 'baby-naming',
    name: '宝宝起名',
    description: '智能生成优质好名',
    icon: 'sparkles-outline',
    color: '#e76f51',
    route: '/tools/baby-naming',
  },
  {
    id: 'name-test',
    name: '姓名测试',
    description: '名字打分分析',
    icon: 'star-outline',
    color: '#f59e0b',
    route: '/tools/name-test',
  },
  {
    id: 'five-elements-naming',
    name: '五行起名',
    description: '根据五行生克起名',
    icon: 'planet-outline',
    color: '#8b5cf6',
    route: '/tools/five-elements-naming',
  },
  {
    id: 'poetry-naming',
    name: '诗词起名',
    description: '古诗词中取名',
    icon: 'book-outline',
    color: '#ec4899',
    route: '/tools/poetry-naming',
  },
  // 生长发育工具
  {
    id: 'height-prediction',
    name: '身高预测',
    description: '预测孩子成年身高',
    icon: 'trending-up-outline',
    color: '#14b8a6',
    route: '/tools/height-prediction',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI计算',
    description: '体重指数计算',
    icon: 'body-outline',
    color: '#06b6d4',
    route: '/tools/bmi-calculator',
  },
  {
    id: 'growth-record',
    name: '生长记录',
    description: '记录宝宝生长数据',
    icon: 'stats-chart-outline',
    color: '#22c55e',
    route: '/tools/growth-record',
  },
  {
    id: 'growth-chart',
    name: '生长曲线',
    description: '查看生长发育曲线',
    icon: 'analytics-outline',
    color: '#3b82f6',
    route: '/tools/growth-chart',
  },
  // 日历和时间工具
  {
    id: 'age-calculator',
    name: '年龄计算',
    description: '精确计算宝宝年龄',
    icon: 'calendar-outline',
    color: '#f97316',
    route: '/tools/age-calculator',
  },
  {
    id: 'calendar',
    name: '育儿日历',
    description: '重要日程提醒',
    icon: 'today-outline',
    color: '#84cc16',
    route: '/tools/calendar',
  },
  {
    id: 'vaccine-schedule',
    name: '疫苗日程',
    description: '疫苗接种提醒',
    icon: 'medkit-outline',
    color: '#ef4444',
    route: '/tools/vaccine-schedule',
  },
  // 营养和喂养工具
  {
    id: 'nutrition-calculator',
    name: '营养计算',
    description: '每日营养需求计算',
    icon: 'nutrition-outline',
    color: '#10b981',
    route: '/tools/nutrition-calculator',
  },
  {
    id: 'feeding-plan',
    name: '喂养方案',
    description: '科学喂养建议',
    icon: 'restaurant-outline',
    color: '#f59e0b',
    route: '/tools/feeding-plan',
  },
  {
    id: 'family-meal-plan',
    name: '家庭食谱',
    description: '营养均衡的食谱',
    icon: 'fast-food-outline',
    color: '#a855f7',
    route: '/tools/family-meal-plan',
  },
  // 作息工具
  {
    id: 'sleep-schedule',
    name: '睡眠管理',
    description: '科学作息安排',
    icon: 'moon-outline',
    color: '#6366f1',
    route: '/tools/sleep-schedule',
  },
  // 命理工具
  {
    id: 'bazi',
    name: '生辰八字',
    description: '八字命理分析',
    icon: 'compass-outline',
    color: '#d946ef',
    route: '/tools/bazi',
  },
  {
    id: 'five-elements-query',
    name: '五行查询',
    description: '五行属性查询',
    icon: 'layers-outline',
    color: '#0ea5e9',
    route: '/tools/five-elements-query',
  },
  {
    id: 'zodiac-matching',
    name: '生肖配对',
    description: '生肖相合分析',
    icon: 'heart-outline',
    color: '#ec4899',
    route: '/tools/zodiac-matching',
  },
];

// 工具分组
const toolGroups = [
  {
    title: '起名工具',
    icon: 'sparkles-outline' as IconName,
    tools: tools.filter((t) => ['baby-naming', 'name-test', 'five-elements-naming', 'poetry-naming'].includes(t.id)),
  },
  {
    title: '生长发育',
    icon: 'trending-up-outline' as IconName,
    tools: tools.filter((t) => ['height-prediction', 'bmi-calculator', 'growth-record', 'growth-chart'].includes(t.id)),
  },
  {
    title: '日程管理',
    icon: 'calendar-outline' as IconName,
    tools: tools.filter((t) => ['age-calculator', 'calendar', 'vaccine-schedule'].includes(t.id)),
  },
  {
    title: '营养喂养',
    icon: 'nutrition-outline' as IconName,
    tools: tools.filter((t) => ['nutrition-calculator', 'feeding-plan', 'family-meal-plan'].includes(t.id)),
  },
  {
    title: '作息睡眠',
    icon: 'moon-outline' as IconName,
    tools: tools.filter((t) => ['sleep-schedule'].includes(t.id)),
  },
  {
    title: '命理工具',
    icon: 'compass-outline' as IconName,
    tools: tools.filter((t) => ['bazi', 'five-elements-query', 'zodiac-matching'].includes(t.id)),
  },
];

export default function ToolsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Banner */}
      <View className="mx-4 mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5">
        <Text className="text-white text-xl font-bold">育儿工具箱</Text>
        <Text className="text-white/80 mt-1">科学育儿，轻松养娃</Text>
      </View>

      {/* 工具分组 */}
      {toolGroups.map((group) => (
        <View key={group.title} className="mt-6 px-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name={group.icon} size={20} color="#e76f51" />
            <Text className="text-lg font-bold text-gray-800 ml-2">{group.title}</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {group.tools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                className="bg-white rounded-xl p-4 shadow-sm"
                style={{ width: '47%' }}
                onPress={() => router.push(tool.route as any)}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: `${tool.color}20` }}
                >
                  <Ionicons name={tool.icon} size={22} color={tool.color} />
                </View>
                <Text className="text-gray-800 font-medium">{tool.name}</Text>
                <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
                  {tool.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* 底部间距 */}
      <View className="h-6" />
    </ScrollView>
  );
}
