import { ScrollView } from 'react-native';
import EmptyState from '../../src/components/EmptyState';

export default function ChangePasswordScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="lock-closed-outline"
        title="修改密码即将上线"
        description="密码修改功能正在开发中，请稍后再试。"
      />
    </ScrollView>
  );
}
