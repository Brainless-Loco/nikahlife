// import { Types } from "mongoose";

// export interface IBiodata {
//   _id?: string | Types.ObjectId;
//   userId: Types.ObjectId;

//   // Personal
//   name: string;
//   gender: "Male" | "Female" | "Other";
//   age: number;

//   address?: {
//     present?: {
//       address?: string;
//       upazila?: string;
//       district?: string;
//       division?: string;
//     };
//     permanent?: {
//       address?: string;
//       upazila?: string;
//       district?: string;
//       division?: string;
//     };
//     grewUpAt?: string;
//   };

//   education?: {
//     method?: string;
//     history?: {
//       level?: string;
//       year?: number;
//       group?: string;
//       result?: string;
//       subject?: string;
//       institution?: string;
//     }[];
//     other?: string[];
//   };

//   family?: {
//     fatherAlive?: boolean;
//     motherAlive?: boolean;
//     fatherProfession?: string;
//     motherProfession?: string | null;
//     brothers?: number;
//     sisters?: number;
//     sistersInfo?: string[];
//     unclesProfession?: string[];
//     financialStatus?: string;
//     financialDetails?: string;
//     religiousPractice?: string;
//   };

//   personal?: {
//     dress?: string;
//     prayerHabit?: string;
//     maintainMahram?: boolean;
//     quranReading?: boolean;
//     fiqh?: string;
//     entertainment?: boolean;
//     healthIssues?: boolean;
//     specialSkills?: string | null;
//     favoriteBooks?: string[];
//     hobbies?: string[];
//   };

//   occupation?: {
//     current?: string;
//     description?: string;
//     income?: { amount: number; currency: string };
//   };

//   marriage?: {
//     guardiansAgree?: boolean;
//     studyContinue?: boolean | null;
//     reason?: string;
//     jobStatus?: string | null;
//   };

//   preference?: {
//     ageRange?: string;
//     complexion?: string;
//     height?: string;
//     education?: string;
//     location?: string;
//     maritalStatus?: string;
//     profession?: string;
//     financialCondition?: string;
//     qualities?: string[];
//   };

//   pledge?: {
//     parentsAware?: boolean;
//     informationAccurate?: boolean;
//     nikahResponsibility?: boolean;
//   };

//   createdAt?: Date;
//   updatedAt?: Date;
// }

import { Types } from "mongoose";
 
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export interface IBiodata {
  _id?: string | Types.ObjectId;
  userId: Types.ObjectId;

  // Personal
  name: string;
  gender: "male" | "female" | string;
  age: number | string;
  phone: string;

  address?: {
    present?: {
      address?: string;
      upazila?: string;
      district?: string;
      division?: string;
    };
    permanent?: {
      address?: string;
      upazila?: string;
      district?: string;
      division?: string;
    };
    grewUpAt?: string;
    country?: string;
  };

  education?: {
    method?: string;
    history?: {
      level?: string;
      year?: number | string;
      group?: string;
      result?: string;
      subject?: string;
      institution?: string;
    }[];
    other?: string[];
  };

  family?: {
    fatherAlive?: boolean | string;
    motherAlive?: boolean | string;
    fatherProfession?: string;
    motherProfession?: string | null;
    brothers?: number | string;
    sisters?: number | string;
    sistersInfo?: string[];
    brothersInfo?: string[];
    unclesProfession?: string[];
    financialStatus?: string;
    financialDetails?: string;
    religiousPractice?: string;
  };

  personal?: {
    dress?: string;
    prayerHabit?: string;
    maintainMahram?: string;
    quranReading?:  string;
    fiqh?: string;
    entertainment?: string;
    healthIssues?: string;
    specialSkills?: string | null;
    height?: string;
    maritalStatus?: string;
    favoriteBooks?: string[];
    hobbies?: string[];
  };

  occupation?: {
    current?: string;
    description?: string;
    income?: { amount: number | string; currency: string };
  };

  marriage?: {
    guardiansAgree?: boolean | string;
    studyContinue?:string ;
    reason?: string;
    jobStatus?: string | null;
  };

  preference?: {
    ageRange?: string;
    complexion?: string;
    height?: string | number;
    education?: string;
    location?: string;
    maritalStatus?: string;
    profession?: string;
    financialCondition?: string;
    qualities?: string[];
  };

    contactInfo?: {
    guardianPhone?: number | string;
    relation?: string;
  };


  pledge?: {
    parentsAware?: boolean | string;
    informationAccurate?: boolean | string;
    nikahResponsibility?: boolean | string;
  };
 isApproved?: ApprovalStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
