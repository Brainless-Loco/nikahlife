// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Plus, Trash2 } from "lucide-react";
// import {
//   EducationHistory,
//   EducationInfo,
//   StepProps,
// } from "@/types/biodataForm";
// import { useLanguage } from "@/hooks/use-language";
// import { biodataTranslation } from "@/dictionary/biodata";
// import universities from "../../../../../../public/universities.json";

// export default function EducationStep({ data, updateData }: StepProps) {
//   const [education, setEducation] = useState<EducationInfo>({
//     method: "",
//     history: [
//       {
//         level: "",
//         year: "",
//         group: "",
//         result: "",
//         subject: "",
//         institution: "",
//       },
//     ],
//     other: [],
//     ...data.education,
//   });
//   const { language } = useLanguage();
//   const t = biodataTranslation[language];
//   useEffect(() => {
//     updateData({ education });
//   }, [education, updateData]);

//   const addEducationHistory = () => {
//     setEducation((prev) => ({
//       ...prev,
//       history: [
//         ...prev.history,
//         {
//           level: "",
//           year: "",
//           group: "",
//           result: "",
//           subject: "",
//           institution: "",
//         },
//       ],
//     }));
//   };

//   const removeEducationHistory = (index: number) => {
//     setEducation((prev) => ({
//       ...prev,
//       history: prev.history.filter((_, i) => i !== index),
//     }));
//   };

//   const updateEducationHistory = (
//     index: number,
//     field: keyof EducationHistory,
//     value: string
//   ) => {
//     setEducation((prev) => ({
//       ...prev,
//       history: prev.history.map((item, i) =>
//         i === index ? { ...item, [field]: value } : item
//       ),
//     }));
//   };

//   const addOtherEducation = () => {
//     setEducation((prev) => ({
//       ...prev,
//       other: [...prev.other, ""],
//     }));
//   };

//   const removeOtherEducation = (index: number) => {
//     setEducation((prev) => ({
//       ...prev,
//       other: prev.other.filter((_, i) => i !== index),
//     }));
//   };

//   const updateOtherEducation = (index: number, value: string) => {
//     setEducation((prev) => ({
//       ...prev,
//       other: prev.other.map((item, i) => (i === index ? value : item)),
//     }));
//   };


//   return (
//     <div className="space-y-6">
//       <div className="space-y-3">
//         <Label htmlFor="method">
//           {t.educationalQualification?.educationMethod} *
//         </Label>
//         <Select
//           value={education.method}
//           onValueChange={(value) =>
//             setEducation((prev) => ({ ...prev, method: value }))
//           }
//         >
//           <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
//             <SelectValue
//               placeholder={
//                 t.educationalQualification?.educationMethodPlaceholder
//               }
//             />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="General">
//               {t.educationalQualification?.general}
//             </SelectItem>
//             <SelectItem value="Madrasa">
//               {t.educationalQualification?.madrasha}
//             </SelectItem>
//             <SelectItem value="Technical">
//               {t.educationalQualification?.technical}
//             </SelectItem>
//             <SelectItem value="Mixed">
//               {t.educationalQualification?.mixed}
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
//             {t.educationalQualification?.educationHistory}
//           </h3>
//           <Button
//             type="button"
//             onClick={addEducationHistory}
//             size="sm"
//             className="bg-emerald-600 hover:bg-emerald-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             {t.educationalQualification?.addHistoryBtn}
//           </Button>
//         </div>

