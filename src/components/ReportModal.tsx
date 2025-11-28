import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reportApi } from '../api/report';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetType: 'article' | 'moment' | 'comment';
  targetId: number;
}

const REPORT_REASONS = [
  '垃圾广告',
  '不实信息',
  '辱骂/人身攻击',
  '涉黄/违法',
  '其他',
];

export default function ReportModal({
  visible,
  onClose,
  targetType,
  targetId,
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      Alert.alert('提示', '请选择举报理由');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportApi.create({
        target_type: targetType,
        target_id: targetId,
        reason,
        description,
      });
      Alert.alert('提交成功', '我们会尽快核实您的举报', [
        {
          text: '确定',
          onPress: () => {
            setReason('');
            setDescription('');
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('提交失败', error.message || '请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="bg-white rounded-t-2xl p-4 h-3/4"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">举报内容</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-600 mb-2 font-medium">举报理由</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {REPORT_REASONS.map((r) => (
                  <TouchableOpacity
                    key={r}
                    className={`px-3 py-2 rounded-full border ${
                      reason === r
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-white border-gray-200'
                    }`}
                    onPress={() => setReason(r)}
                  >
                    <Text
                      className={
                        reason === r ? 'text-primary-600' : 'text-gray-600'
                      }
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-gray-600 mb-2 font-medium">
                补充说明 (可选)
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-3 min-h-[100px] text-gray-700 text-base border border-gray-100"
                placeholder="请详细描述违规情况..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />

              <View className="flex-1" />

              <TouchableOpacity
                className={`w-full py-3 rounded-full items-center mt-4 ${
                  isSubmitting || !reason ? 'bg-gray-300' : 'bg-red-500'
                }`}
                disabled={isSubmitting || !reason}
                onPress={handleSubmit}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">提交举报</Text>
                )}
              </TouchableOpacity>
              <View className="h-6" />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
