import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "quill/dist/quill.snow.css";
import AuthProvider from "@/components/AuthProvider";
import Script from "next/script";
import Footer from "@/components/Footer";  


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: 'SSIL Lab',        // 기본 탭 제목
    template: '%s | SSIL Lab',  // 페이지별 제목에 적용
  },
  description: '…원하는 설명…',
  icons: { icon: '/favicon.ico' }, // (선택) 파비콘
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
       <head>
       <meta name="color-scheme" content="dark light" />
       <style
  id="__theme_preload"
  dangerouslySetInnerHTML={{
    __html: "html{background:#0a0a0a;color:#ededed}"
  }}
/>
       
      <Script id="debug-dark" strategy="afterInteractive">{`
  (function(){
    var html = document.documentElement;
    new MutationObserver(function(){
      console.log('[THEME]', 'html.className ->', html.className, 'at', new Error().stack);
    }).observe(html, { attributes: true, attributeFilter: ['class'] });
  })();
`}</Script>
 </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AuthProvider>{children} 
      <Footer />
        </AuthProvider>
      </body>
    </html>
    
  );
}
