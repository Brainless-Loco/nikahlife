import { IBiodata } from "../module/biodata/biodata.interface";
import fs from "fs";
import path from "path";

/**
 * Format boolean values to readable strings
 */
const formatBoolean = (value: any): string => {
  if (value === true || value === "yes" || value === "Yes") return "Yes";
  if (value === false || value === "no" || value === "No") return "No";
  return String(value || "N/A");
};

/**
 * Check if a value is present and not empty/default
 */
const isValuePresent = (value: any): boolean => {
  if (!value) return false;
  if (typeof value === "string") {
    return value.trim() !== "" && value !== "উত্তর দেয়া হয়নি" && value !== "N/A";
  }
  if (typeof value === "number") return value > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return true;
  return true;
};

/**
 * Convert biodata to formatted JSON for PDF generation
 */
export const formatBiodataForPDF = (biodata: IBiodata): any => {
  return {
    profile: {
      biodataNumber: biodata.biodataNumber || "N/A",
      name: biodata.name || "N/A",
      gender: biodata.gender || "N/A",
      age: biodata.age || "N/A",
      phone: biodata.phone || "N/A",
      createdAt: biodata.createdAt ? new Date(biodata.createdAt).toLocaleDateString("en-US") : "N/A",
    },
    personalInformation: {
      height: biodata.personal?.height,
      weight: biodata.personal?.weight,
      skinColor: biodata.personal?.skinColor,
      bloodGroup: biodata.personal?.bloodGroup,
      maritalStatus: biodata.personal?.maritalStatus,
      dress: biodata.personal?.dress,
      healthIssues: biodata.personal?.healthIssues,
      specialSkills: biodata.personal?.specialSkills,
      personality: biodata.personal?.personality,
      favoriteFood: biodata.personal?.favoriteFood,
    },
    religiousPractices: {
      prayerHabit: biodata.personal?.prayerHabit,
      maintainMahram: formatBoolean(biodata.personal?.maintainMahram),
      quranReading: formatBoolean(biodata.personal?.quranReading),
      fiqh: biodata.personal?.fiqh,
      entertainment: biodata.personal?.entertainment,
    },
    interestsHobbies: {
      hobbies: biodata.personal?.hobbies?.filter(isValuePresent) || [],
      favoriteBooks: biodata.personal?.favoriteBooks?.filter(isValuePresent) || [],
    },
    address: {
      country: biodata.address?.country,
      grewUpAt: biodata.address?.grewUpAt,
      permanent: {
        division: biodata.address?.permanent?.division,
        district: biodata.address?.permanent?.district,
        upazila: biodata.address?.permanent?.upazila,
        address: biodata.address?.permanent?.address,
      },
      present: {
        division: biodata.address?.present?.division,
        district: biodata.address?.present?.district,
        upazila: biodata.address?.present?.upazila,
        address: biodata.address?.present?.address,
      },
    },
    education: {
      method: biodata.education?.method,
      history: biodata.education?.history?.map((edu) => ({
        level: edu.level,
        institution: edu.institution,
        year: edu.year,
        group: edu.group,
        subject: edu.subject,
        result: edu.result,
      })) || [],
      other: biodata.education?.other?.filter(isValuePresent) || [],
    },
    family: {
      fatherAlive: formatBoolean(biodata.family?.fatherAlive),
      fatherProfession: biodata.family?.fatherProfession,
      motherAlive: formatBoolean(biodata.family?.motherAlive),
      motherProfession: biodata.family?.motherProfession,
      brothers: biodata.family?.brothers || 0,
      sisters: biodata.family?.sisters || 0,
      brothersInfo: biodata.family?.brothersInfo?.filter(isValuePresent) || [],
      sistersInfo: biodata.family?.sistersInfo?.filter(isValuePresent) || [],
      unclesProfession: biodata.family?.unclesProfession?.filter(isValuePresent) || [],
      financialStatus: biodata.family?.financialStatus,
      financialDetails: biodata.family?.financialDetails,
      religiousPractice: biodata.family?.religiousPractice,
    },
    occupation: {
      current: biodata.occupation?.current,
      description: biodata.occupation?.description,
      income: biodata.occupation?.income ? {
        amount: biodata.occupation.income.amount,
        currency: biodata.occupation.income.currency || "BDT",
      } : null,
    },
    marriage: {
      guardiansAgree: formatBoolean(biodata.marriage?.guardiansAgree),
      studyContinue: biodata.marriage?.studyContinue,
      reason: biodata.marriage?.reason,
      jobStatus: biodata.marriage?.jobStatus,
    },
    preferences: {
      ageRange: biodata.preference?.ageRange,
      complexion: biodata.preference?.complexion,
      height: biodata.preference?.height,
      education: biodata.preference?.education,
      location: biodata.preference?.location,
      maritalStatus: biodata.preference?.maritalStatus,
      profession: biodata.preference?.profession,
      financialCondition: biodata.preference?.financialCondition,
      qualities: biodata.preference?.qualities?.filter(isValuePresent) || [],
    },
    contactInfo: {
      guardianPhone: biodata.contactInfo?.guardianPhone,
      relation: biodata.contactInfo?.relation,
    },
  };
};

