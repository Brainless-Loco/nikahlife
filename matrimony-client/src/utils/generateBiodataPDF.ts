import { jsPDF } from "jspdf";

export const generateBiodataPDF = async (biodata: any, language: string = "en") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Colors matching theme
  const primaryColor = [16, 185, 129]; // emerald-600
  const secondaryColor = [51, 65, 85]; // slate-700
  const lightGray = [243, 244, 246]; // gray-100
  const darkGray = [107, 114, 128]; // gray-500

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  let yPos = 12;

  // Header background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, "F");

  // Logo text (Text-based logo since image loading is complex)
  doc.setFillColor(255, 255, 255);
  doc.rect(12, 12, 14, 14, "F"); // White background box
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("NL", 19, 21.5, { align: "center" });

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NIKAH LIFE", 28, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Matrimonial Profile", 28, 25);

  // Decorative line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, 36, pageWidth - margin, 36);

  yPos = 42;

  // Profile name
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(biodata?.name || "N/A", margin, yPos);

  yPos += 7;
  doc.setFontSize(9);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "normal");

  // Biodata info
  const bioInfo = [];
  if (biodata?.biodataNumber) {
    bioInfo.push(`Biodata #${biodata.biodataNumber}`);
  }
  if (biodata?.createdAt) {
    try {
      const uploadDate = new Date(biodata.createdAt).toLocaleDateString(
        language === "bn" ? "bn-BD" : "en-US"
      );
      bioInfo.push(`Uploaded: ${uploadDate}`);
    } catch (e) {
      // ignore date errors
    }
  }
  if (bioInfo.length > 0) {
    doc.text(bioInfo.join(" | "), margin, yPos);
  }

  yPos += 8;

  // Helper function to add sections
  const addSection = (title: string) => {
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(margin - 2, yPos - 5, pageWidth - 2 * margin + 4, 7, "F");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, yPos);
    yPos += 8;
  };

  const addField = (label: string, value: any) => {
    if (!value || value === "উত্তর দেয়া হয়নি" || value === "N/A") return;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, yPos);
    doc.setFont("helvetica", "normal");
    
    const valueStr = String(value);
    const maxWidth = 130;
    const wrappedText = doc.splitTextToSize(valueStr, maxWidth);
    doc.text(wrappedText, margin + 50, yPos);
    yPos += wrappedText.length > 1 ? 8 : 5;
  };

  const checkPageBreak = () => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = margin;
    }
  };

  // PERSONAL INFORMATION
  addSection("PERSONAL INFORMATION");
  addField("Name:", biodata?.name);
  addField("Age:", biodata?.age ? `${biodata.age} years` : null);
  addField("Gender:", biodata?.gender);
  addField("Height:", biodata?.personal?.height);
  addField("Weight:", biodata?.personal?.weight);
  addField("Skin Color:", biodata?.personal?.skinColor);
  addField("Blood Group:", biodata?.personal?.bloodGroup);
  addField("Marital Status:", biodata?.personal?.maritalStatus);
  addField("Nationality:", biodata?.address?.country);
  checkPageBreak();

  // ADDRESS
  if (biodata?.address) {
    addSection("ADDRESS");
    
    if (biodata.address.permanent?.division || biodata.address.permanent?.district || biodata.address.permanent?.upazila) {
      let permAddress = [];
      if (biodata.address.permanent?.division) permAddress.push(biodata.address.permanent.division);
      if (biodata.address.permanent?.district) permAddress.push(biodata.address.permanent.district);
      if (biodata.address.permanent?.upazila) permAddress.push(biodata.address.permanent.upazila);
      if (biodata.address.permanent?.address) permAddress.push(biodata.address.permanent.address);
      if (permAddress.length > 0) {
        addField("Permanent Address:", permAddress.join(", "));
      }
    }
    
    if (biodata.address.present?.division || biodata.address.present?.district || biodata.address.present?.upazila) {
      let presAddress = [];
      if (biodata.address.present?.division) presAddress.push(biodata.address.present.division);
      if (biodata.address.present?.district) presAddress.push(biodata.address.present.district);
      if (biodata.address.present?.upazila) presAddress.push(biodata.address.present.upazila);
      if (biodata.address.present?.address) presAddress.push(biodata.address.present.address);
      if (presAddress.length > 0) {
        addField("Present Address:", presAddress.join(", "));
      }
    }
    
    addField("Grew Up At:", biodata.address.grewUpAt);
    checkPageBreak();
  }

  // EDUCATION
  if (biodata?.education) {
    addSection("EDUCATION");
    addField("Method:", biodata.education.method);
    
    if (biodata.education.history && Array.isArray(biodata.education.history)) {
      biodata.education.history.forEach((edu: any) => {
        if (edu.level) {
          let eduText = edu.level;
          if (edu.institution) eduText += ` - ${edu.institution}`;
          if (edu.year) eduText += ` (${edu.year})`;
          if (edu.group) eduText += ` - ${edu.group}`;
          if (edu.subject) eduText += ` - ${edu.subject}`;
          if (edu.result) eduText += ` [${edu.result}]`;
          addField("", eduText);
        }
      });
    }
    
    if (biodata.education.other && Array.isArray(biodata.education.other) && biodata.education.other.length > 0) {
      addField("Other Education:", biodata.education.other.join(", "));
    }
    checkPageBreak();
  }

  // FAMILY INFORMATION
  if (biodata?.family) {
    addSection("FAMILY INFORMATION");
    addField("Father Alive:", biodata.family.fatherAlive ? "Yes" : "No");
    addField("Father's Profession:", biodata.family.fatherProfession);
    addField("Mother Alive:", biodata.family.motherAlive ? "Yes" : "No");
    addField("Mother's Profession:", biodata.family.motherProfession);
    if (biodata.family.brothers > 0) {
      addField("Brothers:", biodata.family.brothers.toString());
    }
    if (biodata.family.brothersInfo && Array.isArray(biodata.family.brothersInfo) && biodata.family.brothersInfo.length > 0) {
      addField("Brothers Info:", biodata.family.brothersInfo.join(", "));
    }
    if (biodata.family.sisters > 0) {
      addField("Sisters:", biodata.family.sisters.toString());
    }
    if (biodata.family.sistersInfo && Array.isArray(biodata.family.sistersInfo) && biodata.family.sistersInfo.length > 0) {
      addField("Sisters Info:", biodata.family.sistersInfo.join(", "));
    }
    addField("Financial Status:", biodata.family.financialStatus);
    addField("Financial Details:", biodata.family.financialDetails);
    addField("Religious Practice:", biodata.family.religiousPractice);
    addField("Uncles Profession:", biodata.family.unclesProfession?.join(", "));
    checkPageBreak();
  }

  // OCCUPATION
  if (biodata?.occupation) {
    addSection("OCCUPATION");
    addField("Current Occupation:", biodata.occupation.current);
    addField("Description:", biodata.occupation.description);
    if (biodata.occupation.income?.amount) {
      addField(
        "Monthly Income:",
        `${biodata.occupation.income.amount} ${biodata.occupation.income.currency || "BDT"}`
      );
    }
    checkPageBreak();
  }

  // LIFESTYLE & PERSONAL PREFERENCES
  if (biodata?.personal?.dress || biodata?.personal?.prayerHabit || biodata?.personal?.maintainMahram || 
      biodata?.personal?.quranReading || biodata?.personal?.fiqh || biodata?.personal?.entertainment || 
      biodata?.personal?.healthIssues || biodata?.personal?.specialSkills || biodata?.personal?.hobbies?.length || 
      biodata?.personal?.favoriteBooks?.length) {
    addSection("LIFESTYLE & PREFERENCES");
    addField("Dress Style:", biodata.personal?.dress);
    addField("Prayer Habit:", biodata.personal?.prayerHabit);
    addField("Maintain Mahram:", biodata.personal?.maintainMahram);
    addField("Quran Reading:", biodata.personal?.quranReading);
    addField("Fiqh Preference:", biodata.personal?.fiqh);
    addField("Entertainment Habits:", biodata.personal?.entertainment);
    addField("Health Issues:", biodata.personal?.healthIssues);
    addField("Special Skills:", biodata.personal?.specialSkills);
    if (biodata.personal?.hobbies && Array.isArray(biodata.personal.hobbies) && biodata.personal.hobbies.length > 0) {
      addField("Hobbies:", biodata.personal.hobbies.join(", "));
    }
    if (biodata.personal?.favoriteBooks && Array.isArray(biodata.personal.favoriteBooks) && biodata.personal.favoriteBooks.length > 0) {
      addField("Favorite Books:", biodata.personal.favoriteBooks.join(", "));
    }
    checkPageBreak();
  }

  // MARRIAGE RELATED
  if (biodata?.marriage) {
    addSection("MARRIAGE INFORMATION");
    addField("Guardians Agree:", biodata.marriage.guardiansAgree ? "Yes" : "No");
    addField("Study Continuation:", biodata.marriage.studyContinue);
    addField("Job Status:", biodata.marriage.jobStatus);
    addField("Reason for Marriage:", biodata.marriage.reason);
    checkPageBreak();
  }

  // EXPECTED LIFE PARTNER
  if (biodata?.preference) {
    addSection("EXPECTED LIFE PARTNER PREFERENCES");
    addField("Age Range:", biodata.preference.ageRange);
    addField("Complexion:", biodata.preference.complexion);
    addField("Height:", biodata.preference.height);
    addField("Education:", biodata.preference.education);
    addField("Location:", biodata.preference.location);
    addField("Marital Status:", biodata.preference.maritalStatus);
    addField("Profession:", biodata.preference.profession);
    addField("Financial Condition:", biodata.preference.financialCondition);
    
    if (biodata.preference.qualities && Array.isArray(biodata.preference.qualities)) {
      const qualitiesStr = biodata.preference.qualities.join(", ");
      addField("Desired Qualities:", qualitiesStr);
    }
    checkPageBreak();
  }

  // CONTACT INFORMATION
  if (biodata?.userId) {
    addSection("CONTACT INFORMATION");
    addField("Email:", biodata.userId?.email);
    addField("Phone:", biodata.userId?.phone);
    checkPageBreak();
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "normal");

  const footerY = pageHeight - 10;
  const timestamp = new Date().toLocaleDateString();
  doc.text(
    `Generated on ${timestamp} | NikahLife Matrimonial Service`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Decorative footer line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  return doc;
};
