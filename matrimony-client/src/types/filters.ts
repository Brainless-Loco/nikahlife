// types/filters.ts
export type Gender = 'male' | 'female' | '';

export interface FilterParams {
  gender?: Gender;
  ageRange?: [number, number];
  division?: string;
  district?: string;
  upazila?: string;
  profession?: string;
  education?: string;
  maritalStatus?: string;
  incomeRange?: string;
  university?: string;
}

export const defaultFilters: FilterParams = {
  gender: '',
  ageRange: [18, 40],
  division: '',
  district: '',
  upazila: '',
  profession: '',
  education: '',
  maritalStatus: '',
  incomeRange: '',
  university: ''
};