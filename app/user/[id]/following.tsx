import { ScrollView } from 'react-native';
import EmptyState from '../../../src/components/EmptyState';

export default function FollowingScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="people-circle-outline"
        title="关注列表即将上线"
        description="稍后可以在这里查看你关注的用户。"
      />
    </ScrollView>
  );
}
