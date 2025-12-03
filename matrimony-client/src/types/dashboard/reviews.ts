 interface BiodataId {
  age: number;
  gender: string;
  name: string;
  _id: string;
}

interface UserId {
  _id: string;
  gender: string;
  email: string;
}

export interface Review {
  _id: string;
  biodataId: BiodataId;
  comment: string;
  createdAt: string;
  isDeleted: boolean;
  rating: number;
  status: "pending" | "approved" | "rejected";
  updatedAt: string;
  userId: UserId;
  __v: number;
}

export interface ApiError {
  message: string;
  status?: number;
}