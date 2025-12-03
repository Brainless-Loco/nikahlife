// hooks/useSearchFilters.ts
"use client";

import { useSearchParams } from "next/navigation";
import { FilterParams, defaultFilters } from "@/types/filters";

export function useSearchFilters(): FilterParams {
  const searchParams = useSearchParams();

  const getStringParam = (key: keyof FilterParams): string | undefined => {
    const value = searchParams.get(key);
    return value && value !== "" ? value : undefined;
  };

  const getNumberParam = (key: string): number | undefined => {
    const value = searchParams.get(key);
    return value ? Number(value) : undefined;
  };

  const minAge = getNumberParam("minAge") ?? defaultFilters.ageRange?.[0];
  const maxAge = getNumberParam("maxAge") ?? defaultFilters.ageRange?.[1];

  return {
    gender: getStringParam("gender") as "male" | "female" | "",
    ageRange:
      minAge !== undefined && maxAge !== undefined
        ? [minAge, maxAge]
        : undefined,
    division: getStringParam("division"),
    district: getStringParam("district"),
    upazila: getStringParam("upazila"),
    profession: getStringParam("profession"),
    education: getStringParam("education"),
    maritalStatus: getStringParam("maritalStatus"),
    incomeRange: getStringParam("incomeRange"),
  };
}
