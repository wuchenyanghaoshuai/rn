import { ScrollView } from 'react-native';
import EmptyState from '../../src/components/EmptyState';

export default function UserMomentsScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="chatbubbles-outline"
        title="我的动态即将上线"
        description="稍后可以在这里查看和管理你的动态。"
      />
    </ScrollView>
  );
}
