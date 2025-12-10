"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MarriageInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import { useAuth } from "@/app/(auth)/context/auth-context";

export default function MarriageStep({ data, updateData }: StepProps) {
  const [marriage, setMarriage] = useState<MarriageInfo>({
    guardiansAgree: false,
    studyContinue: "",
    workContinue: "",
    reason: "",
    jobStatus: "",
    ...data.marriage,
  });

  const { user } = useAuth();

  useEffect(() => {
    updateData({ marriage });
  }, [marriage, updateData]);

  const handleChange = (field: keyof MarriageInfo, value: string | boolean) => {
    setMarriage((prev) => ({ ...prev, [field]: value }));
  };
  const { language } = useLanguage();
  const t = biodataTranslation[language];
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="guardiansAgree"
          checked={marriage.guardiansAgree}
          onCheckedChange={(checked) => handleChange("guardiansAgree", checked)}
        />
        <Label htmlFor="guardiansAgree">
          {t.marriageRelatedInformation?.guardiansAgree} *
        </Label>
      </div>

      {user?.gender === "female" && (
        <div className="space-y-3">
          <Label htmlFor="studyContinue">
            {t.marriageRelatedInformation?.studyContinue}
          </Label>
          <Input
            id="studyContinue"
            value={marriage.studyContinue || ""}
            onChange={(e) => handleChange("studyContinue", e.target.value)}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      )}

      {user?.gender === "female" && (
        <div className="space-y-3">
          <Label htmlFor="workContinue">
            {language === "bn"
              ? "বিয়ের পর চাকরি করবেন/চালিয়ে যাবেন?"
              : "Will you work/continue working after marriage?"}
          </Label>
          <Input
            id="workContinue"
            value={marriage.workContinue || ""}
            onChange={(e) => handleChange("workContinue", e.target.value)}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      )}

      <div className="space-y-3">
        <Label htmlFor="reason">{t.marriageRelatedInformation?.reason} *</Label>
        <Textarea
          id="reason"
          value={marriage.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder={language === "bn" ? "বিয়ে করতে চাওয়ার কারণ লিখুন..." : "Write your reason for marriage..."}
          className="border-emerald-200 dark:border-emerald-700 w-full min-h-[100px] resize-none"
        />
      </div>

      {user?.gender === "female" && (
        <>
          <div className="space-y-3">
            <Label htmlFor="jobStatus">
              {t.marriageRelatedInformation?.jobContinue}
            </Label>
            <Select
              value={marriage.jobStatus || "not_decided"}
              onValueChange={(value) =>
                handleChange("jobStatus", value === "" ? "not_decided" : value)
              }
            >
              <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
                <SelectValue placeholder="Select job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={t.marriageRelatedInformation?.continueJob}>
                  {t.marriageRelatedInformation?.continueJob}
                </SelectItem>
                <SelectItem value={t.marriageRelatedInformation?.changeJob}>
                  {t.marriageRelatedInformation?.changeJob}
                </SelectItem>
                <SelectItem value={t.marriageRelatedInformation?.quitJob}>
                  {t.marriageRelatedInformation?.quitJob}
                </SelectItem>
                <SelectItem value={t.marriageRelatedInformation?.startJob}>
                  {t.marriageRelatedInformation?.startJob}
                </SelectItem>
                <SelectItem value={t.marriageRelatedInformation?.noDecideJob}>
                  {t.marriageRelatedInformation?.noDecideJob}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t.marriageRelatedInformation?.importantNote}
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          {t.marriageRelatedInformation?.noteDescription}
        </p>
      </div>
    </div>
  );
}
