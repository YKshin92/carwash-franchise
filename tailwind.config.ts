// tailwind.config.ts
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"; // ✅ default import로 변경

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // layout.tsx에서 variable: "--font-sans"로 등록한 폰트를 site 기본 폰트로 사용
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        // (선택) 헤딩 전용 폰트 변수도 쓴다면:
        // heading: ["var(--font-heading)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // ESM 환경 문제 없으면 그대로 사용
};

export default config;