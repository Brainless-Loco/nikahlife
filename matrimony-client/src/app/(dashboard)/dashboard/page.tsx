"use client";
import React, { useState } from "react";
import {
  Heart,
  Gift,
  Mail,
  Star,
  DollarSign,
  Menu,
  X,
  UserRoundPlus,
  Users,
} from "lucide-react";
import PaymentPage from "@/components/features/admin/payment/PaymentPage";
import ReviewPage from "@/components/features/admin/reviews/ReviewPage";
import SendMailPage from "@/components/features/admin/sendMail/SendMail";
import SpecialOffersPage from "@/components/features/admin/specialOffer/SpecialOffer";
import { useAuth } from "@/app/(auth)/context/auth-context";
import BiodataPage from "@/components/features/admin/biodata/BiodataPage";
import AllBiodata from "@/components/features/admin/allBiodata/AllBiodata";

const AdminDashboard = () => {
  const [activeRoute, setActiveRoute] = useState("payment");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();

  const routes = [
    { id: "payment", label: "Payments", icon: DollarSign },
    { id: "special-offers", label: "Special Offers", icon: Gift },
    { id: "send-mail", label: "Send Mail", icon: Mail },
    { id: "review", label: "Reviews", icon: Star },
    { id: "biodata", label: "Pending Biodata", icon: UserRoundPlus },
    { id: "all-biodata", label: "All Biodata", icon: Users },
  ];

  // Special Offers Component

  const renderContent = () => {
    switch (activeRoute) {
      case "payment":
        return <PaymentPage />;
      case "special-offers":
        return <SpecialOffersPage />;
      case "send-mail":
        return <SendMailPage />;
      case "review":
        return <ReviewPage />;
      case "biodata":
        return <BiodataPage />;
      case "all-biodata":
        return <AllBiodata />;
      default:
        return <SpecialOffersPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Nikah Dashboard
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setActiveRoute(route.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeRoute === route.id
                      ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{route.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-semibold text-sm">
                <Heart />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "Nikah Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@nikah.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {routes.find((r) => r.id === activeRoute)?.label || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
