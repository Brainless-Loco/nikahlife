export interface ProfileData {
  _id: string
  name: string
  gender: string
  email: string
  phone: string
  isVerified: boolean
  subscriptionType: string
  subscriptionId: {
    profileViewLimit: number
    status: string
    startDate: string
    endDate: string
    durationInMonths: number
  }
}

// interface ProfileProps {
//   profile: ProfileData
// }