//         <div className="space-y-4">
//           {education.history.map((edu, index) => (
//             <Card
//               key={index}
//               className="border-emerald-200 dark:border-emerald-700"
//             >
//               <CardContent className="p-4">
//                 <div className="flex justify-between items-start mb-4">
//                   <h4 className="font-medium">
//                     {t.educationalQualification?.education} {index + 1}
//                   </h4>
//                   {education.history.length > 1 && (
//                     <Button
//                       type="button"
//                       onClick={() => removeEducationHistory(index)}
//                       size="sm"
//                       variant="destructive"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-3">
//                     <Label>{t.educationalQualification?.level} *</Label>
//                     <Select
//                       value={edu.level}
//                       onValueChange={(value) =>
//                         updateEducationHistory(index, "level", value)
//                       }
//                     >
//                       <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
//                         <SelectValue
//                           placeholder={t.educationalQualification?.selectLevel}
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="SSC">
//                           {t.educationalQualification?.ssc}
//                         </SelectItem>
//                         <SelectItem value="HSC">
//                           {t.educationalQualification?.hsc}
//                         </SelectItem>
//                         <SelectItem value="Graduation">
//                           {t.educationalQualification?.graduation}
//                         </SelectItem>
//                         <SelectItem value="Masters">
//                           {t.educationalQualification?.masters}
//                         </SelectItem>
//                         <SelectItem value="PhD">
//                           {t.educationalQualification?.phd}
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-3">
//                     <Label>{t.educationalQualification?.passingYear} *</Label>
//                     <Input
//                       type="number"
//                       value={edu.year}
//                       onChange={(e) =>
//                         updateEducationHistory(index, "year", e.target.value)
//                       }
//                       placeholder="e.g., 2020"
//                       className="border-emerald-200 dark:border-emerald-700"
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     <Label>{t.educationalQualification?.group}</Label>
//                     <Input
//                       value={edu.group || edu.subject}
//                       onChange={(e) =>
//                         updateEducationHistory(
//                           index,
//                           edu.level === "Graduation" ||
//                             edu.level === "Masters" ||
//                             edu.level === "PhD"
//                             ? "subject"
//                             : "group",
//                           e.target.value
//                         )
//                       }
//                       placeholder={
//                         edu.level === t.educationalQualification?.graduation ||
//                         edu.level === t.educationalQualification?.masters ||
//                         edu.level === t.educationalQualification?.phd
//                           ? t.educationalQualification?.subject
//                           : t.educationalQualification?.group
//                       }
//                       className="border-emerald-200 dark:border-emerald-700"
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     <Label>{t.educationalQualification?.result}</Label>
//                     <Input
//                       value={edu.result}
//                       onChange={(e) =>
//                         updateEducationHistory(index, "result", e.target.value)
//                       }
//                       placeholder="e.g., A, A+, 3.5, etc."
//                       className="border-emerald-200 dark:border-emerald-700"
//                     />
//                   </div>

//                   {(edu.level === "Graduation" ||
//                     edu.level === "Masters" ||
//                     edu.level === "PhD") && (
//                     <div className="md:col-span-2 space-y-3">
//                       <Label>{t.educationalQualification?.institution}</Label>
//                       <Input
//                         value={edu.institution}
//                         onChange={(e) =>
//                           updateEducationHistory(
//                             index,
//                             "institution",
//                             e.target.value
//                           )
//                         }
//                         placeholder={t.educationalQualification?.instituteName}
//                         className="border-emerald-200 dark:border-emerald-700"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
//             {t.educationalQualification?.othersEducation}
//           </h3>
//           <Button
//             type="button"
//             onClick={addOtherEducation}
//             size="sm"
//             className="bg-yellow-600 hover:bg-yellow-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             {t.educationalQualification?.otherBtn}
//           </Button>
//         </div>

//         <div className="space-y-2">
//           {education.other.map((other, index) => (
//             <div key={index} className="flex gap-2">
//               <Input
//                 value={other}
//                 onChange={(e) => updateOtherEducation(index, e.target.value)}
//                 placeholder={
//                   t.educationalQualification?.othersEducationPlaceholder
//                 }
//                 className="border-emerald-200 dark:border-emerald-700"
//               />
//               <Button
//                 type="button"
//                 onClick={() => removeOtherEducation(index)}
//                 size="sm"
//                 variant="destructive"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  EducationHistory,
  EducationInfo,
  StepProps,
} from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";
import universities from "../../../../../../public/universities.json";
import UniversitySelector from "./UniversitySelector"; // Import the new component

