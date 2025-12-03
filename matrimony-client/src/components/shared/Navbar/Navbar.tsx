"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../../../../public/logo/nikahlife.png";
import logoWhite from "../../../../public/logo/nikahlife-white.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/features/public/ThemeToggle/ThemeToggle";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { LanguageSelector } from "../languageSelector/LanguageSelector";
import { useLanguage } from "@/hooks/use-language";
import { navbarTranslation } from "@/dictionary/navbar";
import Image from "next/image";
export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const t = navbarTranslation[language];

  const navigationItems = [
    { title: t.home, href: "/" },
    { title: t.findMatch, href: "/biodatas" },
    { title: t.successStories, href: "/success-stories" },
    { title: t.about, href: "/about" },
    { title: t.contact, href: "/contact" },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    logout();
    setIsProfileOpen(false);
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-emerald-100 dark:border-gray-800"
          : "bg-white dark:bg-gray-950 border-emerald-50 dark:border-gray-800"
      )} 
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              width={200}
              height={200}
              src={logo}
              alt="nikahlife"
              className="block dark:hidden"
            />
          </Link>

          <Link href={"/"}>
            <Image
              width={200}
              height={200}
              src={logoWhite}
              alt="nikahlife"
              className="hidden dark:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 group",
                  pathname === item.href
                    ? "text-[#50C878] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70"
                    : "text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                )}
              >
                {item.title}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
                )}
                <div className="absolute inset-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageSelector />
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Profile Dropdown */}
                <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all duration-200 p-2 rounded-lg cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 rounded-lg ring-2 ring-emerald-100 dark:ring-emerald-900 hover:ring-emerald-200 dark:hover:ring-emerald-700 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold text-sm">
                          {getInitials(user?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800"
                    align="end"
                  >
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-pink-50 dark:from-emerald-950/50 dark:to-pink-950/50 border-b border-emerald-100 dark:border-emerald-900">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 rounded-lg ring-2 ring-white dark:ring-gray-800 shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold text-lg">
                            {getInitials(user?.name || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Online
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href={
                          user?.role === "admin" ? "/dashboard" : "/profile"
                        }
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors duration-200 group cursor-pointer"
                      >
                        <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {user?.role === "admin"
                              ? "Admin Dashboard"
                              : "My Profile"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.role === "admin"
                              ? "Manage users and content"
                              : "View and edit your profile"}
                          </p>
                        </div>
                      </Link>
                      <Separator className="my-2 bg-emerald-100 dark:bg-emerald-900" />
                      <Link
                        href="/profile/post-testimony"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors duration-200 group cursor-pointer"
                      >
                        <div className="h-9 w-9 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center group-hover:bg-pink-200 dark:group-hover:bg-pink-800 transition-colors">
                          <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            Submit Testimony
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Share your success story with others
                          </p>
                        </div>
                      </Link>

                      <Separator className="my-2 bg-emerald-100 dark:bg-emerald-900" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors duration-200 group cursor-pointer"
                      >
                        <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                          <LogOut className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            Sign Out
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Logout from your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-medium transition-all duration-200"
                  >
                    {t.login}
                  </Button>
                </Link>
                <Link onClick={()=>{console.log("Clicked")}} href="/registration">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-800/30 transition-all duration-300 font-medium px-6">
                    {t.registration}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[350px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-0 border-l border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-emerald-100 dark:border-emerald-900">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center shadow-md">
                      <Heart className="h-4 w-4 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-500 dark:to-emerald-400 bg-clip-text text-transparent">
                      Nikahlife
                    </span>
                  </div>
                </div>

                {/* User Info in Mobile */}
                {isAuthenticated && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-pink-50 dark:from-emerald-950/50 dark:to-pink-950/50 border-b border-emerald-100 dark:border-emerald-900">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 rounded-lg ring-2 ring-white dark:ring-gray-800 shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold">
                          {getInitials(user?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {user?.name || "User"}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-1 py-4 flex-1 px-2">
                  <Link
                    href={user?.role === "admin" ? "/dashboard" : "/profile"}
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors duration-200 group cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {user?.role === "admin"
                          ? "Admin Dashboard"
                          : "My Profile"}
                      </p>
                    </div>
                  </Link>
                  <Separator className="my-2 bg-emerald-100 dark:bg-emerald-900" />
                  <Link
                    href="/profile/post-testimony"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors duration-200 group cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Submit Testimony
                      </p>
                    </div>
                  </Link>

                  <Separator className="my-2 bg-emerald-100 dark:bg-emerald-900" />
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 mx-2",
                        pathname === item.href
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-l-4 border-emerald-600 dark:border-emerald-500 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="border-t border-emerald-100 dark:border-emerald-900 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <LanguageSelector />
                    <ThemeToggle />
                  </div>

                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white shadow-lg transition-all duration-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Link href="/login" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 bg-transparent transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/registration" className="block">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white shadow-lg transition-all duration-300"
                          onClick={() => setIsOpen(false)}
                        >
                          Join Free
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
