"use client";
/**
 * CarWashFranchiseSite.tsx
 * - 참고파일(문래돼지불백 스켈레톤)의 섹션/컴포넌트 구조를 "세차장 가맹 모집"에 맞게 치환
 * - Tailwind + shadcn/ui + framer-motion + lucide-react 유지
 * - 모든 사용자 변경 포인트에 (수정) 마커 및 주석 제공
 *
 * TODO(연동):
 *  - 문의 폼 실제 전송: /api/inquiry, Formspree, Airtable, Google Forms 등과 연결
 *  - 지점 데이터: JSON/구글시트/Headless CMS 연동
 *  - 미디어 보드: 보도자료 RSS/노션/블로그 연동
 */

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Edit3,
  MapPin,
  Phone,
  Newspaper,
  Building2,
  ArrowUp,
  Send,
  Palette,
  Droplets,
  Wrench,
  Sparkles,
} from "lucide-react";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";

import { useMotionValue, useTransform, useAnimationFrame, wrap } from "framer-motion";
import {ChevronLeft, ChevronRight } from "lucide-react";

// ✅ page.tsx 최상단의 import들 다음 줄에 붙여넣기
function useScrollSpy(ids: string[], headerOffset = 96) {
  const [activeId, setActiveId] = React.useState<string>(ids[0] ?? "");

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    // Fallback: IntersectionObserver 미지원/요소 없음 → 스크롤 계산식
    const fallback = () => {
      let current = ids[0] ?? "";
      let minDist = Number.POSITIVE_INFINITY;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // 헤더 높이만큼 보정
        const dist = Math.abs(rect.top - headerOffset);
        // 화면 상단을 지난 섹션 중 가장 가까운 것을 선택
        if (rect.top - headerOffset <= 0 && dist < minDist) {
          minDist = dist;
          current = id;
        }
      }
      setActiveId(current);
    };

    // IntersectionObserver 사용 (권장)
    if ("IntersectionObserver" in window && elements.length) {
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]?.target?.id) {
            setActiveId((visible[0].target as HTMLElement).id);
          } else {
            // 보이는 섹션이 없으면 폴백 계산
            fallback();
          }
        },
        // 상단은 고정 헤더만큼 여유(-headerOffset), 하단은 -55%로 '중간쯤' 보이면 활성 처리
        { rootMargin: `-${headerOffset}px 0px -55% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      elements.forEach((el) => io.observe(el));
      // 최초 1회 폴백으로 초기 active 계산
      fallback();
      return () => io.disconnect();
    }

    // 폴백(스크롤 이벤트)
    const onScroll = () => fallback();
    fallback();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, headerOffset]);

  return activeId;
}


/* =========================================================
   0) 모든 수정 포인트를 한곳에서 관리하는 content 객체
   - 텍스트/연락처/이미지 라벨/표 항목/링크 등을 포함
   - (수정) 마커를 검색해서 필요한 부분만 바꾸면 전체 사이트 반영
   ========================================================= */
const content = {
  // 네비게이션: 섹션 ID와 라벨(앵커 내비로 이동)
  navigation: [
    { id: "home", label: "Home" },
    { id: "brand", label: "Brand" },
    { id: "wash", label: "세차 시스템" }, // Single Menu 유사 섹션
    { id: "franchise", label: "가맹 안내" },
    { id: "startup", label: "창업 절차" },
    { id: "media", label: "미디어" },
    { id: "locations", label: "가맹점 현황" },
    { id: "inquiry", label: "창업 문의" },
  ],

  // 히어로(메인 배너)
  home: {
    hero_title: "WELCOME WASH", // 메인 카피
    hero_subtitle:
      "무인·저인건비·고회전 모델로 지역 상권을 선점하세요. 설치부터 운영까지 본사 풀케어 지원.", // 서브 카피
    hero_image: "메인 키비주얼 (수정)", // 실제 이미지 적용 시 <img>로 교체 권장
    primary_cta: "브랜드 소개",
    secondary_cta: "창업 문의",
  },

  // 브랜드(정체성/컬러/스토리)
  brand: {
    story_heading: "브랜드 스토리 (수정)",
    story_body:
      "당사는 데이터 기반 상권분석과 표준화된 운영 매뉴얼로 안정적인 수익 모델을 제시합니다. 24시간 무인 운영, 자동 결제, 실시간 모니터링으로 운영 리스크를 낮췄습니다. (수정)",
    slogan: "쉽고 똑똑한 무인 세차 플랫폼 (수정)",
    identity: {
      trademark_notice: "® 상표/등록번호 표기 (수정/삭제)",
      items: [
        { name: "로고 (수정)", key: "logotype" },
        { name: "워드마크 (수정)", key: "wordmark" },
        { name: "심볼 (수정)", key: "symbol" },
        { name: "결합형 로고 (수정)", key: "combined_mark" },
        { name: "가이드 커버 (수정)", key: "guide_cover" },
        { name: "간판 시안 (수정)", key: "signage" },
      ],
      // Tailwind 색상 토큰과 매핑 권장(brand-primary 등)
      color_system: [
        { name: "메인 컬러 (수정)", value: "#1E90FF" },
        { name: "보조 컬러 1 (수정)", value: "#0EA5E9" },
        { name: "보조 컬러 2 (수정)", value: "#111827" },
      ],
    },
  },

  // 세차 시스템(= 참조사이트의 Single Menu 성격)
wash_system: {
  // ── 터널식 타입(카탈로그 기반) ─────────────────────────────
  tunnel: {
    title: "터널식 타입",
    subtitle: "극강의 프리미엄 노브러쉬 세차기 · 최첨단 터널식 세차 시스템",
    // public/ 에 이미지 파일(wash01.png~05.png)을 넣어주세요.
    heroImage: "/washsystem/tunnel/wash01.png",

    // 요구하신 4가지 특징
    highlights: [
      {
        title: "빠른 세차 속도",
        bullets: ["1분 30초 세차 완성", "시간당 40대 소화 가능"],
      },
      {
        title: "올인원 세차 시스템",
        bullets: ["프리워시 / 휠 / 스노우폼 / 발수코팅 완벽 소화"],
      },
      {
        title: "첨단 세정 기술",
        bullets: ["스윙 제트 방식", "초고압수"],
      },
      {
        title: "완벽한 건조 시스템",
        bullets: ["스윙 방식의 터보건조"],
      },
    ],

    // 차량 한계치(카탈로그 표기)
    vehicleLimits: [
      { label: "최대 세차 높이", value: "2.6 m" },
      { label: "최대 세차 길이", value: "제한 없음" },
      { label: "최대 세차 폭", value: "2.2 m" },
    ],

    // "터널식 타입 상세" (차별화 포인트 + 4개 이미지)
    detail: {
      points: [
        {
          label: "신속함",
          body:
            "1분 30초 올인원 프리미엄 세차로 시간당 최대 40대 처리 가능. 대량 차량 처리와 고객 만족을 동시에 달성합니다.",
        },
        {
          label: "진보함",
          body:
            "스윙 제트 초고압수로 부위별 맞춤 세정, 소재에 따른 압력 조절 가능. 최신 세차 기술의 집약체입니다.",
        },
        {
          label: "안전함",
          body:
            "4륜 컨베이어 벨트, 이탈리아/독일제 최고급 센서, 이중 안전 시스템으로 차량과 고객을 철저히 보호합니다.",
        },
      ],
      images: [
        { src: "/washsystem/tunnel/wash02.png", label: "CAD도면" },
        { src: "/washsystem/tunnel/wash03.png", label: "스윙 터보 시스템" },
        { src: "/washsystem/tunnel/wash04.png", label: "4륜 컨베이어 벨트" },
        { src: "/washsystem/tunnel/wash05.png", label: "이탈리아/독일제 근접센서" },
      ],
    },

    // "기술사양 / 상세 내용" 표(카탈로그 v1.1)
    specs: [
      { key: "설비 제원", value: "길이×너비×높이 = 7,600 × 3,700 × 3,000 mm" },
      { key: "설치 제원", value: "길이×너비×높이 = 10,000 × 4,200 × 3,200 mm" },
      { key: "전기 사양", value: "380V / 60Hz (3상), 최대 운행 출력 80 kW" },
      // 카탈로그 표기상 50대/시간이 있으므로 병기 안내는 컴포넌트 하단 주석으로 처리
      { key: "세차 속도", value: "90초/대, 연속 50대/시간" },
      { key: "물 소비", value: "240–300 L/대" },
      { key: "전력 사용량", value: "1.2–1.5 kWh/대" },
      { key: "차량 한계", value: "높이 2.6 m, 폭 2.2 m, 길이 제한 없음" },
    ],
    note:
      "카탈로그 v1.1 기준 수치. 90초/대는 이론상 약 40대/시간과 동일하며, 카탈로그에는 '연속 50대/시간' 표기도 존재합니다.",
  },
},

  // 가맹 안내(혜택/절차/표준 개설 내역서)
  franchise: {
    notice_title: "세차장 가맹점 모집공고 (수정)",
    benefits: ["상권·입지 무상 컨설팅 (수정)", "표준 시공/장비 패키지 공급 (수정)", "오픈 마케팅 지원 (수정)"],
    standard_opening_sheet: [
      { 구분: "초기 가맹금", 항목: "가입비/교육비/보증금 (수정)", 합계: "금액 기입 (수정)" },
      { 구분: "시설·인테리어", 항목: "부스 시공/전기/배관/배수 (수정)", 합계: "금액 기입 (수정)" },
      { 구분: "주요 장비", 항목: "고압세척기/컴프레서/정수설비 (수정)", 합계: "금액 기입 (수정)" },
      { 구분: "결제·POS", 항목: "선불기/키오스크/프린터/모니터 (수정)", 합계: "금액 기입 (수정)" },
      { 구분: "초도 물품", 항목: "세제/코팅제/유니폼/소모품 (수정)", 합계: "금액 기입 (수정)" },
    ],
    process_steps: [
      "1. 초기 상담/타당성 검토 (수정)",
      "2. 상권 분석·입지 확정 (수정)",
      "3. 점포/부지 계약 (수정)",
      "4. 가맹계약 체결 (수정)",
      "5. 설계·시공·장비 셋업 (수정)",
      "6. 운영 교육·오픈 지원 (수정)",
    ],
  },

  // 창업 절차/혜택(간단한 소개+이미지 플레이스홀더)
  startup: {
    benefits:
      "초기 투자 구간별 컨설팅, 무인 운영 메뉴얼, 유지보수/부품 공급, 마케팅 키트 제공 등 (수정)",
    images: ["부스 시공 이미지 (수정)", "관제 화면 (수정)"],
  },

  // 미디어/보도/소식 보드(간이 카드 리스트)
  news: {
    board_title: "보도/소식 (수정)",
    items: [
      { title: "세차 부문 프랜차이즈 박람회 참가 (수정)", date: "YYYY-MM-DD", url: "#" },
      { title: "신규 직영점 오픈 (수정)", date: "YYYY-MM-DD", url: "#" },
      { title: "장비 업그레이드 라인업 공개 (수정)", date: "YYYY-MM-DD", url: "#" },
    ],
  },

  // 매장/지점(전화/지도링크)
  locations: {
    stores: [
      { name: "웰컴워시 송도점", phone: "0507-1313-0853", map_link: "https://naver.me/xq3dSvgy", image: "/stores/송도점.jpg", imageAlt: "송도점전경"},
      { name: "웰컴워시 운남점", phone: "0507-1347-3497", map_link: "https://naver.me/FtGgKl3M", image: "/stores/운남점.jpg", imageAlt: "운남점전경"},
      { name: "싸이칸워시 청학점", phone: "0507-1411-2010", map_link: "https://naver.me/xIeANgBZ", image: "/stores/청학점.jpg", imageAlt: "청학점전경"},
    ],
  },

  // 연락처/회사정보/푸터
  contact: { phone: "대표전화 0000-0000 (수정)", email: "info@example.com (수정)" },
  footer: {
    company_name: "상호/법인명 (수정)",
    address: "본사 주소 (수정)",
    biz_info: "사업자등록번호·통신판매업신고 (수정)",
  },

  // 문의 폼/약관
  inquiry_form: {
    heading: "창업 문의 (수정)",
    privacy_policy_effective_date: "YYYY-MM-DD (수정)",
    privacy_policy_body:
      "① 수집 항목: 성함, 연락처, 희망지역, 문의 내용 등\n② 이용 목적: 가맹 상담 및 고객 응대\n③ 보유 기간: 목적 달성 후 즉시 파기(법령 예외 제외)\n(수정)",
  },
};

/* =========================================================
   1) 공용 레이아웃용 섹션 컴포넌트
   - 앵커 이동 시 헤더 높이 고려(scroll-mt-24)
   ========================================================= */
function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 ${className || ""}`}>
      {children}
    </section>
  );
}

