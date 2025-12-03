"use client";
import { profileTranslation } from "@/dictionary/profile";
import { useLanguage } from "@/hooks/use-language";
import { Send, Inbox, Heart, ArrowRight, Ban } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavigationButtons() {
  const { language } = useLanguage();
  const t = profileTranslation[language];
  const router = useRouter();

  const navigationItems = [
    {
      id: "send",
      label: t.mySendRequests,
      icon: Send,
      route: "/profile/my-sent-interest",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      id: "received",
      label: t.receivedRequests,
      icon: Inbox,
      route: "/profile/received-request",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
    },
    {
      id: "shortlist",
      label: t.myInterests,
      icon: Heart,
      route: "/profile/shortlist",
      gradient: "from-pink-500 to-pink-600",
      hoverGradient: "hover:from-pink-600 hover:to-pink-700",
    },
    {
      id: "ignore",
      label: t.ignoreList,
      icon: Ban,
      route: "/profile/block-list",
      gradient: "from-gray-500 to-gray-600",
      hoverGradient: "hover:from-gray-600 hover:to-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => router.push(item.route)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
            ></div>

            <div className="relative z-10">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                {item.label}
              </h3>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                <span>{language === "bn" ? "দেখুন" : "View"}</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
