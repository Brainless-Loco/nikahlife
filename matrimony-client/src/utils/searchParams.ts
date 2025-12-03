// utils/searchParams.ts
import { FilterParams } from '@/types/filters';

export function generateSearchParams(filters: FilterParams): URLSearchParams {
  const params = new URLSearchParams();

  // Helper function to cleanly handle parameter setting
  const setParam = (key: string, value?: string | number) => {
    if (value !== undefined && value !== '') {
      params.set(key, value.toString());
    }
  };

  // Set each parameter
  setParam('gender', filters.gender);
  
  if (filters.ageRange) {
    setParam('minAge', filters.ageRange[0]);
    setParam('maxAge', filters.ageRange[1]);
  }

  setParam('division', filters.division);
  setParam('district', filters.district);
  setParam('upazila', filters.upazila);
  setParam('profession', filters.profession);
  setParam('education', filters.education);
  setParam('maritalStatus', filters.maritalStatus);
  setParam('incomeRange', filters.incomeRange);
  setParam('university', filters.university)

  return params;
}