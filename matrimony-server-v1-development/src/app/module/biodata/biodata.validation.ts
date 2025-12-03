import { z } from "zod";

// Address Schema
const addressSchema = z.object({
  address: z.string().default("উত্তর দেয়া হয়নি"),
  upazila: z.string().default("উত্তর দেয়া হয়নি"),
  district: z.string().default("উত্তর দেয়া হয়নি"),
  division: z.string().default("উত্তর দেয়া হয়নি"),
});

// Education Schema
const educationHistorySchema = z.object({
  level: z.string(),
  year: z.number(),
  group: z.string().default("General"),
  result: z.string().default("উত্তর দেয়া হয়নি"),
  subject: z.string().default("উত্তর দেয়া হয়নি"),
  institution: z.string().default("উত্তর দেয়া হয়নি"),
});

const educationSchema = z.object({
  method: z.string().default("General"),
  history: z.array(educationHistorySchema).default([]),
  other: z.array(z.string()).default([]),
});

// Family Schema
const familySchema = z.object({
  fatherAlive: z.boolean().default(true),
  motherAlive: z.boolean().default(true),
  fatherProfession: z.string().default("উত্তর দেয়া হয়নি"),
  motherProfession: z.string().default("উত্তর দেয়া হয়নি"),
  brothers: z.number().default(0),
  sisters: z.number().default(0),
  brothersInfo: z.array(z.string()).default([]),
  sistersInfo: z.array(z.string()).default([]),
  unclesProfession: z.array(z.string()).default([]),
  financialStatus: z.string().default("উত্তর দেয়া হয়নি"),
  financialDetails: z.string().default("উত্তর দেয়া হয়নি"),
  religiousPractice: z.string().default("উত্তর দেয়া হয়নি"),
});

// Personal Schema
const personalSchema = z.object({
  dress: z.string().default("উত্তর দেয়া হয়নি"),
  prayerHabit: z.string().default("উত্তর দেয়া হয়নি"),
  maintainMahram: z.string().default("উত্তর দেয়া হয়নি"),
  quranReading: z.string().default("উত্তর দেয়া হয়নি"),
  fiqh: z.string().default("উত্তর দেয়া হয়নি"),
  entertainment: z.string().default("উত্তর দেয়া হয়নি"),
  healthIssues: z.string().default("উত্তর দেয়া হয়নি"),
  specialSkills: z.string().default("উত্তর দেয়া হয়নি"),
  favoriteBooks: z.array(z.string()).default([]),
  hobbies: z.array(z.string()).default([]),
  height: z.string().default("উত্তর দেয়া হয়নি"),
  maritalStatus: z.string().default("উত্তর দেয়া হয়নি"),
});

// Occupation Schema
const occupationSchema = z.object({
  current: z.string().default("উত্তর দেয়া হয়নি"),
  description: z.string().default("উত্তর দেয়া হয়নি"),
  income: z.object({
    amount: z.number().default(0),
    currency: z.string().default("BDT"),
  }).default({}),
});

// Marriage Schema
const marriageSchema = z.object({
  guardiansAgree: z.boolean().default(false),
  studyContinue: z.string().default("উত্তর দেয়া হয়নি"),
  reason: z.string().default("উত্তর দেয়া হয়নি"),
  jobStatus: z.string().default("উত্তর দেয়া হয়নি"),
});

// Preference Schema
const preferenceSchema = z.object({
  ageRange: z.string().default("উত্তর দেয়া হয়নি"),
  complexion: z.string().default("উত্তর দেয়া হয়নি"),
  height: z.string().default("উত্তর দেয়া হয়নি"),
  education: z.string().default("উত্তর দেয়া হয়নি"),
  location: z.string().default("উত্তর দেয়া হয়নি"),
  maritalStatus: z.string().default("উত্তর দেয়া হয়নি"),
  profession: z.string().default("উত্তর দেয়া হয়নি"),
  financialCondition: z.string().default("উত্তর দেয়া হয়নি"),
  qualities: z.string().default("উত্তর দেয়া হয়নি"),
});

// Pledge Schema
const pledgeSchema = z.object({
  parentsAware: z.boolean().default(false),
  informationAccurate: z.boolean().default(false),
  nikahResponsibility: z.boolean().default(false),
});

// Full Biodata Schema
export const biodataSchema = z.object({
  userId: z.string().optional(), 
  name: z.string(),
  gender: z.enum(["male", "female"]),
  age: z.number(),

  address: z.object({
    present: addressSchema,
    permanent: addressSchema,
    grewUpAt: z.string().default("উত্তর দেয়া হয়নি"),
    country: z.string().default("Bangladesh"),
  }),

  education: educationSchema,
  family: familySchema,
  personal: personalSchema,
  occupation: occupationSchema,
  marriage: marriageSchema,
  preference: preferenceSchema,
  pledge: pledgeSchema,
  isApproved: z.enum(["pending", "approved", "rejected"]).default("pending"),
});
