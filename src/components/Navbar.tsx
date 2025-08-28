import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen } from "lucide-react";
import AuthBadge from "./AuthBadge";

const Navbar = () => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      // If not on landing page, navigate there first
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span>ClariFi</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              About
            </button>
            <Link to="/get-started">
              <Button variant="default" className="bg-gradient-primary hover:shadow-glow transition-smooth">
                <BookOpen className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
            <AuthBadge />
          </div>

          {/* Mobile Menu - simplified for now */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/get-started">
              <Button size="sm" variant="default" className="bg-gradient-primary">
                <BookOpen className="h-4 w-4" />
              </Button>
            </Link>
            <AuthBadge />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;