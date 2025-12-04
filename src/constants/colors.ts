/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description GoDad App 色彩系统 - 方案A: 柔和粉彩全球标准
 */

export const Colors = {
  // 主品牌色 - 柔和桃粉
  primary: {
    50: '#FFF5F3',
    100: '#FFE8E3',
    200: '#FFCFC4',
    300: '#FFB3A5',
    400: '#FF9B8A',  // 主色调 - 柔和桃粉
    500: '#FF8A75',
    600: '#F77665',
    700: '#E96354',
    800: '#D85444',
    900: '#C24535',
  },

  // 辅助色 - 柔和系列
  lavender: {
    DEFAULT: '#E6D9F2',
    light: '#F0E8F7',
    dark: '#D4C4E3',
  },
  mint: {
    DEFAULT: '#D4F0E8',
    light: '#E5F7F1',
    dark: '#C3E6DC',
  },
  sky: {
    DEFAULT: '#D9EDFF',
    light: '#E8F4FF',
    dark: '#C7E2F7',
  },
  butter: {
    DEFAULT: '#FFF4D9',
    light: '#FFF9E8',
    dark: '#F7EBCA',
  },
  rose: {
    DEFAULT: '#FFE0E8',
    light: '#FFF0F3',
    dark: '#F7D1DC',
  },

  // 中性色
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D4D4D4',
    400: '#A0A0A0',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // 功能色 - 柔和版本
  success: '#7ED7C1',
  warning: '#FFD19A',
  error: '#FFB4AB',
  info: '#B3D9FF',

  // 背景色
  background: {
    page: '#FAFAFA',
    gradientStart: '#FFF5F3',
    gradientEnd: '#FFE8E3',
  },
} as const;

// 渐变配置（用于LinearGradient）
export const Gradients = {
  // 主色渐变
  primary: ['#FF9B8A', '#FFB3A5'],

  // 辅助色渐变
  lavender: ['#E6D9F2', '#F0E8F7'],
  mint: ['#D4F0E8', '#E5F7F1'],
  sky: ['#D9EDFF', '#E8F4FF'],
  butter: ['#FFF4D9', '#FFF9E8'],
  rose: ['#FFE0E8', '#FFF0F3'],

  // 页面背景渐变
  pageBackground: ['#FFF5F3', '#FFE8E3'],
} as const;
