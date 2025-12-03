// write your user types here
export interface User {
  userId: string;
  name: string;
  userEmail: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  exp: number;
  iat: string;
}

export interface ProfileData {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  profileImage: string
  gallery: string[]
  isOnline: boolean
  lastSeen: string
  verified: boolean
  premium: boolean
  profileViews: number

  // Basic Information
  dateOfBirth: string
  height: string
  weight: string
  bodyType: string
  complexion: string
  bloodGroup: string
  physicalStatus: string

  // Location
  currentLocation: string
  hometown: string
  nationality: string

  // Education & Career
  education: string
  educationDetails: string
  profession: string
  workingWith: string
  designation: string
  annualIncome: string
  workLocation: string

  // Family
  familyType: string
  fatherOccupation: string
  motherOccupation: string
  siblings: string
  familyLocation: string
  familyValues: string

  // Religious & Cultural
  religion: string
  caste: string
  subCaste: string
  motherTongue: string
  knownLanguages: string[]

  // Lifestyle
  diet: string
  smoking: string
  drinking: string

  // Partner Preferences
  partnerAgeRange: string
  partnerHeight: string
  partnerEducation: string
  partnerProfession: string
  partnerLocation: string
  partnerIncome: string

  // Personal
  bio: string
  interests: string[]
  hobbies: string[]

  // Contact
  contactNumber: string
  email: string
  socialMedia: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }

  // Additional
  createdBy: string
  joinedDate: string
  lastActive: string
}