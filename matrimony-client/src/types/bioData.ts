export interface IBiodata {
  _id?: string;
  userId: string;
  name: string;
  description: string;

  address?: {
    present?: {
      division?: string;
      district?: string;
      upazila?: string;
      details?: string;
    };
    permanent?: {
      division?: string;
      district?: string;
      upazila?: string;
      details?: string;
    };
    country?: string;
  };

  education?: {
    sscYear?: string;
    sscGroup?: string;
    sscResult?: string;
    hscYear?: string;
    hscGroup?: string;
    hscResult?: string;
    honours?: string;
  };

  familyInfo?: {
    fatherAlive?: string;
    fatherOccupation?: string;
    motherAlive?: string;
    motherOccupation?: string;
    brothers?: string;
    sisters?: string;
    siblingsDetails?: string;
  };

  personalInfo?: {
    beard?: string;
    salat?: string;
    mahramTravel?: string;
    health?: string;
    disability?: string;
  };

  physicalInfo?: {
    height?: string;
    bodyColor?: string;
    bloodGroup?: string;
    weight?: string;
  };

  maritalInfo?: {
    maritalStatus?: string;
    childAllow?: string;
    whyWantToMarry?: string;
    futurePlan?: string;
  };

  contactInfo: {
    phone: string;
    email?: string;
    facebook?: string;
  };

  preference?: {
    ageRange?: string;
    educationLevel?: string;
    maritalStatus?: string;
    religiousPractice?: string;
    physicalAppearance?: string;
    additionalQualities?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilterState {
  lookingFor: "male" | "female" | "";
  ageRange: [number, number];
  religion: string;
  profession: string;
  location: string;
  keyword: string;
  sortBy: string;
}

export interface Profile {
  _id: string;
  name: string;
  age?: number;
  description: string;
  address: {
    present: string;
    permanent: string;
    country: string;
  };
  education: {
    sscYear: string;
    sscGroup: string;
    sscResult: string;
    hscYear: string;
    hscGroup: string;
    hscResult: string;
    honours: string;
  };
  familyInfo: {
    fatherAlive: string;
    fatherOccupation: string;
    motherAlive: string;
    motherOccupation: string;
    brothers: string;
    sisters: string;
    siblingsDetails: string;
  };
  personalInfo: {
    beard: string;
    salat: string;
    mahramTravel: string;
    health: string;
    disability: string;
  };
  physicalInfo: {
    height: string;
    weight: string;
    bloodGroup: string;
    bodyColor: string;
  };
  maritalInfo: {
    maritalStatus: string;
    childAllow: string;
    whyWantToMarry: string;
    futurePlan: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    facebook: string;
  };
  preference: {
    additionalQualities?: string;
    physicalAppearance?: string;
    religiousPractice?: string;
    maritalStatus?: string;
    educationLevel?: string;
    ageRange?: string;
  };
  userId: {
    _id: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}
