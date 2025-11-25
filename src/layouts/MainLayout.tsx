import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Content Container (Centered) */}
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
