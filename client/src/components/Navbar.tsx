import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Target, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: null },
    { path: "/resume-builder", label: "Resume Builder", icon: FileText },
    { path: "/mock-interview", label: "Mock Interview", icon: Target },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                R
              </div>
              <span className="font-bold text-xl hidden sm:inline">ResumeAI</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}>
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    isActive(item.path)
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    isActive(item.path)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
