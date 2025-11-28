import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GrowthRecord {
  id: string;
  date: string;
  height: number;
  weight: number;
  headCircumference?: number;
  note?: string;
}

export default function GrowthRecordScreen() {
  const [records, setRecords] = useState<GrowthRecord[]>([
    { id: '1', date: '2024-01-15', height: 50, weight: 3.5 },
    { id: '2', date: '2024-02-15', height: 54, weight: 4.2 },
    { id: '3', date: '2024-03-15', height: 58, weight: 5.0 },
    { id: '4', date: '2024-04-15', height: 61, weight: 5.8 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: '',
    height: '',
    weight: '',
    headCircumference: '',
    note: '',
  });

  const addRecord = () => {
    if (!newRecord.date || !newRecord.height || !newRecord.weight) {
      Alert.alert('提示', '请填写完整的日期、身高和体重');
      return;
    }

    const height = parseFloat(newRecord.height);
    const weight = parseFloat(newRecord.weight);

    if (isNaN(height) || isNaN(weight)) {
      Alert.alert('提示', '请输入正确的身高和体重数值');
      return;
    }

    const record: GrowthRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      height,
      weight,
      headCircumference: newRecord.headCircumference
        ? parseFloat(newRecord.headCircumference)
        : undefined,
      note: newRecord.note || undefined,
    };

    setRecords([record, ...records]);
    setNewRecord({
      date: '',
      height: '',
      weight: '',
      headCircumference: '',
      note: '',
    });
    setShowForm(false);
    Alert.alert('成功', '记录已添加');
  };

  const latestRecord = records[0];
  const previousRecord = records[1];

  const getGrowthChange = (current: number, previous: number) => {
    const diff = current - previous;
    return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  };

  return (
    <>
      <Stack.Screen options={{ title: '生长记录' }} />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          {/* 最新数据卡片 */}
          {latestRecord && (
            <View className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-5 mb-4">
              <Text className="text-white/80 text-sm">最新记录 · {latestRecord.date}</Text>
              <View className="flex-row justify-around mt-4">
                <View className="items-center">
                  <Text className="text-white text-3xl font-bold">
                    {latestRecord.height}
                  </Text>
                  <Text className="text-white/70 text-sm mt-1">身高 (cm)</Text>
                  {previousRecord && (
                    <Text className="text-white/60 text-xs mt-1">
                      {getGrowthChange(latestRecord.height, previousRecord.height)} cm
                    </Text>
                  )}
                </View>
                <View className="w-px bg-white/30" />
                <View className="items-center">
                  <Text className="text-white text-3xl font-bold">
                    {latestRecord.weight}
                  </Text>
                  <Text className="text-white/70 text-sm mt-1">体重 (kg)</Text>
                  {previousRecord && (
                    <Text className="text-white/60 text-xs mt-1">
                      {getGrowthChange(latestRecord.weight, previousRecord.weight)} kg
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* 添加记录按钮/表单 */}
          {showForm ? (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-800 font-bold">添加记录</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-gray-600 text-sm mb-1">日期</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                  placeholder="如：2024-05-15"
                  placeholderTextColor="#9ca3af"
                  value={newRecord.date}
                  onChangeText={(text) => setNewRecord({ ...newRecord, date: text })}
                />
              </View>

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">身高 (cm)</Text>
                  <TextInput
                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                    placeholder="如：65"
                    placeholderTextColor="#9ca3af"
                    value={newRecord.height}
                    onChangeText={(text) => setNewRecord({ ...newRecord, height: text })}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">体重 (kg)</Text>
                  <TextInput
                    className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                    placeholder="如：6.5"
                    placeholderTextColor="#9ca3af"
                    value={newRecord.weight}
                    onChangeText={(text) => setNewRecord({ ...newRecord, weight: text })}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-gray-600 text-sm mb-1">头围 (cm) - 可选</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                  placeholder="如：42"
                  placeholderTextColor="#9ca3af"
                  value={newRecord.headCircumference}
                  onChangeText={(text) =>
                    setNewRecord({ ...newRecord, headCircumference: text })
                  }
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 text-sm mb-1">备注 - 可选</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800"
                  placeholder="如：体检日、打疫苗等"
                  placeholderTextColor="#9ca3af"
                  value={newRecord.note}
                  onChangeText={(text) => setNewRecord({ ...newRecord, note: text })}
                />
              </View>

              <TouchableOpacity
                className="bg-primary-500 py-3 rounded-xl items-center"
                onPress={addRecord}
              >
                <Text className="text-white font-semibold">保存记录</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex-row items-center justify-center"
              onPress={() => setShowForm(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#e76f51" />
              <Text className="text-primary-500 font-medium ml-2">添加新记录</Text>
            </TouchableOpacity>
          )}

          {/* 历史记录 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-800 font-bold mb-4">历史记录</Text>

            {records.length === 0 ? (
              <View className="py-8 items-center">
                <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-400 mt-2">暂无记录</Text>
              </View>
            ) : (
              <View className="gap-3">
                {records.map((record, index) => (
                  <View
                    key={record.id}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-800 font-medium">{record.date}</Text>
                      {index === 0 && (
                        <View className="bg-green-100 px-2 py-0.5 rounded">
                          <Text className="text-green-600 text-xs">最新</Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="resize-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-1">
                          身高：{record.height} cm
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="fitness-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-1">
                          体重：{record.weight} kg
                        </Text>
                      </View>
                    </View>
                    {record.headCircumference && (
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="ellipse-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-1">
                          头围：{record.headCircumference} cm
                        </Text>
                      </View>
                    )}
                    {record.note && (
                      <Text className="text-gray-400 text-sm mt-2">
                        备注：{record.note}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 提示 */}
          <View className="mt-4 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-700 font-medium ml-2">测量建议</Text>
            </View>
            <Text className="text-blue-600 text-sm mt-2 leading-5">
              • 建议每月同一时间测量，确保数据可比性{'\n'}
              • 身高测量时脱鞋，体重测量时穿轻薄衣物{'\n'}
              • 定期记录有助于及时发现生长发育问题
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
