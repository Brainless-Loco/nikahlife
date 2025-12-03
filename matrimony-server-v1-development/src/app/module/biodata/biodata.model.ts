// import { Schema, model } from "mongoose";
// import { IBiodata } from "./biodata.interface";

// const biodataSchema = new Schema<IBiodata>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//     age: { type: Number, required: true },

//     address: {
//       present: {
//         address: { type: String, default: "উত্তর দেয়া হয়নি" },
//         upazila: { type: String, default: "উত্তর দেয়া হয়নি" },
//         district: { type: String, default: "উত্তর দেয়া হয়নি" },
//         division: { type: String, default: "উত্তর দেয়া হয়নি" },
//       },
//       permanent: {
//         address: { type: String, default: "উত্তর দেয়া হয়নি" },
//         upazila: { type: String, default: "উত্তর দেয়া হয়নি" },
//         district: { type: String, default: "উত্তর দেয়া হয়নি" },
//         division: { type: String, default: "উত্তর দেয়া হয়নি" },
//       },
//       grewUpAt: { type: String, default: "উত্তর দেয়া হয়নি" },
//     },

//     education: {
//       method: { type: String, default: "General" },
//       history: [
//         {
//           level: String,
//           year: Number,
//           group: String,
//           result: String,
//           subject: String,
//           institution: String,
//         },
//       ],
//       other: [{ type: String }],
//     },

//     family: {
//       fatherAlive: { type: Boolean, default: true },
//       motherAlive: { type: Boolean, default: true },
//       fatherProfession: { type: String, default: "উত্তর দেয়া হয়নি" },
//       motherProfession: { type: String, default: "উত্তর দেয়া হয়নি" },
//       brothers: { type: Number, default: 0 },
//       sisters: { type: Number, default: 0 },
//       sistersInfo: [{ type: String }],
//       unclesProfession: [{ type: String }],
//       financialStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
//       financialDetails: { type: String, default: "উত্তর দেয়া হয়নি" },
//       religiousPractice: { type: String, default: "উত্তর দেয়া হয়নি" },
//     },

//     personal: {
//       name: { type: String, default: "উত্তর দেওয়া হয়নি" },
//       gender: { type: String, default: "উত্তর দেওয়া হয়নি" },
//       dress: { type: String, default: "উত্তর দেয়া হয়নি" },
//       prayerHabit: { type: String, default: "উত্তর দেয়া হয়নি" },
//       maintainMahram: { type: Boolean, default: false },
//       quranReading: { type: Boolean, default: false },
//       fiqh: { type: String, default: "উত্তর দেয়া হয়নি" },
//       entertainment: { type: Boolean, default: false },
//       healthIssues: { type: Boolean, default: false },
//       specialSkills: { type: String, default: "উত্তর দেয়া হয়নি" },
//       favoriteBooks: [{ type: String }],
//       hobbies: [{ type: String }],
//     },

//     occupation: {
//       current: { type: String, default: "উত্তর দেয়া হয়নি" },
//       description: { type: String, default: "উত্তর দেয়া হয়নি" },
//       income: {
//         amount: { type: Number, default: 0 },
//         currency: { type: String, default: "BDT" },
//       },
//     },

//     marriage: {
//       guardiansAgree: { type: Boolean, default: false },
//       studyContinue: { type: Boolean, default: null },
//       reason: { type: String, default: "উত্তর দেয়া হয়নি" },
//       jobStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
//     },

//     preference: {
//       ageRange: { type: String, default: "উত্তর দেয়া হয়নি" },
//       complexion: { type: String, default: "উত্তর দেয়া হয়নি" },
//       height: { type: String, default: "উত্তর দেয়া হয়নি" },
//       education: { type: String, default: "উত্তর দেয়া হয়নি" },
//       location: { type: String, default: "উত্তর দেয়া হয়নি" },
//       maritalStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
//       profession: { type: String, default: "উত্তর দেয়া হয়নি" },
//       financialCondition: { type: String, default: "উত্তর দেয়া হয়নি" },
//       qualities: [{ type: String }],
//     },

//     pledge: {
//       parentsAware: { type: Boolean, default: false },
//       informationAccurate: { type: Boolean, default: false },
//       nikahResponsibility: { type: Boolean, default: false },
//     },
//   },
//   { timestamps: true }
// );

// export const Biodata = model<IBiodata>("Biodata", biodataSchema);
// export default Biodata;

