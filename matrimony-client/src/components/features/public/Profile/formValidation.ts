import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  age: z.coerce.number().min(18, "Age must be at least 18"),

  // Address
  presentDivision: z.string().optional(),
  presentDistrict: z.string().optional(),
  presentUpazila: z.string().optional(),
  presentDetails: z.string().optional(),
  permanentDivision: z.string().optional(),
  permanentDistrict: z.string().optional(),
  permanentUpazila: z.string().optional(),
  permanentDetails: z.string().optional(),
  country: z.string().optional(),

  // Education
  sscYear: z.string().optional(),
  sscGroup: z.string().optional(),
  sscResult: z.string().optional(),
  hscYear: z.string().optional(),
  hscGroup: z.string().optional(),
  hscResult: z.string().optional(),
  honours: z.string().optional(),

  // Family Info
  fatherAlive: z.coerce.boolean().optional(),
  fatherOccupation: z.string().optional(),
  motherAlive: z.coerce.boolean().optional(),
  motherOccupation: z.string().optional(),
  brothers: z.string().optional(),
  sisters: z.string().optional(),
  siblingsDetails: z.string().optional(),

  // Personal Info
  beard: z.string().optional(),
  salat: z.string().optional(),
  mahramTravel: z.string().optional(),
  health: z.string().optional(),
  disability: z.string().optional(),

  // Physical Info
  height: z.string().optional(),
  bodyColor: z.string().optional(),
  bloodGroup: z.string().optional(),
  weight: z.string().optional(),

  // Marital Info
  maritalStatus: z.string().optional(),
  childAllow: z.coerce.boolean().optional(),
  whyWantToMarry: z.string().optional(),
  futurePlan: z.string().optional(),

  // Contact Info
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  facebook: z.string().optional(),

  // Preferences
  ageRange: z.string().optional(),
  educationLevel: z.string().optional(),
  preferredMaritalStatus: z.string().optional(),
  religiousPractice: z.string().optional(),
  physicalAppearance: z.string().optional(),
  additionalQualities: z.string().optional(),
});
