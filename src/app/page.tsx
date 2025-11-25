import Header from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Header />


    
    </div>
  );
}