import { Schema, model } from "mongoose";
import { ApprovalStatus, IBiodata } from "./biodata.interface";
import { string } from "zod";

const biodataSchema = new Schema<IBiodata>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, ref: "User" },
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    age: { type: Number, required: true },

    address: {
      present: {
        address: { type: String, default: "উত্তর দেয়া হয়নি" },
        upazila: { type: String, default: "উত্তর দেয়া হয়নি" },
        district: { type: String, default: "উত্তর দেয়া হয়নি" },
        division: { type: String, default: "উত্তর দেয়া হয়নি" },
      },
      permanent: {
        address: { type: String, default: "উত্তর দেয়া হয়নি" },
        upazila: { type: String, default: "উত্তর দেয়া হয়নি" },
        district: { type: String, default: "উত্তর দেয়া হয়নি" },
        division: { type: String, default: "উত্তর দেয়া হয়নি" },
      },
      grewUpAt: { type: String, default: "উত্তর দেয়া হয়নি" },
      country: { type: String, default: "Bangladesh" },
    },

    education: {
      method: { type: String, default: "General" },
      history: [
        {
          level: String,
          year: Number,
          group: String,
          result: String,
          subject: String,
          institution: String,
        },
      ],
      other: [{ type: String }],
    },

    family: {
      fatherAlive: { type: Boolean, default: true },
      motherAlive: { type: Boolean, default: true },
      fatherProfession: { type: String, default: "উত্তর দেয়া হয়নি" },
      motherProfession: { type: String, default: "উত্তর দেয়া হয়নি" },
      brothers: { type: Number, default: 0 },
      sisters: { type: Number, default: 0 },
      sistersInfo: [{ type: String }],
      brothersInfo: [{ type: String }],
      unclesProfession: [{ type: String }],
      financialStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
      financialDetails: { type: String, default: "উত্তর দেয়া হয়নি" },
      religiousPractice: { type: String, default: "উত্তর দেয়া হয়নি" },
    },

    personal: {
      dress: { type: String, default: "উত্তর দেয়া হয়নি" },
      prayerHabit: { type: String, default: "উত্তর দেয়া হয়নি" },
      maintainMahram: { type: String, default: false },
      quranReading: { type: String, default: false },
      fiqh: { type: String, default: "উত্তর দেয়া হয়নি" },
      entertainment: { type: String, default: false },
      healthIssues: { type: String, default: false },
      specialSkills: { type: String, default: "উত্তর দেয়া হয়নি" },
      favoriteBooks: [{ type: String }],
      height: { type: String, default: "উত্তর দেয়া হয়নি" },
      maritalStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
      hobbies: [{ type: String }],
    },

    occupation: {
      current: { type: String, default: "উত্তর দেয়া হয়নি" },
      description: { type: String, default: "উত্তর দেয়া হয়নি" },
      income: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "BDT" },
      },
    },

    marriage: {
      guardiansAgree: { type: Schema.Types.Mixed, default: false },
      studyContinue: { type: String, default: null },
      reason: { type: String, default: "উত্তর দেয়া হয়নি" },
      jobStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
    },

    preference: {
      ageRange: { type: String, default: "উত্তর দেয়া হয়নি" },
      complexion: { type: String, default: "উত্তর দেয়া হয়নি" },
      height: { type: Schema.Types.Mixed, default: "উত্তর দেয়া হয়নি" },
      education: { type: String, default: "উত্তর দেয়া হয়নি" },
      location: { type: String, default: "উত্তর দেয়া হয়নি" },
      maritalStatus: { type: String, default: "উত্তর দেয়া হয়নি" },
      profession: { type: String, default: "উত্তর দেয়া হয়নি" },
      financialCondition: { type: String, default: "উত্তর দেয়া হয়নি" },
      qualities: [{ type: String }],
    },
    isApproved: {
      type: String,
      enum: ApprovalStatus,
      default: ApprovalStatus.PENDING,
    },

    contactInfo: {
      guardianPhone: { type: String, default: "উত্তর দেয়া হয়নি" },
      relation: { type: String, default: "উত্তর দেয়া হয়নি" },
    },

    pledge: {
      parentsAware: { type: Schema.Types.Mixed, default: false },
      informationAccurate: { type: Schema.Types.Mixed, default: false },
      nikahResponsibility: { type: Schema.Types.Mixed, default: false },
    },
  },
  { timestamps: true }
);

export const Biodata = model<IBiodata>("Biodata", biodataSchema);
export default Biodata;
