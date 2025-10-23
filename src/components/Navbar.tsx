import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User } from "lucide-react";
import AuthBadge from "./AuthBadge";
import AuthDialog from "./AuthDialog";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();

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

  const handleGetStarted = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setAuthDialogOpen(true);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/30 backdrop-blur-xl rounded-full shadow-2xl px-6 py-3 border border-white/40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
            <img
              src="/ClariFi.png"
              alt="QFG"
              className="h-8 w-8"
            />
            <span className="text-blue-600">QFG</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/get-started" onClick={handleGetStarted}>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setAuthDialogOpen(true)}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu - simplified for now */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/get-started">
              <Button size="sm" variant="default" className="bg-blue-600 rounded-full">
                <BookOpen className="h-4 w-4" />
              </Button>
            </Link>
            <button onClick={() => setAuthDialogOpen(true)}>
              <AuthBadge />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>
  );
};

export default Navbar;