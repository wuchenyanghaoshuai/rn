import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MealRecipe {
  id: string;
  name: string;
  category: string;
  ageRange: string;
  ingredients: string[];
  steps: string[];
  nutrition: string;
  cookTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const recipes: MealRecipe[] = [
  {
    id: '1',
    name: '西红柿鸡蛋面',
    category: '主食',
    ageRange: '1岁以上',
    ingredients: ['面条 100g', '鸡蛋 1个', '西红柿 1个', '少许盐'],
    steps: [
      '西红柿切小块，鸡蛋打散',
      '锅中加水烧开，放入面条煮熟捞出',
      '另起锅加少许油，炒鸡蛋盛出',
      '继续炒西红柿出汁，加入鸡蛋和面条翻炒',
      '少许盐调味即可',
    ],
    nutrition: '富含蛋白质、番茄红素和碳水化合物',
    cookTime: '20分钟',
    difficulty: 'easy',
  },
  {
    id: '2',
    name: '蔬菜瘦肉粥',
    category: '主食',
    ageRange: '8个月以上',
    ingredients: ['大米 50g', '瘦肉末 30g', '胡萝卜 20g', '青菜 20g'],
    steps: [
      '大米淘洗干净，加水煮粥',
      '瘦肉末用少许料酒腌制去腥',
      '胡萝卜切碎丁，青菜切碎',
      '粥煮至软烂，加入肉末和胡萝卜',
      '继续煮10分钟，最后加入青菜煮2分钟',
    ],
    nutrition: '营养均衡，易消化吸收',
    cookTime: '40分钟',
    difficulty: 'easy',
  },
  {
    id: '3',
    name: '清蒸鳕鱼',
    category: '荤菜',
    ageRange: '10个月以上',
    ingredients: ['鳕鱼 1块', '姜片 2片', '葱段少许', '蒸鱼豉油少许'],
    steps: [
      '鳕鱼解冻洗净，用厨房纸吸干水分',
      '鱼身放姜片和葱段',
      '水开后放入锅中大火蒸8-10分钟',
      '取出去掉姜葱，淋上少许蒸鱼豉油',
      '可以压成鱼泥给小月龄宝宝',
    ],
    nutrition: '富含DHA和优质蛋白',
    cookTime: '15分钟',
    difficulty: 'easy',
  },
  {
    id: '4',
    name: '彩椒牛肉丝',
    category: '荤菜',
    ageRange: '1.5岁以上',
    ingredients: ['牛肉 100g', '彩椒 1个', '蒜末少许', '生抽少许'],
    steps: [
      '牛肉切丝，加少许淀粉和生抽腌制15分钟',
      '彩椒洗净切丝',
      '热锅加油，放入牛肉丝快速翻炒至变色盛出',
      '锅中再加少许油，放入蒜末和彩椒翻炒',
      '加入牛肉丝，调味翻炒均匀即可',
    ],
    nutrition: '富含铁和维生素C，促进铁吸收',
    cookTime: '25分钟',
    difficulty: 'medium',
  },
  {
    id: '5',
    name: '番茄豆腐汤',
    category: '汤品',
    ageRange: '10个月以上',
    ingredients: ['嫩豆腐 1块', '番茄 1个', '鸡蛋 1个', '香菜少许'],
    steps: [
      '豆腐切小块，番茄切小块',
      '锅中加水烧开，放入番茄煮出汁',
      '加入豆腐块煮3分钟',
      '打入蛋花，调味',
      '撒上香菜末即可',
    ],
    nutrition: '富含植物蛋白和番茄红素',
    cookTime: '15分钟',
    difficulty: 'easy',
  },
  {
    id: '6',
    name: '西兰花炒虾仁',
    category: '荤菜',
    ageRange: '1岁以上',
    ingredients: ['西兰花 150g', '虾仁 100g', '蒜末少许', '盐少许'],
    steps: [
      '西兰花掰成小朵，焯水备用',
      '虾仁去虾线，用料酒腌制5分钟',
      '热锅加油，放入蒜末爆香',
      '加入虾仁翻炒至变红',
      '加入西兰花翻炒，调味出锅',
    ],
    nutrition: '富含蛋白质、钙和维生素',
    cookTime: '20分钟',
    difficulty: 'easy',
  },
];

const categories = ['全部', '主食', '荤菜', '素菜', '汤品'];
const difficulties = {
  easy: { label: '简单', color: '#22c55e' },
  medium: { label: '中等', color: '#f59e0b' },
  hard: { label: '困难', color: '#ef4444' },
};

export default function FamilyMealPlanScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const filteredRecipes = recipes.filter(
    (r) => selectedCategory === '全部' || r.category === selectedCategory
  );

  const toggleRecipe = (id: string) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  return (
    <>
      <Stack.Screen options={{ title: '家庭食谱' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 介绍横幅 */}
          <View className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 mb-4">
            <Text className="text-white text-lg font-bold">营养家庭食谱</Text>
            <Text className="text-white/80 mt-2 leading-5">
              精选适合宝宝和全家人的营养食谱，简单易做，美味健康。
            </Text>
          </View>

          {/* 分类筛选 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-primary-500' : 'bg-white'
                  }`}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    className={`font-medium ${
                      selectedCategory === category ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 食谱列表 */}
          <View className="gap-4">
            {filteredRecipes.map((recipe) => {
              const isExpanded = expandedRecipe === recipe.id;
              const diffConfig = difficulties[recipe.difficulty];

              return (
                <View key={recipe.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* 食谱头部 */}
                  <TouchableOpacity
                    className="p-4"
                    onPress={() => toggleRecipe(recipe.id)}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="text-gray-800 font-bold text-lg">
                            {recipe.name}
                          </Text>
                          <View
                            className="ml-2 px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${diffConfig.color}20` }}
                          >
                            <Text
                              className="text-xs"
                              style={{ color: diffConfig.color }}
                            >
                              {diffConfig.label}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row items-center mt-2">
                          <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={14} color="#9ca3af" />
                            <Text className="text-gray-400 text-sm ml-1">
                              {recipe.cookTime}
                            </Text>
                          </View>
                          <View className="flex-row items-center ml-4">
                            <Ionicons name="person-outline" size={14} color="#9ca3af" />
                            <Text className="text-gray-400 text-sm ml-1">
                              {recipe.ageRange}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                  </TouchableOpacity>

                  {/* 展开的详情 */}
                  {isExpanded && (
                    <View className="px-4 pb-4 border-t border-gray-100">
                      {/* 食材 */}
                      <View className="mt-4">
                        <Text className="text-gray-700 font-medium mb-2">食材准备</Text>
                        <View className="flex-row flex-wrap gap-2">
                          {recipe.ingredients.map((ingredient, index) => (
                            <View
                              key={index}
                              className="bg-amber-50 px-3 py-1 rounded-full"
                            >
                              <Text className="text-amber-700 text-sm">{ingredient}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* 步骤 */}
                      <View className="mt-4">
                        <Text className="text-gray-700 font-medium mb-2">烹饪步骤</Text>
                        <View className="gap-2">
                          {recipe.steps.map((step, index) => (
                            <View key={index} className="flex-row">
                              <View className="w-5 h-5 bg-primary-100 rounded-full items-center justify-center mt-0.5">
                                <Text className="text-primary-500 text-xs font-bold">
                                  {index + 1}
                                </Text>
                              </View>
                              <Text className="text-gray-600 flex-1 ml-2 leading-5">
                                {step}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* 营养 */}
                      <View className="mt-4 bg-green-50 rounded-xl p-3">
                        <View className="flex-row items-center">
                          <Ionicons name="nutrition-outline" size={16} color="#22c55e" />
                          <Text className="text-green-700 font-medium ml-1">营养特点</Text>
                        </View>
                        <Text className="text-green-600 text-sm mt-1">
                          {recipe.nutrition}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* 烹饪小贴士 */}
          <View className="mt-6 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bulb-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-700 font-bold ml-2">烹饪小贴士</Text>
            </View>
            <Text className="text-blue-600 text-sm leading-5">
              • 1岁以内宝宝的辅食不加盐{'\n'}
              • 食材要新鲜，烹饪要熟透{'\n'}
              • 根据宝宝月龄调整食物质地{'\n'}
              • 尝试新食物时观察是否过敏
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