export default function EducationStep({ data, updateData }: StepProps) {
  const [education, setEducation] = useState<EducationInfo>({
    method: "",
    history: [
      {
        level: "",
        year: "",
        group: "",
        result: "",
        subject: "",
        institution: "",
        institution_bangla: "",
      },
    ],
    other: [],
    ...data.education,
  });
  const { language } = useLanguage();
  const t = biodataTranslation[language];
  
  useEffect(() => {
    updateData({ education });
  }, [education, updateData]);

  const addEducationHistory = () => {
    setEducation((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        {
          level: "",
          year: "",
          group: "",
          result: "",
          subject: "",
          institution: "",
          institution_bangla: "",
        },
      ],
    }));
  };

  const removeEducationHistory = (index: number) => {
    setEducation((prev) => ({
      ...prev,
      history: prev.history.filter((_, i) => i !== index),
    }));
  };

  const updateEducationHistory = (
    index: number,
    field: keyof EducationHistory,
    value: string
  ) => {
    setEducation((prev) => ({
      ...prev,
      history: prev.history.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // New function to handle university selection
  const updateUniversitySelection = (
    index: number,
    university: { name_english: string; name_bangla: string }
  ) => {
    setEducation((prev) => ({
      ...prev,
      history: prev.history.map((item, i) =>
        i === index
          ? {
              ...item,
              institution: university.name_english,
              institution_bangla: university.name_bangla,
            }
          : item
      ),
    }));
  };

  const addOtherEducation = () => {
    setEducation((prev) => ({
      ...prev,
      other: [...prev.other, ""],
    }));
  };

  const removeOtherEducation = (index: number) => {
    setEducation((prev) => ({
      ...prev,
      other: prev.other.filter((_, i) => i !== index),
    }));
  };

  const updateOtherEducation = (index: number, value: string) => {
    setEducation((prev) => ({
      ...prev,
      other: prev.other.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="method">
          {t.educationalQualification?.educationMethod} *
        </Label>
        <Select
          value={education.method}
          onValueChange={(value) =>
            setEducation((prev) => ({ ...prev, method: value }))
          }
        >
          <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
            <SelectValue
              placeholder={
                t.educationalQualification?.educationMethodPlaceholder
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General">
              {t.educationalQualification?.general}
            </SelectItem>
            <SelectItem value="Madrasa">
              {t.educationalQualification?.madrasha}
            </SelectItem>
            <SelectItem value="Technical">
              {t.educationalQualification?.technical}
            </SelectItem>
            <SelectItem value="Mixed">
              {t.educationalQualification?.mixed}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
            {t.educationalQualification?.educationHistory}
          </h3>
          <Button
            type="button"
            onClick={addEducationHistory}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.educationalQualification?.addHistoryBtn}
          </Button>
        </div>

        <div className="space-y-4">
          {education.history.map((edu, index) => (
            <Card
              key={index}
              className="border-emerald-200 dark:border-emerald-700"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">
                    {t.educationalQualification?.education} {index + 1}
                  </h4>
                  {education.history.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEducationHistory(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>{t.educationalQualification?.level} *</Label>
                    <Select
                      value={edu.level}
                      onValueChange={(value) =>
                        updateEducationHistory(index, "level", value)
                      }
                    >
                      <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
                        <SelectValue
                          placeholder={t.educationalQualification?.selectLevel}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SSC">
                          {t.educationalQualification?.ssc}
                        </SelectItem>
                        <SelectItem value="HSC">
                          {t.educationalQualification?.hsc}
                        </SelectItem>
                        <SelectItem value="Graduation">
                          {t.educationalQualification?.graduation}
                        </SelectItem>
                        <SelectItem value="Masters">
                          {t.educationalQualification?.masters}
                        </SelectItem>
                        <SelectItem value="PhD">
                          {t.educationalQualification?.phd}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>{t.educationalQualification?.passingYear} *</Label>
                    <Input
                      type="number"
                      value={edu.year}
                      onChange={(e) =>
                        updateEducationHistory(index, "year", e.target.value)
                      }
                      placeholder="e.g., 2020"
                      className="border-emerald-200 dark:border-emerald-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{t.educationalQualification?.group}</Label>
                    <Input
                      value={edu.group || edu.subject}
                      onChange={(e) =>
                        updateEducationHistory(
                          index,
                          edu.level === "Graduation" ||
                            edu.level === "Masters" ||
                            edu.level === "PhD"
                            ? "subject"
                            : "group",
                          e.target.value
                        )
                      }
                      placeholder={
                        edu.level === t.educationalQualification?.graduation ||
                        edu.level === t.educationalQualification?.masters ||
                        edu.level === t.educationalQualification?.phd
                          ? t.educationalQualification?.subject
                          : t.educationalQualification?.group
                      }
                      className="border-emerald-200 dark:border-emerald-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{t.educationalQualification?.result}</Label>
                    <Input
                      value={edu.result}
                      onChange={(e) =>
                        updateEducationHistory(index, "result", e.target.value)
                      }
                      placeholder="e.g., A, A+, 3.5, etc."
                      className="border-emerald-200 dark:border-emerald-700"
                    />
                  </div>

                  {/* Updated Institution Field with University Selector */}
                  {(edu.level === "Graduation" ||
                    edu.level === "Masters" ||
                    edu.level === "PhD") && (
                    <div className="md:col-span-2 space-y-3">
                      <Label>{t.educationalQualification?.institution}</Label>
                      <UniversitySelector
                        universities={universities}
                        value={
                          language === "bn" 
                            ? edu.institution_bangla || edu.institution 
                            : edu.institution
                        }
                        onChange={(university) =>
                          updateUniversitySelection(index, university)
                        }
                        placeholder={t.educationalQualification?.instituteName}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
            {t.educationalQualification?.othersEducation}
          </h3>
          <Button
            type="button"
            onClick={addOtherEducation}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.educationalQualification?.otherBtn}
          </Button>
        </div>

        <div className="space-y-2">
          {education.other.map((other, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={other}
                onChange={(e) => updateOtherEducation(index, e.target.value)}
                placeholder={
                  t.educationalQualification?.othersEducationPlaceholder
                }
                className="border-emerald-200 dark:border-emerald-700"
              />
              <Button
                type="button"
                onClick={() => removeOtherEducation(index)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}