/**
 * Generate HTML content for PDF - using string concatenation instead of template literals
 */
export const generateBiodataPDFHTML = (biodata: IBiodata): string => {
  const formatted = formatBiodataForPDF(biodata);
  const today = new Date().toLocaleDateString("en-US");
  const age = formatted.profile.age ? Math.round(Number(formatted.profile.age)) : 0;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Biodata - ${formatted.profile.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; background-color: #f9fafb; color: #1f2937; line-height: 1.6; }
    .container { max-width: 210mm; background: white; margin: 10px auto; padding: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #10b981; }
    .logo { width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; flex-shrink: 0; }
    .header-info h1 { font-size: 28px; color: #10b981; margin-bottom: 3px; font-weight: 700; }
    .header-info p { font-size: 13px; color: #6b7280; font-weight: 500; }
    .profile-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981; }
    .profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .profile-item { display: flex; flex-direction: column; }
    .profile-item .label { font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
    .profile-item .value { font-size: 13px; color: #1f2937; font-weight: 600; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section-header { background: #10b981; color: white; padding: 12px 16px; font-weight: 700; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; border-radius: 4px; }
    .section-header::before { content: '▪'; margin-right: 10px; }
    .section-content { padding: 0 10px; }
    .content-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 10px; }
    .content-grid.single { grid-template-columns: 1fr; }
    .content-item { display: flex; flex-direction: column; }
    .content-item .label { font-weight: 700; color: #059669; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px; }
    .content-item .value { color: #1f2937; font-size: 12px; line-height: 1.5; }
    .content-item .value.empty { color: #9ca3af; font-style: italic; font-size: 11px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .tag { background: #dbeafe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap; }
    .education-entry { background: #fafafa; padding: 10px; border-left: 3px solid #dbeafe; margin-bottom: 8px; border-radius: 3px; }
    .education-level { font-weight: 700; color: #1f2937; font-size: 12px; margin-bottom: 3px; }
    .education-details { font-size: 11px; color: #6b7280; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NL</div>
      <div class="header-info">
        <h1>NIKAH LIFE</h1>
        <p>Matrimonial Biodata</p>
      </div>
    </div>
    
    <div class="profile-card">
      <div class="profile-grid">
        <div class="profile-item"><span class="label">Name</span><span class="value">${formatted.profile.name}</span></div>
        <div class="profile-item"><span class="label">Biodata #</span><span class="value">${formatted.profile.biodataNumber}</span></div>
        <div class="profile-item"><span class="label">Phone</span><span class="value">${formatted.profile.phone}</span></div>
        <div class="profile-item"><span class="label">Age</span><span class="value">${age} years</span></div>
        <div class="profile-item"><span class="label">Gender</span><span class="value">${formatted.profile.gender}</span></div>
        <div class="profile-item"><span class="label">Created</span><span class="value">${formatted.profile.createdAt}</span></div>
      </div>
    </div>`;

  // Personal Information Section
  const personalItems = [
    { label: "Height", value: formatted.personalInformation.height },
    { label: "Weight", value: formatted.personalInformation.weight },
    { label: "Skin Color", value: formatted.personalInformation.skinColor },
    { label: "Blood Group", value: formatted.personalInformation.bloodGroup },
    { label: "Marital Status", value: formatted.personalInformation.maritalStatus },
    { label: "Dress Style", value: formatted.personalInformation.dress },
    { label: "Health Issues", value: formatted.personalInformation.healthIssues },
    { label: "Special Skills", value: formatted.personalInformation.specialSkills },
    { label: "Personality", value: formatted.personalInformation.personality },
    { label: "Favorite Food", value: formatted.personalInformation.favoriteFood },
  ];
  
  const hasPersonalContent = personalItems.some(i => i.value);
  if (hasPersonalContent) {
    html += '<div class="section"><div class="section-header">Personal Information</div><div class="section-content"><div class="content-grid">';
    personalItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div></div></div>";
  }

  // Religious Practices Section
  const religiousItems = [
    { label: "Prayer Habit", value: formatted.religiousPractices.prayerHabit },
    { label: "Maintain Mahram", value: formatted.religiousPractices.maintainMahram },
    { label: "Quran Reading", value: formatted.religiousPractices.quranReading },
    { label: "Fiqh Preference", value: formatted.religiousPractices.fiqh },
    { label: "Entertainment", value: formatted.religiousPractices.entertainment },
  ];

  const hasReligiousContent = religiousItems.some(i => i.value);
  if (hasReligiousContent) {
    html += '<div class="section"><div class="section-header">Religious Practices</div><div class="section-content"><div class="content-grid">';
    religiousItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div></div></div>";
  }

  // Interests & Hobbies Section
  if (formatted.interestsHobbies.hobbies.length > 0 || formatted.interestsHobbies.favoriteBooks.length > 0) {
    html += '<div class="section"><div class="section-header">Interests & Hobbies</div><div class="section-content">';
    if (formatted.interestsHobbies.hobbies.length > 0) {
      html += '<div class="content-grid single"><div class="content-item"><span class="label">Hobbies</span><div class="tags">';
      formatted.interestsHobbies.hobbies.forEach((h: string) => {
        html += `<span class="tag">${h}</span>`;
      });
      html += "</div></div></div>";
    }
    if (formatted.interestsHobbies.favoriteBooks.length > 0) {
      html += '<div class="content-grid single"><div class="content-item"><span class="label">Favorite Books</span><div class="tags">';
      formatted.interestsHobbies.favoriteBooks.forEach((b: string) => {
        html += `<span class="tag">${b}</span>`;
      });
      html += "</div></div></div>";
    }
    html += "</div></div>";
  }

  // Address Section
  const addressItems = [
    { label: "Country", value: formatted.address.country },
    { label: "Grew Up At", value: formatted.address.grewUpAt },
  ];
  const permAddress = [formatted.address.permanent.address, formatted.address.permanent.upazila, formatted.address.permanent.district, formatted.address.permanent.division].filter(Boolean).join(", ") || null;
  const presAddress = [formatted.address.present.address, formatted.address.present.upazila, formatted.address.present.district, formatted.address.present.division].filter(Boolean).join(", ") || null;
  
  if (permAddress) addressItems.push({ label: "Permanent Address", value: permAddress });
  if (presAddress) addressItems.push({ label: "Present Address", value: presAddress });

  const hasAddressContent = addressItems.some(i => i.value);
  if (hasAddressContent) {
    html += '<div class="section"><div class="section-header">Address</div><div class="section-content"><div class="content-grid">';
    addressItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div></div></div>";
  }

  // Education Section
  if (formatted.education.method || formatted.education.history.length > 0 || formatted.education.other.length > 0) {
    html += '<div class="section"><div class="section-header">Education</div><div class="section-content">';
    if (formatted.education.method) {
      html += `<div class="content-grid single"><div class="content-item"><span class="label">Education Method</span><span class="value">${formatted.education.method}</span></div></div>`;
    }
    if (formatted.education.history.length > 0) {
      html += '<div style="margin-top: 10px;">';
      formatted.education.history.forEach((edu: any) => {
        const eduStr = [edu.institution, edu.group, edu.subject, edu.result].filter(Boolean).join(" | ");
        html += `<div class="education-entry"><div class="education-level">${edu.level}${edu.year ? ` (${edu.year})` : ""}</div><div class="education-details">${eduStr}</div></div>`;
      });
      html += "</div>";
    }
    if (formatted.education.other.length > 0) {
      html += '<div class="content-grid single" style="margin-top: 10px;"><div class="content-item"><span class="label">Other Education</span><div class="tags">';
      formatted.education.other.forEach((item: string) => {
        html += `<span class="tag">${item}</span>`;
      });
      html += "</div></div></div>";
    }
    html += "</div></div>";
  }

  // Family Section
  const familyItems = [
    { label: "Father Alive", value: formatted.family.fatherAlive },
    { label: "Father's Profession", value: formatted.family.fatherProfession },
    { label: "Mother Alive", value: formatted.family.motherAlive },
    { label: "Mother's Profession", value: formatted.family.motherProfession },
    { label: "Brothers", value: formatted.family.brothers > 0 ? formatted.family.brothers.toString() : null },
    { label: "Sisters", value: formatted.family.sisters > 0 ? formatted.family.sisters.toString() : null },
    { label: "Financial Status", value: formatted.family.financialStatus },
    { label: "Financial Details", value: formatted.family.financialDetails },
    { label: "Religious Practice", value: formatted.family.religiousPractice },
  ];

  const hasFamilyContent = familyItems.some(i => i.value);
  if (hasFamilyContent) {
    html += '<div class="section"><div class="section-header">Family Information</div><div class="section-content"><div class="content-grid">';
    familyItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div>";
    if (formatted.family.brothersInfo.length > 0 || formatted.family.sistersInfo.length > 0) {
      html += '<div class="content-grid single" style="margin-top: 10px;">';
      if (formatted.family.brothersInfo.length > 0) {
        html += '<div class="content-item"><span class="label">Brothers Info</span><div class="tags">';
        formatted.family.brothersInfo.forEach((info: string) => {
          html += `<span class="tag">${info}</span>`;
        });
        html += "</div></div>";
      }
      if (formatted.family.sistersInfo.length > 0) {
        html += '<div class="content-item"><span class="label">Sisters Info</span><div class="tags">';
        formatted.family.sistersInfo.forEach((info: string) => {
          html += `<span class="tag">${info}</span>`;
        });
        html += "</div></div>";
      }
      html += "</div>";
    }
    html += "</div></div>";
  }

  // Occupation Section
  const occupationItems = [
    { label: "Current Occupation", value: formatted.occupation.current },
    { label: "Description", value: formatted.occupation.description },
    { label: "Monthly Income", value: formatted.occupation.income ? `${formatted.occupation.income.amount} ${formatted.occupation.income.currency}` : null },
  ];

  const hasOccupationContent = occupationItems.some(i => i.value);
  if (hasOccupationContent) {
    html += '<div class="section"><div class="section-header">Occupation</div><div class="section-content"><div class="content-grid">';
    occupationItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div></div></div>";
  }

  // Marriage Section
  const marriageItems = [
    { label: "Guardians Agree", value: formatted.marriage.guardiansAgree },
    { label: "Study Continuation", value: formatted.marriage.studyContinue },
    { label: "Job Status", value: formatted.marriage.jobStatus },
    { label: "Reason for Marriage", value: formatted.marriage.reason },
  ];

  const hasMarriageContent = marriageItems.some(i => i.value);
  if (hasMarriageContent) {
    html += '<div class="section"><div class="section-header">Marriage Information</div><div class="section-content"><div class="content-grid">';
    marriageItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div></div></div>";
  }

  // Preferences Section
  const preferenceItems = [
    { label: "Age Range", value: formatted.preferences.ageRange },
    { label: "Complexion", value: formatted.preferences.complexion },
    { label: "Height", value: formatted.preferences.height },
    { label: "Education", value: formatted.preferences.education },
    { label: "Location", value: formatted.preferences.location },
    { label: "Marital Status", value: formatted.preferences.maritalStatus },
    { label: "Profession", value: formatted.preferences.profession },
    { label: "Financial Condition", value: formatted.preferences.financialCondition },
  ];

  const hasPreferenceContent = preferenceItems.some(i => i.value) || formatted.preferences.qualities.length > 0;
  if (hasPreferenceContent) {
    html += '<div class="section"><div class="section-header">Expected Life Partner Preferences</div><div class="section-content"><div class="content-grid">';
    preferenceItems.forEach(item => {
      if (item.value) {
        html += `<div class="content-item"><span class="label">${item.label}</span><span class="value">${item.value}</span></div>`;
      }
    });
    html += "</div>";
    if (formatted.preferences.qualities.length > 0) {
      html += '<div class="content-grid single" style="margin-top: 10px;"><div class="content-item"><span class="label">Desired Qualities</span><div class="tags">';
      formatted.preferences.qualities.forEach((q: string) => {
        html += `<span class="tag">${q}</span>`;
      });
      html += "</div></div></div>";
    }
    html += "</div></div>";
  }

  // Footer
  html += `<div class="footer">Generated on ${today} | NikahLife Matrimonial Service</div></div></body></html>`;

  return html;
};
