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
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
// import { FamilyInfo, StepProps } from "@/types/biodataForm";
// import { useLanguage } from "@/hooks/use-language";
// import { biodataTranslation } from "@/dictionary/biodata";

// export default function FamilyStep({ data, updateData }: StepProps) {
//   const [family, setFamily] = useState<FamilyInfo>({
//     fatherAlive: true,
//     motherAlive: true,
//     fatherProfession: "",
//     motherProfession: "",
//     brothers: 0,
//     sisters: 0,
//     sistersInfo: [],
//     unclesProfession: [],
//     financialStatus: "",
//     financialDetails: "",
//     religiousPractice: "",
//     ...data.family,
//   });

//   useEffect(() => {
//     updateData({ family });
//   }, [family, updateData]);

//   const handleChange = (
//     field: keyof FamilyInfo,
//     value: string | boolean | number
//   ) => {
//     setFamily((prev) => ({ ...prev, [field]: value }));
//   };

//   const addSisterInfo = () => {
//     setFamily((prev) => ({
//       ...prev,
//       sistersInfo: [...prev.sistersInfo, ""],
//     }));
//   };

//   const removeSisterInfo = (index: number) => {
//     setFamily((prev) => ({
//       ...prev,
//       sistersInfo: prev.sistersInfo.filter((_, i) => i !== index),
//     }));
//   };

//   const updateSisterInfo = (index: number, value: string) => {
//     setFamily((prev) => ({
//       ...prev,
//       sistersInfo: prev.sistersInfo.map((item, i) =>
//         i === index ? value : item
//       ),
//     }));
//   };

//   const addUncleProfession = () => {
//     setFamily((prev) => ({
//       ...prev,
//       unclesProfession: [...prev.unclesProfession, ""],
//     }));
//   };

//   const removeUncleProfession = (index: number) => {
//     setFamily((prev) => ({
//       ...prev,
//       unclesProfession: prev.unclesProfession.filter((_, i) => i !== index),
//     }));
//   };

//   const updateUncleProfession = (index: number, value: string) => {
//     setFamily((prev) => ({
//       ...prev,
//       unclesProfession: prev.unclesProfession.map((item, i) =>
//         i === index ? value : item
//       ),
//     }));
//   };

//   const handleNumberChange = (field: "brothers" | "sisters", value: string) => {
//     const numValue = Number.parseInt(value) || 0;
//     setFamily((prev) => ({ ...prev, [field]: numValue }));
//   };

//   const { language } = useLanguage();
//   const t = biodataTranslation[language];

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="fatherAlive"
//             checked={family.fatherAlive}
//             onCheckedChange={(checked) => handleChange("fatherAlive", checked)}
//           />
//           <Label htmlFor="fatherAlive">
//             {t.familyInformation?.fatherAlive}
//           </Label>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="motherAlive"
//             checked={family.motherAlive}
//             onCheckedChange={(checked) => handleChange("motherAlive", checked)}
//           />
//           <Label htmlFor="motherAlive">
//             {t.familyInformation?.motherAlive}
//           </Label>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-3">
//           <Label htmlFor="fatherProfession">
//             {t.familyInformation?.fatherProfession}
//           </Label>
//           <Input
//             id="fatherProfession"
//             value={family.fatherProfession}
//             onChange={(e) => handleChange("fatherProfession", e.target.value)}
//             placeholder={t.familyInformation?.fatherProfession}
//             className="border-emerald-200 dark:border-emerald-700"
//             disabled={!family.fatherAlive}
//           />
//         </div>

