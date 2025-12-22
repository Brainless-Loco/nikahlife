import { jsPDF } from "jspdf";

export const generateBiodataPDF = async (biodata: Record<string, unknown>, language: string = "en") => {
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
  doc.text(String(biodata?.name || "N/A"), margin, yPos);

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
      const uploadDate = new Date(String(biodata.createdAt)).toLocaleDateString(
        language === "bn" ? "bn-BD" : "en-US"
      );
      bioInfo.push(`Uploaded: ${uploadDate}`);
    } catch {
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

  const addField = (label: string, value: unknown) => {
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
  const personal = biodata?.personal as Record<string, unknown> | undefined;
  const address = biodata?.address as Record<string, unknown> | undefined;
  const education = biodata?.education as Record<string, unknown> | undefined;
  const family = biodata?.family as Record<string, unknown> | undefined;
  const occupation = biodata?.occupation as Record<string, unknown> | undefined;
  const marriage = biodata?.marriage as Record<string, unknown> | undefined;
  const preference = biodata?.preference as Record<string, unknown> | undefined;

  addField("Name:", biodata?.name);
  addField("Age:", biodata?.age ? `${biodata.age} years` : null);
  addField("Gender:", biodata?.gender);
  addField("Height:", personal?.height);
  addField("Weight:", personal?.weight);
  addField("Skin Color:", personal?.skinColor);
  addField("Blood Group:", personal?.bloodGroup);
  addField("Marital Status:", personal?.maritalStatus);
  addField("Nationality:", address?.country);
  checkPageBreak();

  // ADDRESS
  if (address) {
    addSection("ADDRESS");
    
    const permanent = address?.permanent as Record<string, unknown> | undefined;
    const present = address?.present as Record<string, unknown> | undefined;
    
    if (permanent?.division || permanent?.district || permanent?.upazila) {
      const permAddress: string[] = [];
      if (permanent?.division) permAddress.push(String(permanent.division));
      if (permanent?.district) permAddress.push(String(permanent.district));
      if (permanent?.upazila) permAddress.push(String(permanent.upazila));
      if (permanent?.address) permAddress.push(String(permanent.address));
      if (permAddress.length > 0) {
        addField("Permanent Address:", permAddress.join(", "));
      }
    }
    
    if (present?.division || present?.district || present?.upazila) {
      const presAddress: string[] = [];
      if (present?.division) presAddress.push(String(present.division));
      if (present?.district) presAddress.push(String(present.district));
      if (present?.upazila) presAddress.push(String(present.upazila));
      if (present?.address) presAddress.push(String(present.address));
      if (presAddress.length > 0) {
        addField("Present Address:", presAddress.join(", "));
      }
    }
    
    addField("Grew Up At:", address?.grewUpAt);
    checkPageBreak();
  }

  // EDUCATION
  if (education) {
    addSection("EDUCATION");
    addField("Method:", education?.method);
    
    const eduHistory = education?.history as unknown[] | undefined;
    if (eduHistory && Array.isArray(eduHistory)) {
      eduHistory.forEach((edu: unknown) => {
        const eduObj = edu as Record<string, unknown>;
        if (eduObj.level) {
          let eduText = String(eduObj.level);
          if (eduObj.institution) eduText += ` - ${String(eduObj.institution)}`;
          if (eduObj.year) eduText += ` (${String(eduObj.year)})`;
          if (eduObj.group) eduText += ` - ${String(eduObj.group)}`;
          if (eduObj.subject) eduText += ` - ${String(eduObj.subject)}`;
          if (eduObj.result) eduText += ` [${String(eduObj.result)}]`;
          addField("", eduText);
        }
      });
    }
    
    const eduOther = education?.other as unknown[] | undefined;
    if (eduOther && Array.isArray(eduOther) && eduOther.length > 0) {
      addField("Other Education:", (eduOther as unknown[]).map(String).join(", "));
    }
    checkPageBreak();
  }

  // FAMILY INFORMATION
  if (family) {
    addSection("FAMILY INFORMATION");
    addField("Father Alive:", family?.fatherAlive ? "Yes" : "No");
    addField("Father's Profession:", family?.fatherProfession);
    addField("Mother Alive:", family?.motherAlive ? "Yes" : "No");
    addField("Mother's Profession:", family?.motherProfession);
    if ((family?.brothers as number) > 0) {
      addField("Brothers:", String(family?.brothers));
    }
    const brothersInfo = family?.brothersInfo as unknown[] | undefined;
    if (brothersInfo && Array.isArray(brothersInfo) && brothersInfo.length > 0) {
      addField("Brothers Info:", brothersInfo.map(String).join(", "));
    }
    if ((family?.sisters as number) > 0) {
      addField("Sisters:", String(family?.sisters));
    }
    const sistersInfo = family?.sistersInfo as unknown[] | undefined;
    if (sistersInfo && Array.isArray(sistersInfo) && sistersInfo.length > 0) {
      addField("Sisters Info:", sistersInfo.map(String).join(", "));
    }
    addField("Financial Status:", family?.financialStatus);
    addField("Financial Details:", family?.financialDetails);
    addField("Religious Practice:", family?.religiousPractice);
    const unclesProfession = family?.unclesProfession as unknown[] | undefined;
    addField("Uncles Profession:", unclesProfession ? unclesProfession.map(String).join(", ") : null);
    checkPageBreak();
  }

  // OCCUPATION
  if (occupation) {
    addSection("OCCUPATION");
    addField("Current Occupation:", occupation?.current);
    addField("Description:", occupation?.description);
    const income = occupation?.income as Record<string, unknown> | undefined;
    if (income?.amount) {
      addField(
        "Monthly Income:",
        `${income.amount} ${income.currency || "BDT"}`
      );
    }
    checkPageBreak();
  }

  // LIFESTYLE & PERSONAL PREFERENCES
  if (personal?.dress || personal?.prayerHabit || personal?.maintainMahram || 
      personal?.quranReading || personal?.fiqh || personal?.entertainment || 
      personal?.healthIssues || personal?.specialSkills || (personal?.hobbies && (personal.hobbies as unknown[]).length) || 
      (personal?.favoriteBooks && (personal.favoriteBooks as unknown[]).length)) {
    addSection("LIFESTYLE & PREFERENCES");
    addField("Dress Style:", personal?.dress);
    addField("Prayer Habit:", personal?.prayerHabit);
    addField("Maintain Mahram:", personal?.maintainMahram);
    addField("Quran Reading:", personal?.quranReading);
    addField("Fiqh Preference:", personal?.fiqh);
    addField("Entertainment Habits:", personal?.entertainment);
    addField("Health Issues:", personal?.healthIssues);
    addField("Special Skills:", personal?.specialSkills);
    const hobbies = personal?.hobbies as unknown[] | undefined;
    if (hobbies && Array.isArray(hobbies) && hobbies.length > 0) {
      addField("Hobbies:", hobbies.map(String).join(", "));
    }
    const favoriteBooks = personal?.favoriteBooks as unknown[] | undefined;
    if (favoriteBooks && Array.isArray(favoriteBooks) && favoriteBooks.length > 0) {
      addField("Favorite Books:", favoriteBooks.map(String).join(", "));
    }
    checkPageBreak();
  }

  // MARRIAGE RELATED
  if (marriage) {
    addSection("MARRIAGE INFORMATION");
    addField("Guardians Agree:", marriage?.guardiansAgree ? "Yes" : "No");
    addField("Study Continuation:", marriage?.studyContinue);
    addField("Job Status:", marriage?.jobStatus);
    addField("Reason for Marriage:", marriage?.reason);
    checkPageBreak();
  }

  // EXPECTED LIFE PARTNER
  if (preference) {
    addSection("EXPECTED LIFE PARTNER PREFERENCES");
    addField("Age Range:", preference?.ageRange);
    addField("Complexion:", preference?.complexion);
    addField("Height:", preference?.height);
    addField("Education:", preference?.education);
    addField("Location:", preference?.location);
    addField("Marital Status:", preference?.maritalStatus);
    addField("Profession:", preference?.profession);
    addField("Financial Condition:", preference?.financialCondition);
    
    const qualities = preference?.qualities as unknown[] | undefined;
    if (qualities && Array.isArray(qualities)) {
      const qualitiesStr = qualities.map(String).join(", ");
      addField("Desired Qualities:", qualitiesStr);
    }
    checkPageBreak();
  }

  // CONTACT INFORMATION
  const userId = biodata?.userId as Record<string, unknown> | undefined;
  if (userId) {
    addSection("CONTACT INFORMATION");
    addField("Email:", userId?.email);
    addField("Phone:", userId?.phone);
    checkPageBreak();
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont("helvetica", "normal");

  const footerY = pageHeight - 10;
  const timestamp = new Date().toLocaleDateString("en-US");
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
