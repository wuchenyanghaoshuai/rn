import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FeedingPlan {
  ageRange: string;
  mainFood: string;
  milkAmount: string;
  mealFrequency: string;
  supplements: string[];
  tips: string[];
}

const feedingPlans: FeedingPlan[] = [
  {
    ageRange: '0-4个月',
    mainFood: '母乳或配方奶',
    milkAmount: '每次60-120ml，每天8-12次',
    mealFrequency: '按需喂养',
    supplements: ['维生素D 400IU/天'],
    tips: [
      '优先选择母乳喂养',
      '按需喂养，不需要固定时间',
      '注意观察宝宝的饱腹信号',
      '不需要额外喂水',
    ],
  },
  {
    ageRange: '4-6个月',
    mainFood: '母乳/配方奶为主',
    milkAmount: '每次150-180ml，每天5-6次',
    mealFrequency: '可开始尝试辅食',
    supplements: ['维生素D 400IU/天', '可开始补充铁剂'],
    tips: [
      '满4个月可开始尝试辅食',
      '从强化铁米粉开始',
      '每次只添加一种新食物',
      '观察3天无过敏再添加新食物',
    ],
  },
  {
    ageRange: '6-8个月',
    mainFood: '奶类+辅食',
    milkAmount: '每天600-800ml',
    mealFrequency: '辅食1-2餐',
    supplements: ['维生素D 400IU/天', '铁剂（如有需要）'],
    tips: [
      '逐渐增加辅食种类和量',
      '可尝试蔬菜泥、水果泥、蛋黄',
      '辅食质地从泥状开始',
      '鼓励自主进食尝试',
    ],
  },
  {
    ageRange: '8-10个月',
    mainFood: '奶类+辅食',
    milkAmount: '每天500-700ml',
    mealFrequency: '辅食2-3餐',
    supplements: ['维生素D 400IU/天'],
    tips: [
      '辅食质地可以更粗糙',
      '可尝试小块软食',
      '开始培养规律的用餐时间',
      '可以开始用学饮杯喝水',
    ],
  },
  {
    ageRange: '10-12个月',
    mainFood: '奶类+辅食',
    milkAmount: '每天400-600ml',
    mealFrequency: '辅食3餐+点心',
    supplements: ['维生素D 400IU/天'],
    tips: [
      '辅食逐渐过渡到软烂的家常饭',
      '可以吃小块的水果、蔬菜',
      '培养自主进食能力',
      '减少夜奶，建立规律作息',
    ],
  },
  {
    ageRange: '1-2岁',
    mainFood: '家常饭+奶类',
    milkAmount: '每天300-500ml',
    mealFrequency: '正餐3餐+点心1-2次',
    supplements: ['维生素D 400-600IU/天'],
    tips: [
      '饮食接近成人，但要少盐少糖',
      '保证营养均衡，荤素搭配',
      '培养良好的用餐习惯',
      '避免边吃边玩',
    ],
  },
  {
    ageRange: '2-3岁',
    mainFood: '家常饭+奶类',
    milkAmount: '每天300-400ml',
    mealFrequency: '正餐3餐+点心1次',
    supplements: ['维生素D 600IU/天'],
    tips: [
      '与家人同桌进餐',
      '食物切成适当大小',
      '不挑食，不偏食',
      '控制零食和甜食',
    ],
  },
];

export default function FeedingPlanScreen() {
  const [selectedAge, setSelectedAge] = useState(0);

  const plan = feedingPlans[selectedAge];

  return (
    <>
      <Stack.Screen options={{ title: '喂养方案' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 年龄选择器 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {feedingPlans.map((p, index) => (
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
                    {p.ageRange}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 主要信息卡片 */}
          <View className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 mb-4">
            <Text className="text-white/80 text-sm">{plan.ageRange} 宝宝喂养指南</Text>
            <Text className="text-white text-2xl font-bold mt-2">{plan.mainFood}</Text>
          </View>

          {/* 奶量和餐次 */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water-outline" size={20} color="#3b82f6" />
                <Text className="text-gray-600 text-sm ml-1">奶量</Text>
              </View>
              <Text className="text-gray-800 font-medium">{plan.milkAmount}</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={20} color="#22c55e" />
                <Text className="text-gray-600 text-sm ml-1">餐次</Text>
              </View>
              <Text className="text-gray-800 font-medium">{plan.mealFrequency}</Text>
            </View>
          </View>

          {/* 营养补充 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="medkit-outline" size={20} color="#ef4444" />
              <Text className="text-gray-800 font-bold ml-2">营养补充</Text>
            </View>
            <View className="gap-2">
              {plan.supplements.map((supplement, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-2 h-2 bg-red-400 rounded-full" />
                  <Text className="text-gray-700 ml-2">{supplement}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 喂养建议 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text className="text-gray-800 font-bold ml-2">喂养建议</Text>
            </View>
            <View className="gap-3">
              {plan.tips.map((tip, index) => (
                <View key={index} className="flex-row">
                  <View className="w-5 h-5 bg-amber-100 rounded-full items-center justify-center mt-0.5">
                    <Text className="text-amber-600 text-xs font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-gray-600 flex-1 ml-2 leading-5">{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 辅食添加顺序（特定月龄显示） */}
          {selectedAge >= 1 && selectedAge <= 4 && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="nutrition-outline" size={20} color="#22c55e" />
                <Text className="text-gray-800 font-bold ml-2">辅食添加建议</Text>
              </View>
              <View className="gap-2">
                {[
                  { food: '强化铁米粉', icon: '🍚' },
                  { food: '蔬菜泥（胡萝卜、南瓜）', icon: '🥕' },
                  { food: '水果泥（苹果、香蕉）', icon: '🍎' },
                  { food: '蛋黄', icon: '🥚' },
                  { food: '肉泥（猪肉、鸡肉）', icon: '🍖' },
                  { food: '鱼泥', icon: '🐟' },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-green-50 rounded-lg p-3"
                  >
                    <Text className="text-xl">{item.icon}</Text>
                    <Text className="text-green-700 ml-2">{item.food}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 注意事项 */}
          <View className="bg-red-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="warning-outline" size={20} color="#ef4444" />
              <Text className="text-red-700 font-bold ml-2">注意事项</Text>
            </View>
            <Text className="text-red-600 text-sm leading-5">
              • 1岁前不加盐、糖、蜂蜜{'\n'}
              • 注意食物过敏，逐一添加新食物{'\n'}
              • 避免整粒坚果等窒息风险食物{'\n'}
              • 如有特殊情况请咨询儿科医生
            </Text>
          </View>

          {/* 底部说明 */}
          <View className="mt-4 bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-500 text-sm leading-5">
              * 以上为一般性建议，具体喂养方案请根据宝宝实际情况，
              并在儿科医生或营养师指导下进行调整。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