//         <div className="space-y-3">
//           <Label htmlFor="motherProfession">
//             {t.familyInformation?.motherProfession}
//           </Label>
//           <Input
//             id="motherProfession"
//             value={family.motherProfession}
//             onChange={(e) => handleChange("motherProfession", e.target.value)}
//             placeholder={t.familyInformation?.motherProfession}
//             className="border-emerald-200 dark:border-emerald-700"
//             disabled={!family.motherAlive}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-3">
//           <Label htmlFor="brothers">{t.familyInformation?.brother}</Label>
//           <Input
//             id="brothers"
//             type="number"
//             min="0"
//             value={family.brothers}
//             onChange={(e) => handleNumberChange("brothers", e.target.value)}
//             className="border-emerald-200 dark:border-emerald-700"
//           />
//         </div>

//         <div className="space-y-3">
//           <Label htmlFor="sisters">{t.familyInformation?.sister}</Label>
//           <Input
//             id="sisters"
//             type="number"
//             min="0"
//             value={family.sisters}
//             onChange={(e) => handleNumberChange("sisters", e.target.value)}
//             className="border-emerald-200 dark:border-emerald-700"
//           />
//         </div>
//       </div>

//       {family.sisters > 0 && (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <Label>{t.familyInformation?.sisterInformation}</Label>
//             <Button
//               type="button"
//               onClick={addSisterInfo}
//               size="sm"
//               className="bg-emerald-600 hover:bg-emerald-700"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               {t.familyInformation?.addSisterInfoBtn}
//             </Button>
//           </div>
//           <div className="space-y-2">
//             {family.sistersInfo.map((info, index) => (
//               <div key={index} className="flex gap-2">
//                 <Input
//                   value={info}
//                   onChange={(e) => updateSisterInfo(index, e.target.value)}
//                   placeholder={t.familyInformation?.sisterInfoPlaceHolder}
//                   className="border-emerald-200 dark:border-emerald-700"
//                 />
//                 <Button
//                   type="button"
//                   onClick={() => removeSisterInfo(index)}
//                   size="sm"
//                   variant="destructive"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <Label>{t.familyInformation?.uncleProfession}</Label>
//           <Button
//             type="button"
//             onClick={addUncleProfession}
//             size="sm"
//             className="bg-yellow-600 hover:bg-yellow-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             {t.familyInformation?.addUncleBtn}
//           </Button>
//         </div>
//         <div className="space-y-2">
//           {family.unclesProfession.map((profession, index) => (
//             <div key={index} className="flex gap-2">
//               <Input
//                 value={profession}
//                 onChange={(e) => updateUncleProfession(index, e.target.value)}
//                 placeholder={t.familyInformation?.uncleProfession}
//                 className="border-emerald-200 dark:border-emerald-700"
//               />
//               <Button
//                 type="button"
//                 onClick={() => removeUncleProfession(index)}
//                 size="sm"
//                 variant="destructive"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-3">
//         <Label htmlFor="financialStatus">
//           {t.familyInformation?.familyStatus}
//         </Label>
//         <Select
//           value={family.financialStatus}
//           onValueChange={(value) => handleChange("financialStatus", value)}
//         >
//           <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
//             <SelectValue placeholder="Select financial status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={t.familyInformation?.lower}>
//               {t.familyInformation?.lower}
//             </SelectItem>
//             <SelectItem value={t.familyInformation?.upper}>
//               {t.familyInformation?.upper}
//             </SelectItem>
//             <SelectItem value={t.familyInformation?.middle}>
//               {t.familyInformation?.middle}
//             </SelectItem>
//             <SelectItem value={t.familyInformation?.rich}>
//               {t.familyInformation?.rich}
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-3">
//         <Label htmlFor="financialDetails">
//           {t.familyInformation?.familySituation}
//         </Label>
//         <Textarea
//           id="financialDetails"
//           value={family.financialDetails}
//           onChange={(e) => handleChange("financialDetails", e.target.value)}
//           placeholder={t.familyInformation?.familySituationPlaceholder}
//           className="border-emerald-200 dark:border-emerald-700"
//         />
//       </div>

