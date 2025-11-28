import { ScrollView } from 'react-native';
import EmptyState from '../../src/components/EmptyState';

export default function EditProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="create-outline"
        title="资料编辑即将上线"
        description="很快就能在这里修改头像、昵称和个人简介。"
      />
    </ScrollView>
  );
}
