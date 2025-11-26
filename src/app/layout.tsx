import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "quill/dist/quill.snow.css";
import { ThemeProvider } from "next-themes";
import "../styles/font.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: {
    default: " 음만추 | 음악을 만들어주는 서비스",
    template: "%s | ummanchu",
  },
  description: "AI Hackathon 영상에 맞는 분위기의 음악 만들어주는 서비스",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />

          <main className="min-h-screen pt-[100px]">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
