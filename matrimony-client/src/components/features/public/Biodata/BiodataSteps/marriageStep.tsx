"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MarriageInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import { useAuth } from "@/app/(auth)/context/auth-context";

export default function MarriageStep({ data, updateData }: StepProps) {
  const [marriage, setMarriage] = useState<MarriageInfo>({
    guardiansAgree: false,
    studyContinue: "not_decided",
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
          {t.marriageRelatedInformation?.guardiansAgree}
        </Label>
      </div>

      <div className="space-y-3">
        <Label htmlFor="studyContinue">
          {t.marriageRelatedInformation?.studyContinue}
        </Label>
        <Select
          value={marriage.studyContinue || "not_decided"}
          onValueChange={(value) =>
            handleChange("studyContinue", value === "" ? "not_decided" : value)
          }
        >
          <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">
              {t.marriageRelatedInformation?.yes}
            </SelectItem>
            <SelectItem value="false">
              {t.marriageRelatedInformation?.no}
            </SelectItem>
            <SelectItem value="not_decided">
              {t.marriageRelatedInformation?.notDecide}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="reason">{t.marriageRelatedInformation?.reason} *</Label>
        <Select
          value={marriage.reason}
          onValueChange={(value) => handleChange("reason", value)}
        >
          <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={t.marriageRelatedInformation?.personal}>
              {t.marriageRelatedInformation?.personal}
            </SelectItem>
            <SelectItem value={t.marriageRelatedInformation?.family}>
              {t.marriageRelatedInformation?.family}
            </SelectItem>
            {/* <SelectItem value="religious">{t.marriageRelatedInformation?.}</SelectItem> */}
            <SelectItem value={t.marriageRelatedInformation?.social}>
              {t.marriageRelatedInformation?.social}
            </SelectItem>
            <SelectItem value={t.marriageRelatedInformation?.other}>
              {t.marriageRelatedInformation?.other}
            </SelectItem>
          </SelectContent>
        </Select>
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
