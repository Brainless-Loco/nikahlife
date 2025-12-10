"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import { StepProps } from "@/types/biodataForm";

export default function VisibilityStep({ data, updateData }: StepProps) {
  const { language } = useLanguage();
  const t = biodataTranslation[language];
  const isVisible = data.isVisible ?? true;

  const handleToggle = (checked: boolean) => {
    updateData({ isVisible: checked });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.visibility?.title || "Biodata Visibility"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.visibility?.description || "Control who can view your biodata"}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <Checkbox
            id="isVisible"
            checked={isVisible}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1">
            <Label
              htmlFor="isVisible"
              className="text-base font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              {t.visibility?.makePublic || "Make Biodata Public"}
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {isVisible
                ? t.visibility?.publicDescription || "Your biodata is visible to all users"
                : t.visibility?.hiddenDescription || "Your biodata is hidden from other users"}
            </p>
          </div>
          <div className={`p-3 rounded-lg flex-shrink-0 ${isVisible ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isVisible ? (
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t.visibility?.note || "Note: Even if hidden, your biodata will be visible to your contacts and premium members based on your subscription plan."}
        </p>
      </div>
    </div>
  );
}
