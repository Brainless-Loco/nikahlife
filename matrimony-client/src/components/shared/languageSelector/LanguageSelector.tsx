"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { ChevronDown } from "lucide-react";

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-md border-gray-300 dark:border-gray-700 text-sm font-medium 
                 hover:bg-pink-50 dark:hover:bg-pink-900/30 
                 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500
                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          {language === "en" ? "Language" : "ভাষা"}
          <ChevronDown className="ml-1 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[120px] rounded-md border border-gray-200 dark:border-gray-700 
               bg-white dark:bg-gray-800 shadow-md py-1"
      >
        <DropdownMenuItem
          className="text-sm px-3 py-2 cursor-pointer 
                 hover:bg-pink-100 dark:hover:bg-pink-900/40 
                 text-gray-700 dark:text-gray-200"
          onClick={() => changeLanguage("en")}
        >
          English
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-sm px-3 py-2 cursor-pointer 
                 hover:bg-pink-100 dark:hover:bg-pink-900/40 
                 text-gray-700 dark:text-gray-200"
          onClick={() => changeLanguage("bn")}
        >
          বাংলা
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
