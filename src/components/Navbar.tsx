import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Home" },
        { to: "/growth", label: "Growth" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/auth", label: "Sign In" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar/95 backdrop-blur-xl border-b border-navbar-foreground/20 shadow-lg animate-in fade-in slide-in-from-top duration-700">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-in zoom-in duration-500">
              <Heart className="w-5 h-5 text-primary-foreground group-hover:animate-pulse" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-navbar-foreground bg-clip-text">Mindful Space</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, index) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive(link.to) ? "default" : "ghost"}
                  className="text-navbar-foreground hover:bg-navbar-foreground/10 hover:scale-105 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-top"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-navbar-foreground hover:scale-110 transition-transform duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6 animate-in spin-in duration-300" /> : <Menu className="w-6 h-6 animate-in zoom-in duration-300" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-navbar-foreground/20 pt-4 animate-in slide-in-from-top duration-300">
            {navLinks.map((link, index) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive(link.to) ? "default" : "ghost"}
                  className="w-full justify-start text-navbar-foreground hover:scale-105 hover:translate-x-2 transition-all duration-300 animate-in fade-in slide-in-from-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
