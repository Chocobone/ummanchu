import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto h-[70px] px-6 flex items-center justify-between">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="AI Music Generator Logo" 
            width={32} 
            height={32} 
          />
          <span className="font-semibold text-lg">AI Music Generator</span>
        </div>

        {/* Right: Nav Menu */}
        <div className="flex items-center gap-6">
          <Link 
            to="/how-it-works" 
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            How it Works
          </Link>

          <Link 
            to="/account" 
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            My Account
          </Link>

          <Link to="/login">
            <Button className="bg-[#4C46FF] text-white px-4 py-2 rounded-md">
              Log In
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
