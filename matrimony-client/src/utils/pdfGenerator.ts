import { IBiodata } from "@/types/bioData";

/**
 * Format boolean values to readable strings
 */
const formatBoolean = (value: any): string => {
  if (value === true || value === "yes" || value === "Yes") return "Yes";
  if (value === false || value === "no" || value === "No") return "No";
  return "Not provided";
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
  } catch (error) {
    // Fallback to gradient SVG if logo fails to load
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 606 171'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='606' height='171' fill='url(%23grad)'/%3E%3Ctext x='303' y='95' font-size='80' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial, sans-serif'%3ENL%3C/text%3E%3C/svg%3E";
  }
};

/**
 * Download biodata as PDF
 */
export const downloadBiodataAsPDF = async (biodata: any): Promise<void> => {
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
    } catch (error) {
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
        
        lines.forEach((line, index) => {
          pdf.text(line, margin + 55, yPosition + index * 4);
        });

        yPosition += Math.max(4, lines.length * 4) + 2;
      });

      yPosition += 4;
    };

    // Add Biodata Information Header
    const biodataInfoContent: Array<[string, string]> = [
      ["Biodata ID", biodata?.biodataNumber || "Not provided"],
      ["Created Date", biodata?.createdAt ? new Date(biodata.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Not provided"],
    ];
    addSection("Biodata Information", biodataInfoContent);

    // Add Profile Section
    const profileContent: Array<[string, string]> = [
      ["Full Name", biodata?.name || "Not provided"],
      ["Gender", biodata?.gender ? biodata.gender.charAt(0).toUpperCase() + biodata.gender.slice(1) : "Not provided"],
      ["Age", biodata?.age ? `${biodata.age} years` : "Not provided"],
      ["Phone Number", biodata?.phone || "Not provided"],
    ];
    addSection("Profile Information", profileContent);

    // Add Personal Information
    const personalInfo: Array<[string, string]> = [
      ["Height", biodata?.personal?.height || "Not provided"],
      ["Weight", biodata?.personal?.weight || "Not provided"],
      ["Skin Color", biodata?.personal?.skinColor || "Not provided"],
      ["Blood Group", biodata?.personal?.bloodGroup || "Not provided"],
      ["Marital Status", biodata?.personal?.maritalStatus || "Not provided"],
      ["Dress Style", biodata?.personal?.dress || "Not provided"],
      ["Health Issues", biodata?.personal?.healthIssues || "Not provided"],
      ["Special Skills", biodata?.personal?.specialSkills || "Not provided"],
    ];
    addSection("Personal Information", personalInfo);

    // Add Religious Practices
    const religiousInfo: Array<[string, string]> = [
      ["Prayer Frequency", biodata?.religious?.prayer || "Not provided"],
      ["Mahram", formatBoolean(biodata?.religious?.mahram)],
      ["Quran Recitation", formatBoolean(biodata?.religious?.quran)],
      ["Fiqh Knowledge", biodata?.religious?.fiqh || "Not provided"],
      ["Entertainment View", biodata?.religious?.entertainment || "Not provided"],
    ];
    addSection("Religious Practices", religiousInfo);

    // Add Hobbies & Interests
    const hobbiesInfo: Array<[string, string]> = [];
    hobbiesInfo.push([
      "Hobbies",
      Array.isArray(biodata?.hobbies?.hobbies) && biodata.hobbies.hobbies.length > 0
        ? biodata.hobbies.hobbies.join(", ")
        : "Not provided",
    ]);
    hobbiesInfo.push([
      "Books",
      Array.isArray(biodata?.hobbies?.books) && biodata.hobbies.books.length > 0
        ? biodata.hobbies.books.join(", ")
        : "Not provided",
    ]);
    hobbiesInfo.push([
      "Qualities",
      Array.isArray(biodata?.hobbies?.qualities) && biodata.hobbies.qualities.length > 0
        ? biodata.hobbies.qualities.join(", ")
        : "Not provided",
    ]);
    addSection("Interests & Hobbies", hobbiesInfo);

    // Add Address
    const addressInfo: Array<[string, string]> = [
      ["Country", biodata?.address?.country || "Not provided"],
      ["Grew Up At", biodata?.address?.grewUpAt || "Not provided"],
      ["Present Address", biodata?.address?.present?.address || "Not provided"],
      ["Permanent Address", biodata?.address?.permanent?.address || "Not provided"],
    ];
    addSection("Address Information", addressInfo);

    // Add Education
    const eduInfo: Array<[string, string]> = [
      ["Education Method", biodata?.education?.method || "Not provided"],
    ];
    if (Array.isArray(biodata?.education?.history) && biodata.education.history.length > 0) {
      const eduHistory = biodata.education.history
        .map((e: any) => `${e.level || "N/A"} from ${e.institution || "N/A"} (${e.year || "N/A"})`)
        .join(" | ");
      eduInfo.push(["Education History", eduHistory]);
    } else {
      eduInfo.push(["Education History", "Not provided"]);
    }
    addSection("Education", eduInfo);

    // Add Family Information
    const familyInfo: Array<[string, string]> = [
      ["Father Alive", formatBoolean(biodata?.family?.fatherAlive)],
      ["Mother Alive", formatBoolean(biodata?.family?.motherAlive)],
      ["Father Profession", biodata?.family?.fatherProfession || "Not provided"],
      ["Mother Profession", biodata?.family?.motherProfession || "Not provided"],
      ["Number of Brothers", biodata?.family?.brothers ? String(biodata.family.brothers) : "Not provided"],
      ["Number of Sisters", biodata?.family?.sisters ? String(biodata.family.sisters) : "Not provided"],
      ["Financial Status", biodata?.family?.financialStatus || "Not provided"],
      ["Religious Practice", biodata?.family?.religiousPractice || "Not provided"],
    ];
    addSection("Family Information", familyInfo);

    // Add Occupation
    const occupationInfo: Array<[string, string]> = [
      ["Current Job", biodata?.occupation?.currentJob || "Not provided"],
      ["Description", biodata?.occupation?.description || "Not provided"],
      ["Monthly Income", biodata?.occupation?.income || "Not provided"],
    ];
    addSection("Occupation", occupationInfo);

    // Add Marriage Expectations
    const marriageInfo: Array<[string, string]> = [
      ["Guardians Agree", formatBoolean(biodata?.marriage?.guardiansAgree)],
      ["Study Continuation", biodata?.marriage?.studyContinuation || "Not provided"],
      ["Job Status", biodata?.marriage?.jobStatus || "Not provided"],
      ["Reason for Marriage", biodata?.marriage?.reason || "Not provided"],
    ];
    addSection("Marriage Expectations", marriageInfo);

    // Add Preferences
    const preferencesInfo: Array<[string, string]> = [
      ["Preferred Age Range", biodata?.preferences?.ageRange || "Not provided"],
      ["Preferred Complexion", biodata?.preferences?.complexion || "Not provided"],
      ["Preferred Height", biodata?.preferences?.height || "Not provided"],
      ["Preferred Education", biodata?.preferences?.education || "Not provided"],
      ["Preferred Location", biodata?.preferences?.location || "Not provided"],
      ["Preferred Profession", biodata?.preferences?.profession || "Not provided"],
      ["Preferred Financial Condition", biodata?.preferences?.financialCondition || "Not provided"],
    ];
    if (Array.isArray(biodata?.preferences?.qualities) && biodata.preferences.qualities.length > 0) {
      preferencesInfo.push(["Desired Qualities", biodata.preferences.qualities.join(", ")]);
    } else {
      preferencesInfo.push(["Desired Qualities", "Not provided"]);
    }
    addSection("Preferences", preferencesInfo);

    // Add Contact Information
    const contactInfo: Array<[string, string]> = [
      ["Guardian Phone", biodata?.contact?.guardianPhone || "Not provided"],
      ["Relation", biodata?.contact?.relation || "Not provided"],
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
