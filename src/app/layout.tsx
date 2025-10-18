import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "quill/dist/quill.snow.css";
import Providers from "./providers";

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
        <style id="__theme_preload" dangerouslySetInnerHTML={{ __html: "html{background:#0a0a0a;color:#ededed}" }} />
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
          {children}
        </Providers>
      </body>
    </html>
  );
}