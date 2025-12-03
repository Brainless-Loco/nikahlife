
interface Address {
  present: {
    address: string
    upazila: string
    district: string
    division: string
  }
  permanent: {
    address: string
    upazila: string
    district: string
    division: string
  }
  grewUpAt: string
  country: string
}

interface Education {
  method: string
  history: Array<{
    level: string
    year: number
    group: string
    result: string
    subject: string
    institution: string
    _id: string
  }>
  other: string[]
}

interface Family {
  fatherAlive: boolean
  motherAlive: boolean
  fatherProfession: string
  motherProfession: string
  brothers: number
  sisters: number
  brothersInfo: string[]
  sistersInfo: string[]
  unclesProfession: string[]
  financialStatus: string
  financialDetails: string
  religiousPractice: string
}

interface Personal {
  dress: string
  prayerHabit: string
  maintainMahram: string
  quranReading: string
  fiqh: string
  entertainment: string
  healthIssues: string
  specialSkills: string
  favoriteBooks: string[]
  hobbies: string[]
  maritalStatus: string
  height: string
}

interface Occupation {
  income: {
    amount: number
    currency: string
  }
  current: string
  description: string
}

interface Marriage {
  guardiansAgree: boolean
  studyContinue: string
  reason: string
  jobStatus: string
}

interface Preference {
  ageRange: string
  complexion: string
  height: string
  education: string
  location: string
  maritalStatus: string
  profession: string
  financialCondition: string
  qualities: string[]
}

interface ContactInfo {
  guardianPhone: string
  relation: string
}

interface Pledge {
  parentsAware: boolean
  informationAccurate: boolean
  nikahResponsibility: boolean
}

interface UserInfo {
  _id: string
  name: string
  email: string
  phone: string
  gender: string
  role: string
}

export interface Biodata {
  _id: string
  userId: UserInfo
  name: string
  gender: string
  age: number
  address: Address
  education: Education
  family: Family
  personal: Personal
  occupation: Occupation
  marriage: Marriage
  preference: Preference
  contactInfo: ContactInfo
  pledge: Pledge
  isApproved: string
  createdAt: string
  updatedAt: string
}