import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "quill/dist/quill.snow.css";
import Providers from "./providers";
import "@/styles/font.css";
import { FontProvider } from "@/context/FontContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: {
    default: " 음만추 | 음악을 만들어주는 서비스",
    template: "%s | ummanchu",
  },
  description:
    "AI Hackathon 영상에 맞는 분위기의 음악 만들어주는 서비스",
  keywords: [
    "음만추",
    "도미넌트",
    "ummanchu",
    "ummanchu",
    "",
    "",
  ],
  authors: [{ name: "음만추" }],
  openGraph: {
    title: "음만추",
    description:
      "AI Hackathon 음악 만들어주는 서비스",
    url: "https://ummanchu.co.kr",
    siteName: "SSIL Lab",
    locale: "ko_KR",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <style
          id="__theme_preload"
          dangerouslySetInnerHTML={{ __html: "html{background:#0a0a0a;color:#ededed}" }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var doc = document.documentElement;
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light') doc.classList.remove('dark');
    else doc.classList.add('dark');
  } catch (e) { doc.classList.add('dark'); }
})();`,
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {/* ✅ FontProvider로 전역 감싸기 */}
          <FontProvider>
            {/* 🔥 공통 네비게이션 */}
            <Navbar />

            {/* 🔥 페이지별 내용 */}
            <main className="min-h-screen pt-[100px]">
              {children}
            </main>

            {/* 🔥 공통 푸터 */}
            <Footer />

          </FontProvider>
        </Providers>
      </body>
    </html>
  );
}
