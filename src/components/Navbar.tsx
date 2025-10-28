import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/mood", label: "Mood Tracker" },
        { to: "/journal", label: "Journal" },
        { to: "/chat", label: "AI Chat" },
        { to: "/wellness", label: "Wellness" },
        { to: "/growth", label: "Growth" },
        { to: "/analytics", label: "Analytics" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/auth", label: "Get Started" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar/90 backdrop-blur-md border-b border-navbar-foreground/10 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow)] animate-pulse">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-navbar-foreground group-hover:text-primary transition-colors duration-300">
              Aura Compass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`text-navbar-foreground hover:text-primary hover:bg-navbar-foreground/10 transition-all duration-300 relative group ${
                    isActive(link.to) ? "text-primary" : ""
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
                      isActive(link.to) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-navbar-foreground hover:bg-navbar-foreground/10 transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-navbar-foreground hover:text-primary hover:bg-navbar-foreground/10 transition-all duration-300 ${
                  isActive(link.to) ? "bg-navbar-foreground/10 text-primary" : ""
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