//       <div className="space-y-3">
//         <Label htmlFor="religiousPractice">
//           {t.familyInformation?.religiousCondition}
//         </Label>
//         <Textarea
//           id="religiousPractice"
//           value={family.religiousPractice}
//           onChange={(e) => handleChange("religiousPractice", e.target.value)}
//           placeholder={t.familyInformation?.religiousConditionPlaceHolder}
//           className="border-emerald-200 dark:border-emerald-700"
//         />
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FamilyInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";

export default function FamilyStep({ data, updateData }: StepProps) {
  const [family, setFamily] = useState<FamilyInfo>({
    fatherAlive: true,
    motherAlive: true,
    fatherProfession: "",
    motherProfession: "",
    brothers: 0,
    sisters: 0,
    brothersInfo: [],
    sistersInfo: [],
    unclesProfession: [],
    financialStatus: "",
    financialDetails: "",
    religiousPractice: "",
    ...data.family,
  });

  useEffect(() => {
    updateData({ family });
  }, [family, updateData]);

  const handleChange = (
    field: keyof FamilyInfo,
    value: string | boolean | number
  ) => {
    setFamily((prev) => ({ ...prev, [field]: value }));
  };

  const addBrotherInfo = () => {
    setFamily((prev) => ({
      ...prev,
      brothersInfo: [...prev.brothersInfo, ""],
    }));
  };

  const removeBrotherInfo = (index: number) => {
    setFamily((prev) => ({
      ...prev,
      brothersInfo: prev.brothersInfo.filter((_, i) => i !== index),
    }));
  };

  const updateBrotherInfo = (index: number, value: string) => {
    setFamily((prev) => ({
      ...prev,
      brothersInfo: prev.brothersInfo.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addSisterInfo = () => {
    setFamily((prev) => ({
      ...prev,
      sistersInfo: [...prev.sistersInfo, ""],
    }));
  };

  const removeSisterInfo = (index: number) => {
    setFamily((prev) => ({
      ...prev,
      sistersInfo: prev.sistersInfo.filter((_, i) => i !== index),
    }));
  };

  const updateSisterInfo = (index: number, value: string) => {
    setFamily((prev) => ({
      ...prev,
      sistersInfo: prev.sistersInfo.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addUncleProfession = () => {
    setFamily((prev) => ({
      ...prev,
      unclesProfession: [...prev.unclesProfession, ""],
    }));
  };

  const removeUncleProfession = (index: number) => {
    setFamily((prev) => ({
      ...prev,
      unclesProfession: prev.unclesProfession.filter((_, i) => i !== index),
    }));
  };

  const updateUncleProfession = (index: number, value: string) => {
    setFamily((prev) => ({
      ...prev,
      unclesProfession: prev.unclesProfession.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleNumberChange = (field: "brothers" | "sisters", value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setFamily((prev) => ({ ...prev, [field]: numValue }));
  };

  const { language } = useLanguage();
  const t = biodataTranslation[language];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fatherAlive"
            checked={family.fatherAlive}
            onCheckedChange={(checked) => handleChange("fatherAlive", checked)}
          />
          <Label htmlFor="fatherAlive">
            {t.familyInformation?.fatherAlive}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="motherAlive"
            checked={family.motherAlive}
            onCheckedChange={(checked) => handleChange("motherAlive", checked)}
          />
          <Label htmlFor="motherAlive">
            {t.familyInformation?.motherAlive}
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="fatherProfession">
            {t.familyInformation?.fatherProfession}
          </Label>
          <Input
            id="fatherProfession"
            value={family.fatherProfession}
            onChange={(e) => handleChange("fatherProfession", e.target.value)}
            placeholder={t.familyInformation?.fatherProfession}
            className="border-emerald-200 dark:border-emerald-700"
            disabled={!family.fatherAlive}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="motherProfession">
            {t.familyInformation?.motherProfession}
          </Label>
          <Input
            id="motherProfession"
            value={family.motherProfession}
            onChange={(e) => handleChange("motherProfession", e.target.value)}
            placeholder={t.familyInformation?.motherProfession}
            className="border-emerald-200 dark:border-emerald-700"
            disabled={!family.motherAlive}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="brothers">{t.familyInformation?.brother}</Label>
          <Input
            id="brothers"
            type="number"
            min="0"
            value={family.brothers}
            onChange={(e) => handleNumberChange("brothers", e.target.value)}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="sisters">{t.familyInformation?.sister}</Label>
          <Input
            id="sisters"
            type="number"
            min="0"
            value={family.sisters}
            onChange={(e) => handleNumberChange("sisters", e.target.value)}
            className="border-emerald-200 dark:border-emerald-700"
          />
        </div>
      </div>

      {family.brothers > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>{t.familyInformation?.brotherInformation}</Label>
            <Button
              type="button"
              onClick={addBrotherInfo}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.familyInformation?.addBrotherInfoBtn}
            </Button>
          </div>
          <div className="space-y-2">
            {family.brothersInfo.map((info, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={info}
                  onChange={(e) => updateBrotherInfo(index, e.target.value)}
                  placeholder={t.familyInformation?.brotherInfoPlaceHolder}
                  className="border-emerald-200 dark:border-emerald-700"
                />
                <Button
                  type="button"
                  onClick={() => removeBrotherInfo(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {family.sisters > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label>{t.familyInformation?.sisterInformation}</Label>
            <Button
              type="button"
              onClick={addSisterInfo}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.familyInformation?.addSisterInfoBtn}
            </Button>
          </div>
          <div className="space-y-2">
            {family.sistersInfo.map((info, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={info}
                  onChange={(e) => updateSisterInfo(index, e.target.value)}
                  placeholder={t.familyInformation?.sisterInfoPlaceHolder}
                  className="border-emerald-200 dark:border-emerald-700"
                />
                <Button
                  type="button"
                  onClick={() => removeSisterInfo(index)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>{t.familyInformation?.uncleProfession}</Label>
          <Button
            type="button"
            onClick={addUncleProfession}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.familyInformation?.addUncleBtn}
          </Button>
        </div>
        <div className="space-y-2">
          {family.unclesProfession.map((profession, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={profession}
                onChange={(e) => updateUncleProfession(index, e.target.value)}
                placeholder={t.familyInformation?.uncleProfession}
                className="border-emerald-200 dark:border-emerald-700"
              />
              <Button
                type="button"
                onClick={() => removeUncleProfession(index)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="financialStatus">
          {t.familyInformation?.familyStatus}
        </Label>
        <Select
          value={family.financialStatus}
          onValueChange={(value) => handleChange("financialStatus", value)}
        >
          <SelectTrigger className="border-emerald-200 dark:border-emerald-700 w-full">
            <SelectValue placeholder="Select financial status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={t.familyInformation?.lower}>
              {t.familyInformation?.lower}
            </SelectItem>
            <SelectItem value={t.familyInformation?.upper}>
              {t.familyInformation?.upper}
            </SelectItem>
            <SelectItem value={t.familyInformation?.middle}>
              {t.familyInformation?.middle}
            </SelectItem>
            <SelectItem value={t.familyInformation?.rich}>
              {t.familyInformation?.rich}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="financialDetails">
          {t.familyInformation?.familySituation}
        </Label>
        <Textarea
          id="financialDetails"
          value={family.financialDetails}
          onChange={(e) => handleChange("financialDetails", e.target.value)}
          placeholder={t.familyInformation?.familySituationPlaceholder}
          className="border-emerald-200 dark:border-emerald-700"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="religiousPractice">
          {t.familyInformation?.religiousCondition}
        </Label>
        <Textarea
          id="religiousPractice"
          value={family.religiousPractice}
          onChange={(e) => handleChange("religiousPractice", e.target.value)}
          placeholder={t.familyInformation?.religiousConditionPlaceHolder}
          className="border-emerald-200 dark:border-emerald-700"
        />
      </div>
    </div>
  );
}