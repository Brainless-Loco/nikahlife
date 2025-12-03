export interface PersonalInfo {
  name: string;
  gender: string;
  age: string;
  height: string;
  maritalStatus: string;
  dress: string;
  prayerHabit: string;
  maintainMahram: string;
  quranReading: string;
  fiqh: string;
  entertainment: string;
  healthIssues: string;
  specialSkills: string;
  favoriteBooks: string;
  hobbies: string;
}

export interface AddressInfo {
  permanent: {
    address: string;
    upazila: string;
    district: string;
    division: string;
  };
  present: {
    address: string;
    upazila: string;
    district: string;
    division: string;
  };
  grewUpAt: string;
}

export interface EducationHistory {
  level: string;
  year: string;
  group?: string;
  result: string;
  subject?: string;
  institution?: string;
  institution_bangla?: string;
}

export interface EducationInfo {
  method: string;
  history: EducationHistory[];
  other: string[];
}

export interface FamilyInfo {
  fatherAlive: boolean;
  motherAlive: boolean;
  fatherProfession: string;
  motherProfession: string;
  brothersInfo: string[];
  brothers: number;
  sisters: number;
  sistersInfo: string[];
  unclesProfession: string[];
  financialStatus: string;
  financialDetails: string;
  religiousPractice: string;
}

export interface OccupationInfo {
  current: string;
  description: string;
  income: {
    amount: number;
    currency: string;
  };
}

export interface MarriageInfo {
  guardiansAgree: boolean;
  studyContinue: string;
  reason: string;
  jobStatus: string;
}

export interface PreferenceInfo {
  ageRange: string;
  complexion: string;
  height: string;
  education: string;
  location: string;
  maritalStatus: string;
  profession: string;
  financialCondition: string;
  qualities: string;
}

export interface ContactInfo {
  guardianPhone: string;
  relation: string;
}

export interface PledgeInfo {
  parentsAware: boolean;
  informationAccurate: boolean;
  nikahResponsibility: boolean;
}

export interface BiodataFormData {
  personal?: PersonalInfo;
  address?: AddressInfo;
  education?: EducationInfo;
  family?: FamilyInfo;
  occupation?: OccupationInfo;
  marriage?: MarriageInfo;
  preference?: PreferenceInfo;
  contactInfo?: ContactInfo;
  isContactInfoValid?: boolean;
  pledge?: PledgeInfo;
}

export interface StepProps {
  data: BiodataFormData;
  updateData: (data: Partial<BiodataFormData>) => void;
}

export interface LocationData {
  division_id: string;
  divisionName: string;
  bnDivisionName: string;
  districtsName?: string;
  bnDistrictsName?: string;
  subDistrictsName?: string;
  bnSubDistrictsName?: string;
  lat: string;
  lon: string;
  url: string;
}

export interface DivisionProps {
  division_id: string;
  divisionName: string;
  bnDivisionName: string;
}
