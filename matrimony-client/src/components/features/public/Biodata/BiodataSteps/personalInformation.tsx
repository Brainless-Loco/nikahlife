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
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";

export default function PersonalInfoStep({ data, updateData }: StepProps) {
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: "",
    gender: "",
    dress: "",
    age: "",
    prayerHabit: "",
    maintainMahram: "",
    quranReading: "",
    fiqh: "",
    entertainment: "",
    healthIssues: "",
    specialSkills: "",
    favoriteBooks: "",
    hobbies: "",
    maritalStatus: "",
    height: "",
    ...data.personal,
  });

  const { language } = useLanguage();
  const t = biodataTranslation[language];

  useEffect(() => {
    updateData({ personal });
  }, [personal, updateData]);

  const handleChange = (field: keyof PersonalInfo, value: string | boolean) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="name">{t.personalInformation?.name} *</Label>
          <Input
            id="name"
            value={personal.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t.personalInformation?.name}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="gender">{t.personalInformation?.gender} *</Label>
          <Select
            value={personal.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue placeholder={t.personalInformation?.selectGender} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">
                {t.personalInformation?.male}
              </SelectItem>
              <SelectItem value="Female">
                {t.personalInformation?.female}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="dress">{t.personalInformation?.dressUp}</Label>
          <Input
            id="dress"
            value={personal.dress}
            onChange={(e) => handleChange("dress", e.target.value)}
            placeholder={t.personalInformation?.dressUp}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="prayerHabit">
            {t.personalInformation?.pray5times}
          </Label>
          <Input
            id="prayerHabit"
            value={personal.prayerHabit}
            onChange={(e) => handleChange("prayerHabit", e.target.value)}
            placeholder={t.personalInformation?.pray5times}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="fiqh">{t.personalInformation?.fiqh}</Label>
          <Select
            value={personal.fiqh}
            onValueChange={(value) => handleChange("fiqh", value)}
          >
            <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
              <SelectValue placeholder={t.personalInformation?.selectFiqh} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t.personalInformation?.hanafi}>
                {t.personalInformation?.hanafi}
              </SelectItem>
              <SelectItem value={t.personalInformation?.shafi}>
                {t.personalInformation?.shafi}
              </SelectItem>
              <SelectItem value={t.personalInformation?.maliki}>
                {t.personalInformation?.maliki}
              </SelectItem>
              <SelectItem value={t.personalInformation?.hanbali}>
                {t.personalInformation?.hanbali}
              </SelectItem>
              <SelectItem value={t.personalInformation?.salafiAhlulHadith}>
                {t.personalInformation?.salafiAhlulHadith}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label>{t.personalInformation?.age} *</Label>
          <Input
            id="age"
            type="number"
            value={personal.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="e.g., 20"
            min={18}
            max={60}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="height">{t.expectedLifePartner?.height}</Label>
          <Input
            id="height"
            value={personal.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder='e.g., 5"5'
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="maritalStatus">
            {t.expectedLifePartner?.maritalStatus}
          </Label>
          <Select
            value={personal.maritalStatus}
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
              <SelectItem value={"unmarried"}>
                {t.expectedLifePartner?.neverMarried}
              </SelectItem>
              <SelectItem value={"divorced"}>
                {t.expectedLifePartner?.divorced}
              </SelectItem>
              <SelectItem value={"widowed"}>
                {t.expectedLifePartner?.widowed}
              </SelectItem>
              <SelectItem value={"any"}>
                {t.expectedLifePartner?.any}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="maintainMahram">
            {t.personalInformation?.mahram}
          </Label>
          <Input
            id="maintainMahram"
            value={personal.maintainMahram}
            onChange={(e) => handleChange("maintainMahram", e.target.value)}
            placeholder={t.personalInformation?.mahram}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="quranReading">
            {t.personalInformation?.quranReading}
          </Label>
          <Input
            id="quranReading"
            value={personal.quranReading}
            onChange={(e) => handleChange("quranReading", e.target.value)}
            placeholder={t.personalInformation?.quranReading}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="entertainment">
            {t.personalInformation?.entertainment}
          </Label>
          <Input
            id="entertainment"
            value={personal.entertainment}
            onChange={(e) => handleChange("entertainment", e.target.value)}
            placeholder={t.personalInformation?.entertainment}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="healthIssues">
            {t.personalInformation?.diseases}
          </Label>
          <Input
            id="healthIssues"
            value={personal.healthIssues}
            onChange={(e) => handleChange("healthIssues", e.target.value)}
            placeholder={t.personalInformation?.diseases}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="specialSkills">
          {t.personalInformation?.specialSkills}
        </Label>
        <Textarea
          id="specialSkills"
          value={personal.specialSkills}
          onChange={(e) => handleChange("specialSkills", e.target.value)}
          placeholder={t.personalInformation?.specialSkills}
          className="border-emerald-200 dark:border-emerald-700"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="favoriteBooks">
          {t.personalInformation?.favoriteBooks}
        </Label>
        <Input
          id="favoriteBooks"
          value={personal.favoriteBooks}
          onChange={(e) => handleChange("favoriteBooks", e.target.value)}
          placeholder={t.personalInformation?.favoriteBooks}
          className="border-emerald-200 dark:border-emerald-700"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="hobbies">{t.personalInformation?.hobbies}</Label>
        <Input
          id="hobbies"
          value={personal.hobbies}
          onChange={(e) => handleChange("hobbies", e.target.value)}
          placeholder={t.personalInformation?.hobbies}
          className="border-emerald-200 dark:border-emerald-700"
        />
      </div>
    </div>
  );
}
