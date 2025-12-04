/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 喂养方案工具 - 方案A设计系统重构版
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
import { Milk, Clock, Heart, Lightbulb, AppleIcon, AlertCircle } from 'lucide-react-native';
import { GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

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
    <LinearGradient colors={Gradients.pageBackground} className="flex-1">
      <Stack.Screen
        options={{
          title: '喂养方案',
          headerStyle: { backgroundColor: 'transparent' },
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 年龄选择器 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 -mx-5 px-5">
            <View className="flex-row gap-2">
              {feedingPlans.map((p, index) => (
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
                    {p.ageRange}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 主要信息卡片 */}
          <GradientCard variant="butter" className="p-5 mb-5">
            <Text className="text-neutral-700 text-sm">{plan.ageRange} 宝宝喂养指南</Text>
            <Text className="text-neutral-800 text-2xl font-bold mt-2">{plan.mainFood}</Text>
          </GradientCard>

          {/* 奶量和餐次 */}
          <View className="flex-row gap-3 mb-5">
            <GradientCard variant="white" className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Milk size={20} color={Colors.sky.DEFAULT} />
                <Text className="text-neutral-600 text-sm ml-1">奶量</Text>
              </View>
              <Text className="text-neutral-800 font-medium leading-5">{plan.milkAmount}</Text>
            </GradientCard>
            <GradientCard variant="white" className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Clock size={20} color={Colors.mint.DEFAULT} />
                <Text className="text-neutral-600 text-sm ml-1">餐次</Text>
              </View>
              <Text className="text-neutral-800 font-medium leading-5">{plan.mealFrequency}</Text>
            </GradientCard>
          </View>

          {/* 营养补充 */}
          <GradientCard variant="rose" className="p-5 mb-5">
            <View className="flex-row items-center mb-3">
              <Heart size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-bold ml-2">营养补充</Text>
            </View>
            <View className="gap-2">
              {plan.supplements.map((supplement, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-2 h-2 bg-neutral-700 rounded-full" />
                  <Text className="text-neutral-700 ml-2">{supplement}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 喂养建议 */}
          <GradientCard variant="mint" className="p-5 mb-5">
            <View className="flex-row items-center mb-3">
              <Lightbulb size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-bold ml-2">喂养建议</Text>
            </View>
            <View className="gap-3">
              {plan.tips.map((tip, index) => (
                <View key={index} className="flex-row">
                  <View className="w-6 h-6 bg-white/60 rounded-full items-center justify-center mt-0.5 flex-shrink-0">
                    <Text className="text-neutral-800 text-xs font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-neutral-700 flex-1 ml-2 leading-5">{tip}</Text>
                </View>
              ))}
            </View>
          </GradientCard>

          {/* 辅食添加顺序（特定月龄显示） */}
          {selectedAge >= 1 && selectedAge <= 4 && (
            <GradientCard variant="white" className="p-5 mb-5">
              <View className="flex-row items-center mb-3">
                <AppleIcon size={20} color={Colors.mint.DEFAULT} />
                <Text className="text-neutral-800 font-bold ml-2">辅食添加建议</Text>
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
                    className="flex-row items-center bg-mint-light rounded-xl p-3"
                  >
                    <Text className="text-xl">{item.icon}</Text>
                    <Text className="text-neutral-800 ml-2">{item.food}</Text>
                  </View>
                ))}
              </View>
            </GradientCard>
          )}

          {/* 注意事项 */}
          <GradientCard variant="rose" className="p-4 mb-5">
            <View className="flex-row items-center mb-2">
              <AlertCircle size={20} color={Colors.neutral[700]} />
              <Text className="text-neutral-800 font-semibold ml-2">注意事项</Text>
            </View>
            <Text className="text-neutral-700 text-sm leading-5">
              • 1岁前不加盐、糖、蜂蜜{'\n'}
              • 注意食物过敏，逐一添加新食物{'\n'}
              • 避免整粒坚果等窒息风险食物{'\n'}
              • 如有特殊情况请咨询儿科医生
            </Text>
          </GradientCard>

          {/* 底部说明 */}
          <GradientCard variant="lavender" className="p-4">
            <Text className="text-neutral-700 text-sm leading-5">
              * 以上为一般性建议，具体喂养方案请根据宝宝实际情况，并在儿科医生或营养师指导下进行调整。
            </Text>
          </GradientCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
