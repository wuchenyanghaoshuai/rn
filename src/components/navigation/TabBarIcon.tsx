/**
 * @author Julian Wu
 * @date 2024-12-03
 * @description 底部导航Tab图标组件 - 使用Lucide图标库，支持选中态动画
 */

import { House, BookOpen, Sparkles, MessageCircle, CircleUser, LucideIcon } from 'lucide-react-native';

export type TabIconName = 'home' | 'articles' | 'ai' | 'square' | 'profile';

interface TabBarIconProps {
  name: TabIconName;
  focused: boolean;
  color: string;
  size?: number;
}

const ICON_MAP: Record<TabIconName, LucideIcon> = {
  home: House,
  articles: BookOpen,
  ai: Sparkles,
  square: MessageCircle,
  profile: CircleUser,
};

export function TabBarIcon({ name, focused, color, size = 22 }: TabBarIconProps) {
  const IconComponent = ICON_MAP[name];

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={focused ? 2.2 : 1.8}
    />
  );
}
