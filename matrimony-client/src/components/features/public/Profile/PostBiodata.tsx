"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { BiodataFormData } from "@/types/biodataForm";
import PersonalInfoStep from "../Biodata/BiodataSteps/personalInformation";
import AddressStep from "../Biodata/BiodataSteps/addressStep";
import EducationStep from "../Biodata/BiodataSteps/EducationSteps";
import FamilyStep from "../Biodata/BiodataSteps/familyInformationSteps";
import OccupationStep from "../Biodata/BiodataSteps/occupationStep";
import MarriageStep from "../Biodata/BiodataSteps/marriageStep";
import PreferenceStep from "../Biodata/BiodataSteps/preferenceStep";
import PledgeStep from "../Biodata/BiodataSteps/pledgeStep";
import VisibilityStep from "../Biodata/BiodataSteps/visibilityStep";
import { useAuth } from "@/app/(auth)/context/auth-context";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/getToken";
import ContactInfo from "../Biodata/BiodataSteps/contactInfo";
import { setCookie } from "@/utils/setCookie";

const STORAGE_KEY = "biodata-form-data";
const STEP_KEY = "biodata-current-step";

const steps = [
  { id: 1, title: "Personal Info", component: PersonalInfoStep },
  { id: 2, title: "Address", component: AddressStep },
  { id: 3, title: "Education", component: EducationStep },
  { id: 4, title: "Family", component: FamilyStep },
  { id: 5, title: "Occupation", component: OccupationStep },
  { id: 6, title: "Marriage", component: MarriageStep },
  { id: 7, title: "Preference", component: PreferenceStep },
  { id: 8, title: "Contact Info", component: ContactInfo },
  { id: 9, title: "Visibility", component: VisibilityStep },
  { id: 10, title: "Pledge", component: PledgeStep },
];

// Validation function for each step
const validateStep = (stepId: number, formData: BiodataFormData): string[] => {
  const errors: string[] = [];

  switch (stepId) {
    case 1: // Personal Info
      if (!formData.personal?.name?.trim()) {
        errors.push("Name is required");
      }
      if (!formData.personal?.gender?.trim()) {
        errors.push("Gender is required");
      }
      if (!formData.personal?.age?.toString().trim()) {
        errors.push("Age is required");
      }
      if (!formData.personal?.fiqh?.trim()) {
        errors.push("Fiqh is required");
      }
      break;

    case 2: // Address
      if (!formData.address?.permanent?.division?.trim()) {
        errors.push("Permanent Division is required");
      }
      if (!formData.address?.permanent?.district?.trim()) {
        errors.push("Permanent District is required");
      }
      if (!formData.address?.present?.division?.trim()) {
        errors.push("Present Division is required");
      }
      if (!formData.address?.present?.district?.trim()) {
        errors.push("Present District is required");
      }
      break;

    case 3: // Education
      if (!formData.education?.method?.trim()) {
        errors.push("Education Method is required");
      }
      if (!formData.education?.history || formData.education.history.length === 0) {
        errors.push("At least one education history is required");
      } else {
        formData.education.history.forEach((edu, index) => {
          if (!edu.level?.trim()) {
            errors.push(`Education ${index + 1}: Level is required`);
          }
          if (!edu.year?.toString().trim()) {
            errors.push(`Education ${index + 1}: Passing year is required`);
          }
        });
      }
      break;

    case 4: // Family
      // Family info is mostly optional
      break;

    case 5: // Occupation
      if (!formData.occupation?.current?.trim()) {
        errors.push("Occupation is required");
      }
      if (!formData.occupation?.description?.trim()) {
        errors.push("Profession description is required");
      }
      break;

    case 6: // Marriage
      if (formData.marriage?.guardiansAgree === undefined || formData.marriage?.guardiansAgree === null) {
        errors.push("Guardians agreement is required");
      }
      break;

    case 7: // Preference
      if (!formData.preference?.ageRange?.trim()) {
        errors.push("Preferred age range is required");
      }
      break;

    case 8: // Contact Info
      if (!formData.contactInfo?.guardianPhone?.trim()) {
        errors.push("Phone number is required");
      } else if (!/^01[3-9]\d{8}$/.test(formData.contactInfo.guardianPhone)) {
        errors.push("Phone number must be valid (e.g., 01712345678)");
      }
      break;

    case 9: // Visibility
      // Visibility is mostly optional
      break;

    case 10: // Pledge
      if (!formData.pledge?.parentsAware) {
        errors.push("You must confirm that your parents/guardians are aware");
      }
      if (!formData.pledge?.informationAccurate) {
        errors.push("You must confirm that the information is accurate");
      }
      if (!formData.pledge?.nikahResponsibility) {
        errors.push("You must acknowledge the responsibility");
      }
      break;
  }

  return errors;
};

