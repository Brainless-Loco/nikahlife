export interface FilterFormData {
  lookingFor: "male" | "female" | "";
  ageRange: [number, number];
  division: string;
  district: string;
  upazila: string;
  profession: string;
  education: string;
  maritalStatus: string;
  incomeRange: string;
}

export interface Division {
  division_id: string
  divisionName: string
  bnDivisionName: string
  url: string
}

export interface District {
  division_id: string
  divisionName: string
  bnDivisionName: string
  districtsName: string
  bnDistrictsName: string
  lat: string
  lon: string
  url: string
}

export interface Upazila {
  division_id: string
  divisionName: string
  bnDivisionName: string
  districtsName: string
  bnDistrictsName: string
  subDistrictsName: string
  bnSubDistrictsName: string
  lat: string
  lon: string
  url: string
}
