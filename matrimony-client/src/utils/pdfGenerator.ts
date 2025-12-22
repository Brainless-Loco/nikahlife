/**
 * Format boolean values to readable strings
 */
const formatBoolean = (value: boolean | string | undefined): string => {
  if (value === true || value === "yes" || value === "Yes") return "Yes";
  if (value === false || value === "no" || value === "No") return "No";
  return "Not provided";
};

/**
 * Get logo as base64
 */
const getLogoBase64 = async (): Promise<string> => {
  try {
    const response = await fetch("/logo/nikahlife.png");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    // Fallback to gradient SVG if logo fails to load
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 606 171'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='606' height='171' fill='url(%23grad)'/%3E%3Ctext x='303' y='95' font-size='80' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial, sans-serif'%3ENL%3C/text%3E%3C/svg%3E";
  }
};

/**
 * Download biodata as PDF
 */
export const downloadBiodataAsPDF = async (biodata: Record<string, unknown>): Promise<void> => {
  try {
    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Set default font
    pdf.setFont("helvetica");

    // Add logo (606x171 pixels, wider format) - centered at top
    try {
      const logoBase64 = await getLogoBase64();
      const logoHeight = 22; // Height in mm
      const logoWidth = (606 / 171) * logoHeight; // Maintain aspect ratio (approximately 78mm width)
      const logoX = (pageWidth - logoWidth) / 2; // Center horizontally
      pdf.addImage(logoBase64, "PNG", logoX, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 5;
    } catch {
      console.warn("Logo failed to load, continuing without it");
      yPosition += 5;
    }

    // Add horizontal line separator
    pdf.setDrawColor(16, 185, 129); // Emerald
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;

    // Add watermark function
    const addWatermark = () => {
      const watermarkText = "NikahLife";
      const angle = -45;
      const watermarkX = pageWidth / 2;
      const watermarkY = pageHeight / 2;
      
      pdf.setTextColor(220, 220, 220); // Very light gray
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(70);
      pdf.text(watermarkText, watermarkX, watermarkY, { 
        align: "center",
        angle: angle,
      });
      pdf.setTextColor(0, 0, 0);
    };

    // Add watermark to first page
    addWatermark();

    // Helper function to add section with highlighted header
    const addSection = (title: string, content: Array<[string, string]>) => {
      if (yPosition > pageHeight - 45) {
        pdf.addPage();
        yPosition = margin;
        addWatermark();
      }

      // Section title with emerald background highlight
      pdf.setFillColor(16, 185, 129); // Emerald background
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);

      const sectionTitleHeight = 7;
      pdf.rect(margin, yPosition, contentWidth, sectionTitleHeight, "F"); // Filled rectangle
      pdf.text(title, margin + 3, yPosition + 5.5);

      yPosition += sectionTitleHeight + 5;

      // Section content
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 80, 100); // Dark slate

      content.forEach(([label, value]) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
          addWatermark();
        }

        // Label in emerald bold
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(16, 185, 129); // Emerald for labels
        const labelText = label;
        pdf.text(labelText, margin, yPosition);

        // Value in normal slate
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 80, 100);
        const valueText = value && value.trim() ? value : "Not provided";
        const lines = pdf.splitTextToSize(valueText, contentWidth - 55);
        
        lines.forEach((line: string, index: number) => {
          pdf.text(line, margin + 55, yPosition + index * 4);
        });

        yPosition += Math.max(4, lines.length * 4) + 2;
      });

      yPosition += 4;
    };

    // Add Biodata Information Header
    const biodataInfoContent: Array<[string, string]> = [
      ["Biodata ID", String(biodata?.biodataNumber || "Not provided")],
      ["Created Date", biodata?.createdAt ? new Date(String(biodata.createdAt)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Not provided"],
    ];
    addSection("Biodata Information", biodataInfoContent);

    // Add Profile Section
    const profileContent: Array<[string, string]> = [
      ["Full Name", String(biodata?.name || "Not provided")],
      ["Gender", biodata?.gender ? String(biodata.gender).charAt(0).toUpperCase() + String(biodata.gender).slice(1) : "Not provided"],
      ["Age", biodata?.age ? `${biodata.age} years` : "Not provided"],
      ["Phone Number", String(biodata?.phone || "Not provided")],
    ];
    addSection("Profile Information", profileContent);

    // Add Personal Information
    const personal = biodata?.personal as Record<string, unknown> | undefined;
    const personalInfo: Array<[string, string]> = [
      ["Height", String(personal?.height || "Not provided")],
      ["Weight", String(personal?.weight || "Not provided")],
      ["Skin Color", String(personal?.skinColor || "Not provided")],
      ["Blood Group", String(personal?.bloodGroup || "Not provided")],
      ["Marital Status", String(personal?.maritalStatus || "Not provided")],
      ["Dress Style", String(personal?.dress || "Not provided")],
      ["Health Issues", String(personal?.healthIssues || "Not provided")],
      ["Special Skills", String(personal?.specialSkills || "Not provided")],
    ];
    addSection("Personal Information", personalInfo);

    // Add Religious Practices
    const religious = biodata?.religious as Record<string, unknown> | undefined;
    const religiousInfo: Array<[string, string]> = [
      ["Prayer Frequency", String(religious?.prayer || "Not provided")],
      ["Mahram", formatBoolean(religious?.mahram as boolean | string | undefined)],
      ["Quran Recitation", formatBoolean(religious?.quran as boolean | string | undefined)],
      ["Fiqh Knowledge", String(religious?.fiqh || "Not provided")],
      ["Entertainment View", String(religious?.entertainment || "Not provided")],
    ];
    addSection("Religious Practices", religiousInfo);

    // Add Hobbies & Interests
    const hobbies = biodata?.hobbies as Record<string, unknown> | undefined;
    const hobbiesInfo: Array<[string, string]> = [];
    const hobbiesList = hobbies?.hobbies as unknown[] | undefined;
    hobbiesInfo.push([
      "Hobbies",
      Array.isArray(hobbiesList) && hobbiesList.length > 0
        ? hobbiesList.map(String).join(", ")
        : "Not provided",
    ]);
    const booksList = hobbies?.books as unknown[] | undefined;
    hobbiesInfo.push([
      "Books",
      Array.isArray(booksList) && booksList.length > 0
        ? booksList.map(String).join(", ")
        : "Not provided",
    ]);
    const qualitiesList = hobbies?.qualities as unknown[] | undefined;
    hobbiesInfo.push([
      "Qualities",
      Array.isArray(qualitiesList) && qualitiesList.length > 0
        ? qualitiesList.map(String).join(", ")
        : "Not provided",
    ]);
    addSection("Interests & Hobbies", hobbiesInfo);

    // Add Address
    const address = biodata?.address as Record<string, unknown> | undefined;
    const present = address?.present as Record<string, unknown> | undefined;
    const permanent = address?.permanent as Record<string, unknown> | undefined;
    const addressInfo: Array<[string, string]> = [
      ["Country", String(address?.country || "Not provided")],
      ["Grew Up At", String(address?.grewUpAt || "Not provided")],
      ["Present Address", String(present?.address || "Not provided")],
      ["Permanent Address", String(permanent?.address || "Not provided")],
    ];
    addSection("Address Information", addressInfo);

    // Add Education
    const education = biodata?.education as Record<string, unknown> | undefined;
    const eduInfo: Array<[string, string]> = [
      ["Education Method", String(education?.method || "Not provided")],
    ];
    const eduHistory = education?.history as unknown[] | undefined;
    if (Array.isArray(eduHistory) && eduHistory.length > 0) {
      const eduHistoryStr = eduHistory
        .map((e: unknown) => {
          const edu = e as Record<string, unknown>;
          return `${edu.level || "N/A"} from ${edu.institution || "N/A"} (${edu.year || "N/A"})`;
        })
        .join(" | ");
      eduInfo.push(["Education History", eduHistoryStr]);
    } else {
      eduInfo.push(["Education History", "Not provided"]);
    }
    addSection("Education", eduInfo);

    // Add Family Information
    const family = biodata?.family as Record<string, unknown> | undefined;
    const familyInfo: Array<[string, string]> = [
      ["Father Alive", formatBoolean(family?.fatherAlive as boolean | string | undefined)],
      ["Mother Alive", formatBoolean(family?.motherAlive as boolean | string | undefined)],
      ["Father Profession", String(family?.fatherProfession || "Not provided")],
      ["Mother Profession", String(family?.motherProfession || "Not provided")],
      ["Number of Brothers", family?.brothers ? String(family.brothers) : "Not provided"],
      ["Number of Sisters", family?.sisters ? String(family.sisters) : "Not provided"],
      ["Financial Status", String(family?.financialStatus || "Not provided")],
      ["Religious Practice", String(family?.religiousPractice || "Not provided")],
    ];
    addSection("Family Information", familyInfo);

    // Add Occupation
    const occupation = biodata?.occupation as Record<string, unknown> | undefined;
    const occupationInfo: Array<[string, string]> = [
      ["Current Job", String(occupation?.currentJob || "Not provided")],
      ["Description", String(occupation?.description || "Not provided")],
      ["Monthly Income", String(occupation?.income || "Not provided")],
    ];
    addSection("Occupation", occupationInfo);

    // Add Marriage Expectations
    const marriage = biodata?.marriage as Record<string, unknown> | undefined;
    const marriageInfo: Array<[string, string]> = [
      ["Guardians Agree", formatBoolean(marriage?.guardiansAgree as boolean | string | undefined)],
      ["Study Continuation", String(marriage?.studyContinuation || "Not provided")],
      ["Job Status", String(marriage?.jobStatus || "Not provided")],
      ["Reason for Marriage", String(marriage?.reason || "Not provided")],
    ];
    addSection("Marriage Expectations", marriageInfo);

    // Add Preferences
    const preferences = biodata?.preferences as Record<string, unknown> | undefined;
    const preferencesInfo: Array<[string, string]> = [
      ["Preferred Age Range", String(preferences?.ageRange || "Not provided")],
      ["Preferred Complexion", String(preferences?.complexion || "Not provided")],
      ["Preferred Height", String(preferences?.height || "Not provided")],
      ["Preferred Education", String(preferences?.education || "Not provided")],
      ["Preferred Location", String(preferences?.location || "Not provided")],
      ["Preferred Profession", String(preferences?.profession || "Not provided")],
      ["Preferred Financial Condition", String(preferences?.financialCondition || "Not provided")],
    ];
    const qualities = preferences?.qualities as unknown[] | undefined;
    if (Array.isArray(qualities) && qualities.length > 0) {
      preferencesInfo.push(["Desired Qualities", qualities.map(String).join(", ")]);
    } else {
      preferencesInfo.push(["Desired Qualities", "Not provided"]);
    }
    addSection("Preferences", preferencesInfo);

    // Add Contact Information
    const contact = biodata?.contact as Record<string, unknown> | undefined;
    const contactInfo: Array<[string, string]> = [
      ["Guardian Phone", String(contact?.guardianPhone || "Not provided")],
      ["Relation", String(contact?.relation || "Not provided")],
    ];
    addSection("Contact Information", contactInfo);

    // Add footer
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
    }
    pdf.setTextColor(150, 150, 150);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.text(
      "This biodata was generated by NikahLife. All information is confidential and private.",
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );

    // Save PDF
    pdf.save(`biodata_${biodata?.biodataNumber || "export"}.pdf`);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
