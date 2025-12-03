type Address = {
 country: string;
 grewUpAt: string;
 permanent: {
   address: string;
   district: string;
   division: string;
   upazila: string;
 };
 present: {
   address: string;
   district: string;
   division: string;
   upazila: string;
 };
};

type Education = {
 method: string;
 history: Array<{
   group: string;
   institution: string;
   level: string;
   result: string;
   subject: string;
   year: number;
   _id: string;
 }>;
 other: string[];
};

type Family = {
 brothers: number;
 fatherAlive: boolean;
 fatherProfession: string;
 financialDetails: string;
 financialStatus: string;
 motherAlive: boolean;
 motherProfession: string;
 religiousPractice: string;
 sisters: number;
 sistersInfo: string[];
 brothersInfo: string[];
 unclesProfession: string[];
};

type Marriage = {
 guardiansAgree: boolean;
 jobStatus: string;
 reason: string;
 studyContinue: string;
};

type Occupation = {
 current: string;
 description: string;
 income: {
   amount: number;
   currency: string;
 };
};

type Personal = {
 dress: string;
 entertainment: string;
 favoriteBooks: string[];
 fiqh: string;
 healthIssues: string;
 hobbies: string[];
 maintainMahram: string;
 prayerHabit: string;
 quranReading: string;
 specialSkills: string;
 height: string;
 maritalStatus: string;
};

type Pledge = {
 informationAccurate: boolean;
 nikahResponsibility: boolean;
 parentsAware: boolean;
};

type Preference = {
 ageRange: string;
 complexion: string;
 education: string;
 financialCondition: string;
 height: string;
 location: string;
 maritalStatus: string;
 profession: string;
 qualities: string[];
};

type UserId = {
 email: string;
 phone: string;
 role: string;
 _id: string | undefined;
};

export type BiodataType = {
 address: Address;
 age: number;
 createdAt: string;
 education: Education;
 family: Family;
 gender: string;
 marriage: Marriage;
 name: string;
 occupation: Occupation;
 personal: Personal;
 pledge: Pledge;
 preference: Preference;
 updatedAt: string;
 userId: UserId;
 __v: number;
 _id: string;
};