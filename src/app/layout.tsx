import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local"

const bmjua = localFont({
  src: [{ path: "./fonts/Pretendard-ExtraBold.otf", weight: "400", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "Apple SD Gothic Neo",
    "Malgun Gothic",
    "Noto Sans KR",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});


export const metadata: Metadata = {
  title: "Welcome Wash",
  description: "웰컴워시에 오신걸 환영합니다",
};

/*
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
*/

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${bmjua.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}