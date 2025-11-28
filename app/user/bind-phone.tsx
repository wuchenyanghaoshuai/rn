import { ScrollView } from 'react-native';
import EmptyState from '../../src/components/EmptyState';

export default function BindPhoneScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <EmptyState
        icon="call-outline"
        title="手机号绑定即将上线"
        description="绑定手机号用来找回账号、提升安全性。功能即将到来。"
      />
    </ScrollView>
  );
}
