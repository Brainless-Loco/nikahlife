export interface BiodataItem {
  _id: string
  name: string
  gender: string
  age: number
  address: {
    country: string
    grewUpAt: string
    permanent: {
      address: string
      upazila: string
      district: string
      division: string
    }
    present: {
      address: string
      upazila: string
      district: string
      division: string
    }
  }
  education: {
    method: string
    history: Array<{
      level: string
      year: number | string
      result: string
      subject: string
      institution: string
    }>
  }
  personal: {
    maritalStatus: string
    height: string
    fiqh: string
    dress: string
    prayerHabit: string
    maintainMahram: string
    quranReading: string
    entertainment: string
    healthIssues: string
    specialSkills: string
    favoriteBooks: string[]
    hobbies: string[]
  }
  occupation: {
    current: string
    description: string
    income: {
      amount: number
      currency: string
    }
  }
  family: {
    fatherAlive: boolean
    motherAlive: boolean
    fatherProfession: string
    motherProfession: string
    brothers: number
    sisters: number
    sistersInfo: string[]
    brothersInfo: string[]
    unclesProfession: string[]
    financialStatus: string
    financialDetails: string
    religiousPractice: string
  }
  marriage: {
    guardiansAgree: boolean
    studyContinue: string
    reason: string
  }
  preference: {
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
  contactInfo: {
    guardianPhone: string
    relation: string
  }
  userId: {
    email: string
    phone: string
  }
  isApproved: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface ApiResponse {
  success: boolean
  message: string
  data: BiodataItem[]
}
