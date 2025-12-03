export interface SpecialOffer {
  _id: string;
  title: string;
  description: string;
  validTill: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
  __v: number;
}

export interface FormData {
  title: string;
  description: string;
  validTill: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
}