/* =========================================================
   2) 이미지 플레이스홀더
   - 실제 이미지 교체 전 임시 박스(라벨은 content에서 제어)
   ========================================================= */
function PlaceholderImage({ label = "이미지 (수정)" }: { label?: string }) {
  return (
    <div className="relative h-48 w-full rounded-2xl border border-dashed bg-muted/30 flex items-center justify-center">
      <ImageIcon className="h-10 w-10 opacity-60" />
      <Badge className="absolute top-2 right-2" variant="secondary">
        {label}
      </Badge>
    </div>
  );
}

/* =========================================================
   3) (수정) 태그
   - 수정 필요 요소 강조 라벨
   ========================================================= */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground">
      <Edit3 className="h-3.5 w-3.5" /> {children}
    </span>
  );
}

/* =========================================================
   4) 고정 헤더 + 앵커 내비게이션
   - 참조사이트의 상단 고정/섹션 이동 UX를 모사
   ========================================================= */
   function StickyNav() {
    const ids = content.navigation.map((n) => n.id);
    const activeId = useScrollSpy(ids, 96); // 96은 고정 헤더 높이
    return (
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 좌측 로고/브랜드명 */}
            <a href="#home" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="브랜드 로고"
                className="h-10 w-auto"
              />
            </a>
  
            {/* 데스크탑 내비: md 이상에서만 표시 */}
            <nav className="hidden md:flex gap-4">
              {content.navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={item.id === activeId ? "true" : undefined}
                  className={
                    item.id === activeId
                      ? "text-sm font-medium text-foreground"
                      : "text-sm text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
  
            <div className="flex items-center gap-2">
              {/* 데스크탑 CTA */}
              <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
                <a href="#inquiry">창업 문의</a>
              </Button>
  
              {/* 모바일: 메뉴 버튼 → 오른쪽 드로어(목록형 내비) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="md:hidden" aria-label="메뉴 열기">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
  
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-4">
                    <SheetTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      전체 메뉴
                    </SheetTitle>
                  </SheetHeader>
                  <Separator />
  
                  <ScrollArea className="h-[calc(100vh-4rem)]">
                    <nav className="flex flex-col p-2">
                      {content.navigation.map((item) => (
                        <SheetClose asChild key={item.id}>
                          <a
                            href={`#${item.id}`}
                            aria-current={item.id === activeId ? "true" : undefined}
                            className={
                              item.id === activeId
                                ? "rounded-lg px-3 py-2 text-[15px] font-medium bg-muted/60 text-foreground"
                                : "rounded-lg px-3 py-2 text-[15px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            }
                            
                            aria-label={`${item.label} 섹션으로 이동`}
                          >
                            {item.label}
                          </a>
                        </SheetClose>
                      ))}
  
                      <div className="px-2 my-2">
                        <Separator />
                      </div>
  
                      {/* 모바일 전용 CTA/연락처 */}
                      <div className="px-3 pb-4 space-y-2">
                        <SheetClose asChild>
                          <Button asChild className="w-full">
                            <a href="#inquiry">창업 문의</a>
                          </Button>
                        </SheetClose>
                        <div className="text-xs text-muted-foreground">
                          <div>{content.contact.phone}</div>
                          <div>{content.contact.email}</div>
                        </div>
                      </div>
                    </nav>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    );
  }
/* =========================================================
   5) 히어로(메인 배너)
   - 메인 카피/서브 카피/CTA + 키비주얼
   ========================================================= */
function Hero() {
  return (
    <Section id="home" className="pt-10">
      <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-center">
        {/* 좌: 카피 영역 */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            {content.home.hero_title}
          </motion.h1>
          <p className="mt-3 text-muted-foreground">{content.home.hero_subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>키비주얼 (수정)</Tag>
            <Tag>메인/서브 카피 (수정)</Tag>
            <Tag>컬러·폰트 (수정)</Tag>
          </div>
          {/* CTA 버튼 */}
          <div className="mt-6 flex gap-2">
            <Button asChild>
              <a href="#brand">{content.home.primary_cta}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#inquiry">{content.home.secondary_cta}</a>
            </Button>
          </div>
        </div>
        {/* 우: 이미지 플레이스홀더 */}
        <PlaceholderImage label={content.home.hero_image} />
      </div>
    </Section>
  );
}

/* =========================================================
   6) 브랜드 섹션
   - 스토리/슬로건/컬러 시스템/아이덴티티 샘플
   ========================================================= */
function Brand() {
  return (
    <Section id="brand">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Palette className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">브랜드</h2>
          <Tag>브랜드 스토리/아이덴티티 (수정)</Tag>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 스토리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>{content.brand.story_heading}</CardTitle>
              <CardDescription>{content.brand.slogan}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-sm text-muted-foreground">
                {content.brand.story_body}
              </p>
              <div className="mt-3">
                <Tag>{content.brand.identity.trademark_notice}</Tag>
              </div>
            </CardContent>
          </Card>

          {/* 컬러 시스템 */}
          <Card>
            <CardHeader>
              <CardTitle>컬러 시스템 (수정)</CardTitle>
              <CardDescription>브랜드 기본/보조 컬러</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {content.brand.identity.color_system.map((c, i) => (
                  <div key={i} className="rounded-2xl border p-4">
                    {/* 실제 Tailwind 테마 연결 시 style={{ backgroundColor: c.value }} */}
                    <div className="h-16 w-full rounded-xl border bg-muted/40" />
                    <div className="mt-2 text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 아이덴티티 항목들(로고/간판 등) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.brand.identity.items.map((item) => (
            <Card key={item.key}>
              <CardHeader>
                <CardTitle className="text-base">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceholderImage label={`${item.name}`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================
   7) 세차 시스템(= Single Menu 유사) 섹션
   - 성능/지표/갤러리/특장점 타일
   ========================================================= */
function WashSystem() {
  const t = content.wash_system.tunnel;

  return (
    <Section id="wash">
      <div className="mx-auto max-w-6xl px-4">
        {/* 섹션 헤더 */}
        <div className="mb-8 flex items-center gap-3">
          <ImageIcon className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">세차 시스템 · 터널식 타입</h2>
        </div>

        {/* 메인 소개 + 히어로 이미지 + 4가지 특징 */}
        <Card>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6">
              <h3 className="text-xl font-semibold">{t.title}</h3>
              <p className="mt-1 text-muted-foreground">{t.subtitle}</p>

              {/* 4가지 핵심 특징 */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {t.highlights.map((h, i) => (
                  <div key={i} className="rounded-xl border p-4">
                    <div className="font-medium">{h.title}</div>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                      {h.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 차량 한계치(칩) */}
              <div className="mt-5 flex flex-wrap gap-2">
                {t.vehicleLimits.map((m, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground"
                    aria-label={`${m.label} ${m.value}`}
                  >
                    {m.label}: <span className="ml-1 font-medium text-foreground">{m.value}</span>
                  </span>
                ))}
              </div>
              {/* 출처 표기(카탈로그 기반) */}
              <p className="mt-3 text-[11px] text-muted-foreground">
                ※ 사양 및 치수는 카탈로그 v1.1 기준입니다.
              </p>
            </div>

            {/* 히어로 이미지 */}
          <div className="p-6 pt-0 md:p-6 md:pt-6">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]"> 
              <Image
                src={t.heroImage} // "/wash01.png"
                alt="터널식 타입 메인 이미지"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="rounded-xl border object-cover"
                priority
              />
            </div>
           </div>
          </div>
        </Card>

        {/* 상세: 차별화 3포인트 + 4개 이미지 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>터널식 타입 상세</CardTitle>
            <CardDescription>차별화 포인트 및 기술 사양</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 3포인트 */}
            <div className="grid gap-4 md:grid-cols-3">
              {t.detail.points.map((p, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">{p.label}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>

            {/* 4개 이미지 */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {t.detail.images.map((img, i) => (
                <div key={i} className="relative">
                  <Image
                    src={img.src}
                    alt={img.label}
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full rounded-xl border object-cover"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-1 text-[11px]">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 기술 사양 / 상세 내용 표 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>기술사양 / 상세 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <colgroup>
                  <col className="w-[160px]" />
                  <col />
                </colgroup>
                <thead>
                  <tr className="text-left">
                    <th className="py-2 pr-4">항목</th>
                    <th className="py-2 pr-4">사양</th>
                  </tr>
                </thead>
                <tbody>
                  {t.specs.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 pr-4 font-medium">{row.key}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              * 90초/대는 이론상 약 40대/시간과 동일합니다(카탈로그에는 ‘연속 50대/시간’ 표기도 병기). 운영 환경에 따라 변동될 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* =========================================================
   8) 가맹 안내
   - 혜택/창업 절차/표준 개설 내역서 테이블
   ========================================================= */
function Franchise() {
  const { notice_title, benefits, standard_opening_sheet, process_steps } = content.franchise;
  return (
    <Section id="franchise">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Building2 className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">가맹 안내</h2>
          <Tag>모집공고/조건 (수정)</Tag>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 모집공고·혜택 */}
          <Card>
            <CardHeader>
              <CardTitle>{notice_title}</CardTitle>
              <CardDescription>혜택·조건 확정 후 반영</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">혜택</Badge>
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 절차 */}
          <Card>
            <CardHeader>
              <CardTitle>창업 절차 (수정)</CardTitle>
              <CardDescription>1~6단계</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2">
                {process_steps.map((s, i) => (
                  <li key={i} className="text-sm">
                    {s}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* 표준 개설 내역서 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>표준 개설 내역서 (수정)</CardTitle>
            <CardDescription>금액/항목 전부 (수정)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 pr-4">구분</th>
                    <th className="py-2 pr-4">항목</th>
                    <th className="py-2 pr-4">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {standard_opening_sheet.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 pr-4">{row["구분"]}</td>
                      <td className="py-2 pr-4">{row["항목"]}</td>
                      <td className="py-2 pr-4">{row["합계"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* =========================================================
   9) 창업 절차/혜택 요약
   - 간단 설명 + 이미지 플레이스홀더
   ========================================================= */
function Startup() {
  const { benefits, images } = content.startup;
  return (
    <Section id="startup">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Building2 className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">창업 절차</h2>
          <Tag>절차/혜택/이미지 (수정)</Tag>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>창업 혜택 (수정)</CardTitle>
              <CardDescription>요약 설명</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefits}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {images.map((label, i) => (
              <PlaceholderImage key={i} label={label} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================
   10) 미디어/보도 보드(카드 목록)
   ========================================================= */
function MediaBoard() {
  const { board_title, items } = content.news;
  return (
    <Section id="media">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Newspaper className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">{board_title}</h2>
          <Tag>게시판/보도자료 (수정)</Tag>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.date}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 실제 링크 연결 시 a href={item.url} */}
                <Button variant="outline" asChild size="sm">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    URL(수정)
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================
   11) 매장 찾기(지점 카드)
   - 전화/지도 링크 노출
   ========================================================= */

function Locations() {
  const { stores } = content.locations;

  // 트랙 데이터를 2배로 만들어 무한루프 자연스럽게
  const looped = [...stores, ...stores];

  // 카드 고정 폭/간격(px) — 이미지 비율과 함께 맞춰 주세요
  const CARD_W = 360;   // md 기준 카드 최소폭과 맞추면 깔끔 (예: min-w-[360px])
  const GAP    = 16;    // gap-4 = 1rem = 16px
  const STEP   = CARD_W + GAP;

  // 자동 흐름 속도(px/s): 값이 클수록 더 빠름 (오른쪽으로 흐르게 +방향)
  const SPEED  = 60;

  // 모션 값과 래핑
  const x = useMotionValue(0);
  const trackSpan = stores.length * STEP; // 원본 길이(2배 중 절반만 래핑 기준)
  const xWrapped = useTransform(x, (v) => `${wrap(-trackSpan, 0, v)}px`);

  // 자동 이동 (마우스 오버 시 일시정지)
  const [paused, setPaused] = useState(false);
  useAnimationFrame((_, delta) => {
    if (paused) return;
    const dx = (SPEED * delta) / 1000; // delta(ms) → s 변환
    x.set(x.get() + dx);
  });

  // 수동 제어: 좌/우 버튼
  const next = () => x.set(x.get() + STEP);   // 오른쪽으로 한 카드만큼
  const prev = () => x.set(x.get() - STEP);   // 왼쪽으로 한 카드만큼

  return (
    <Section id="locations">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <MapPin className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">가맹점 현황</h2>
          <Tag>지점/연락처/지도링크 (수정)</Tag>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* 트랙 */}
          <motion.div
            className="flex gap-4 px-1 pb-2"
            style={{ x: xWrapped, willChange: "transform" }}
          >
            {looped.map((s, i) => (
              <Card
                key={`${s.name}-${i}`}
                className="overflow-hidden min-w-[280px] md:min-w-[360px] lg:min-w-[420px]"
              >
                {s.image ? (
                  <a
                    href={s.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} 지도 열기`}
                  >
                    <img
                      src={s.image}
                      alt={s.imageAlt ?? `${s.name} 사진`}
                      className="w-full aspect-[4/3] object-cover hover:opacity-90 transition"
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </a>
                ) : null}

                <CardHeader>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {s.phone}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </motion.div>

          {/* 좌/우 버튼 */}
          <Button
            size="icon"
            variant="outline"
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 rounded-full"
            onClick={prev}
            aria-label="이전 지점"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 rounded-full"
            onClick={next}
            aria-label="다음 지점"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================
   12) 문의 폼
   - (주의) shadcn Select는 native form name 미포함 → hidden input 동기화
   ========================================================= */
function InquiryForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [agree, setAgree] = useState(false);

  // 유입경로(Select) 값 상태 → hidden input에 동기화하여 FormData에 포함
  const [source, setSource] = useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // hidden input 동기화 보장
    const fd = new FormData(formRef.current || undefined);
    const payload = Object.fromEntries(fd.entries());

    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    // TODO: 실제 전송 연결 (/api/inquiry POST 등)
    console.log("[문의 폼 제출]", payload);
    alert("플레이스홀더 폼입니다. 실제 전송은 연결되어 있지 않습니다. (수정)");
  };

  const sources = [
    "인터넷 검색",
    "유튜브",
    "인스타그램",
    "페이스북",
    "지인 추천",
    "매장 방문",
    "기타",
  ];

  return (
    <Section id="inquiry">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Send className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">{content.inquiry_form.heading}</h2>
          <Tag>정식 문의 전송 연결 (수정)</Tag>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>문의하기 (수정)</CardTitle>
            <CardDescription>성함/연락처/희망지역/유입경로</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">성함</Label>
                  <Input id="name" name="성함" placeholder="성함 (수정)" required />
                </div>
                <div>
                  <Label htmlFor="tel">연락처</Label>
                  <Input id="tel" name="연락처" placeholder="010-0000-0000 (수정)" required />
                </div>
              </div>

              <div>
                <Label htmlFor="region">창업 희망지역</Label>
                <Input id="region" name="창업 희망지역" placeholder="예: 강남구, 수원시 (수정)" />
              </div>

              {/* 유입경로 Select + hidden input */}
              <div>
                <Label>브랜드를 알게 된 경로</Label>
                <Select onValueChange={(v) => setSource(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택 (수정)" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="유입경로" value={source} />
              </div>

              <div>
                <Label htmlFor="memo">메모 (선택)</Label>
                <Textarea id="memo" name="메모" placeholder="문의 내용 (수정)" />
              </div>

              {/* 개인정보 처리방침 박스 */}
              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">개인정보 처리방침 (수정)</div>
                  <div className="text-xs text-muted-foreground">
                    시행일: {content.inquiry_form.privacy_policy_effective_date}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground whitespace-pre-line">
                  {content.inquiry_form.privacy_policy_body}
                </p>
              </div>

              {/* 동의 체크 */}
              <div className="flex items-center gap-2">
                <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                <Label htmlFor="agree" className="text-sm">
                  개인정보 수집 및 이용에 동의합니다. (수정)
                </Label>
              </div>

              <div className="flex justify-end">
                <Button type="submit">문의 제출 (수정)</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

/* =========================================================
   13) 푸터
   - 회사정보/연락처 표기
   ========================================================= */
function Footer() {
  return (
    <footer className="border-t py-10 mt-10">
      <div className="mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">{content.footer.company_name}</div>
          <div className="text-sm text-muted-foreground">{content.footer.address}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          <div>{content.contact.phone}</div>
          <div>{content.contact.email}</div>
        </div>
        <div className="text-sm text-muted-foreground">{content.footer.biz_info}</div>
      </div>
    </footer>
  );
}

/* =========================================================
   14) Back to Top 버튼
   ========================================================= */
function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <Button
      className="fixed bottom-6 right-6 rounded-2xl shadow-lg"
      size="icon"
      variant="default"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

/* =========================================================
   15) 페이지 엔트리
   - 섹션 순서: 히어로 → 브랜드 → 세차시스템 → 가맹 → 창업 → 미디어 → 매장 → 문의
   ========================================================= */
export default function CarWashFranchiseSite() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNav />
      <main>
        <Hero />
        <Brand />
        <WashSystem />
        <Franchise />
        <Startup />
        <MediaBoard />
        <Locations />
        <InquiryForm />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
