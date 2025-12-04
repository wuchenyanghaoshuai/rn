/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 方案A: 柔和粉彩 - 全球标准
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
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
      boxShadow: {
        // 方案A阴影系统
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // 特殊阴影 - 主色调
        'primary': '0 4px 12px rgba(255, 155, 138, 0.3)',
        'primary-lg': '0 6px 16px rgba(255, 155, 138, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      // 背景色 - 方案A
      backgroundColor: {
        'page': '#FAFAFA',
        'page-gradient-start': '#FFF5F3',
        'page-gradient-end': '#FFE8E3',
      },
      // 间距系统 (8pt网格)
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
      }
    },
  },
  plugins: [],
};