export default function BiodataForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BiodataFormData>({});
  const [mounted, setMounted] = useState(false);
  const [showStepDropdown, setShowStepDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const token = getCookie("token");

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }

    if (savedStep) {
      setCurrentStep(safeParseInt(savedStep));
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    if (mounted && Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, mounted]);

  // Save current step to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STEP_KEY, currentStep.toString());
    }
  }, [currentStep, mounted]);

  const updateFormData = useCallback((stepData: Partial<BiodataFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
    setShowStepDropdown(false);
  };

  const nextStep = () => {
    // Validate current step before moving to next
    const errors = validateStep(currentStep, formData);
    
    if (errors.length > 0) {
      // Show error toast with all errors
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate all steps before final submission
      const allErrors: string[] = [];
      for (let i = 1; i <= steps.length; i++) {
        const stepErrors = validateStep(i, formData);
        allErrors.push(...stepErrors);
      }

      if (allErrors.length > 0) {
        allErrors.forEach((error) => {
          toast.error(error);
        });
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const payload = {
        ...formData,
        name: user?.name || formData.personal?.name || "",
        gender:
          formData.personal?.gender?.toLowerCase() === "male"
            ? "male"
            : "female",
        age: Number(formData.personal?.age),
        isVisible: formData.isVisible !== false,
        personal: {
          ...formData.personal,
          maintainMahram: formData.personal?.maintainMahram,
          quranReading: formData.personal?.quranReading,
          entertainment: formData.personal?.entertainment,
          healthIssues: formData.personal?.healthIssues,
          favoriteBooks: Array.isArray(formData.personal?.favoriteBooks)
            ? formData.personal.favoriteBooks
            : formData.personal?.favoriteBooks?.split(",") || [],
          hobbies: Array.isArray(formData.personal?.hobbies)
            ? formData.personal.hobbies
            : formData.personal?.hobbies?.split(",") || [],
        },
        education: {
          ...formData.education,
          history: formData.education?.history.map((h) => ({
            ...h,
            year: Number(h.year),
          })),
        },
        marriage: {
          ...formData.marriage,
          studyContinue: formData.marriage?.studyContinue,
        },
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setCookie("hasBiodata", "true", 7);
      localStorage.removeItem("biodata-form-data");
      localStorage.removeItem("biodata-current-step");
      localStorage.removeItem("biodata-form-data-backup");
      toast.success("Profile posted successfully!");
      router.push("/");
    } catch (error: unknown) {
      console.error("Profile post failed:", error);

      let errorMessage = "Failed to post profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / steps.length) * 100;

  const safeParseInt = (value: string): number => {
    const parsed = Number.parseInt(value);
    return isNaN(parsed) ? 1 : parsed;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-yellow-50 dark:from-emerald-950 dark:to-yellow-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-200">
            Biodata Form
          </h1>
        </div>

        {/* Progress */}
        <Card className="mb-6 border-emerald-200 dark:border-emerald-700">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-emerald-100 dark:bg-emerald-900 mb-4"
            />

            {/* Desktop Step Navigation */}
            <div className="hidden lg:flex justify-between gap-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`text-xs px-2 py-2 rounded transition-all duration-200 flex-1 min-w-0 cursor-pointer ${
                    step.id === currentStep
                      ? "bg-emerald-500 text-white shadow-md"
                      : step.id < currentStep
                      ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-600"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="truncate">{step.title}</div>
                </button>
              ))}
            </div>

            {/* Mobile/Tablet Step Navigation */}
            <div className="lg:hidden">
              {/* Current Step Indicator */}
              <button
                onClick={() => setShowStepDropdown(!showStepDropdown)}
                className="w-full flex items-center justify-between bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-md cursor-pointer"
              >
                <span className="font-medium">
                  {steps[currentStep - 1].title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showStepDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showStepDropdown && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        step.id === currentStep
                          ? "bg-emerald-500 text-white"
                          : step.id < currentStep
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          Step {step.id}: {step.title}
                        </span>
                        {step.id < currentStep && (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step Pills for Medium Screens */}
              <div className="hidden md:flex lg:hidden flex-wrap gap-2 mt-4">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`text-xs px-3 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                      step.id === currentStep
                        ? "bg-emerald-500 text-white shadow-md"
                        : step.id < currentStep
                        ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-600"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {step.id}. {step.title}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Step */}
        <Card className="border-emerald-200 dark:border-emerald-700">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
            <CardTitle className="text-emerald-800 dark:text-emerald-200">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <CurrentStepComponent data={formData} updateData={updateFormData} />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-emerald-200 dark:border-emerald-700 bg-transparent flex-1 md:flex-none"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none 
    ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loading ? (
                <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
              ) : (
                "Submit Form"
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
