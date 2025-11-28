import { ScrollView } from 'react-native';
import EmptyState from '../../../src/components/EmptyState';

export default function FollowersScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="people-outline"
        title="粉丝列表即将上线"
        description="稍后可以在这里查看关注你的用户。"
      />
    </ScrollView>
  );
}
