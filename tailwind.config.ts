import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // layout.tsx에서 주입한 --font-sans를 전역 기본 서체로 사용
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "Noto Sans KR",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;