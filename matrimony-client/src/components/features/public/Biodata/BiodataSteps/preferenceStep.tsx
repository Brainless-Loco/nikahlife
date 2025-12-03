"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PreferenceInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import { Textarea } from "@/components/ui/textarea";

export default function PreferenceStep({ data, updateData }: StepProps) {
  const [preference, setPreference] = useState<PreferenceInfo>({
    ageRange: "",
    complexion: "",
    height: "",
    education: "",
    location: "",
    maritalStatus: "",
    profession: "",
    financialCondition: "",
    qualities: "",
    ...data.preference,
  });

  useEffect(() => {
    updateData({ preference });
  }, [preference, updateData]);

  const handleChange = (field: keyof PreferenceInfo, value: string) => {
    setPreference((prev) => ({ ...prev, [field]: value }));
  };

  const { language } = useLanguage();
  const t = biodataTranslation[language];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="ageRange">{t.expectedLifePartner?.age}</Label>
          <Input
            id="ageRange"
            value={preference.ageRange}
            onChange={(e) => handleChange("ageRange", e.target.value)}
            placeholder="e.g., 20-25, 25-30"
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="complexion">
            {t.expectedLifePartner?.complexion}
          </Label>
          <Select
            value={preference.complexion}
            onValueChange={(value) => handleChange("complexion", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue
                placeholder={t.expectedLifePartner?.selectComplexion}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t.expectedLifePartner?.fair}>
                {t.expectedLifePartner?.fair}
              </SelectItem>
              <SelectItem value={t.expectedLifePartner?.medium}>
                {t.expectedLifePartner?.medium}
              </SelectItem>
              <SelectItem value={t.expectedLifePartner?.dark}>
                {t.expectedLifePartner?.dark}
              </SelectItem>
              <SelectItem value={t.expectedLifePartner?.any}>
                {t.expectedLifePartner?.any}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="height">{t.expectedLifePartner?.height}</Label>
          <Input
            id="height"
            value={preference.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="e.g., 5.5+, 5.0-5.5"
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="education">
            {t.expectedLifePartner?.educationQualification}
          </Label>
          <Select
            value={preference.education}
            onValueChange={(value) => handleChange("education", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue
                placeholder={t.expectedLifePartner?.selectEducationPlaceHolder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SSC">
                {t.educationalQualification?.ssc}
              </SelectItem>
              <SelectItem value="HSC">
                {t.educationalQualification?.hsc}
              </SelectItem>
              <SelectItem value="Graduation">
                {t.educationalQualification?.graduation}
              </SelectItem>
              <SelectItem value="Masters">
                {t.educationalQualification?.masters}
              </SelectItem>
              <SelectItem value="PhD">
                {t.educationalQualification?.phd}
              </SelectItem>
              <SelectItem value="Any">{t.expectedLifePartner?.any}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="location">{t.expectedLifePartner?.district}</Label>
          <Input
            id="location"
            value={preference.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder={t.expectedLifePartner?.locationPlaceHolder}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="maritalStatus">
            {t.expectedLifePartner?.maritalStatus}
          </Label>
          <Select
            value={preference.maritalStatus}
            onValueChange={(value) => handleChange("maritalStatus", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue
                placeholder={
                  t.expectedLifePartner?.selectMaritalStatusPlaceHolder
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'unmarried'}>
                {t.expectedLifePartner?.neverMarried}
              </SelectItem>
              <SelectItem value={'divorced'}>
                {t.expectedLifePartner?.divorced}
              </SelectItem>
              <SelectItem value={'widowed'}>
                {t.expectedLifePartner?.widowed}
              </SelectItem>
              <SelectItem value={'any'}>
                {t.expectedLifePartner?.any}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="profession">
            {t.expectedLifePartner?.profession}
          </Label>
          <Input
            id="profession"
            value={preference.profession}
            onChange={(e) => handleChange("profession", e.target.value)}
            placeholder={t.expectedLifePartner?.professionPlaceHolder}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="financialCondition">
            {t.expectedLifePartner?.financialCondition}
          </Label>
          <Select
            value={preference.financialCondition}
            onValueChange={(value) => handleChange("financialCondition", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue
                placeholder={t.expectedLifePartner?.selectFinancialPlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t.familyInformation?.lower}>
                {t.familyInformation?.lower}
              </SelectItem>
              <SelectItem value={t.familyInformation?.middle}>
                {t.familyInformation?.middle}
              </SelectItem>
              <SelectItem value={t.familyInformation?.upper}>
                {t.familyInformation?.upper}
              </SelectItem>
              <SelectItem value={t.familyInformation?.rich}>
                {t.familyInformation?.rich}
              </SelectItem>
              <SelectItem value={t.expectedLifePartner?.any}>
                {t.expectedLifePartner?.any}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label>{t.expectedLifePartner?.qualities}</Label>
            <div className="flex gap-2 w-full">
              <Textarea
                value={preference.qualities}
                onChange={(e) => handleChange("qualities", e.target.value)}
                placeholder={t.expectedLifePartner?.desiredQualityPlaceHolder}
                className="border-emerald-200 dark:border-emerald-700 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
          {t.expectedLifePartner?.guideLine}
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {t.expectedLifePartner?.guideDescription}
        </p>
      </div>
    </div>
  );
}
