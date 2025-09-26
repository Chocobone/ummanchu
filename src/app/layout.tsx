// app/layout.tsx (RootLayout)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "quill/dist/quill.snow.css";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: { default: "SSIL Lab", template: "%s | SSIL Lab" },
  description: "…원하는 설명…",
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
    var stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
    if (stored === 'light') {
      doc.classList.remove('dark');
    } else if (stored === 'dark') {
      doc.classList.add('dark');
    } else {
      // 기본값: 다크
      doc.classList.add('dark');
    }
  } catch (e) {
    // 스토리지 접근 불가 시에도 다크 유지
    doc.classList.add('dark');
  }
})();
            `,
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
