"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PledgeInfo, StepProps } from "@/types/biodataForm";
import { useLanguage } from "@/hooks/use-language";
import { biodataTranslation } from "@/dictionary/biodata";

export default function PledgeStep({ data, updateData }: StepProps) {
  const [pledge, setPledge] = useState<PledgeInfo>({
    parentsAware: false,
    informationAccurate: false,
    nikahResponsibility: false,
    ...data.pledge,
  });

  useEffect(() => {
    updateData({ pledge });
  }, [pledge, updateData]);

  const handleChange = (field: keyof PledgeInfo, value: boolean) => {
    setPledge((prev) => ({ ...prev, [field]: value }));
  };

  const { language } = useLanguage();
  const t = biodataTranslation[language];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
          {t.pledge?.finalPledge}
        </h2>
        <p className="text-muted-foreground">{t.pledge?.pledgeDescription}</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3 p-4 border border-emerald-200 dark:border-emerald-700 rounded-lg">
          <Checkbox
            id="parentsAware"
            checked={pledge.parentsAware}
            onCheckedChange={(checked: boolean) =>
              handleChange("parentsAware", checked)
            }
            className="mt-1"
          />
          <div>
            <Label
              htmlFor="parentsAware"
              className="text-base font-medium cursor-pointer"
            >
              {t.pledge?.parentsAware}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t.pledge?.confirmAwarness}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-emerald-200 dark:border-emerald-700 rounded-lg">
          <Checkbox
            id="informationAccurate"
            checked={pledge.informationAccurate}
            onCheckedChange={(checked: boolean) =>
              handleChange("informationAccurate", checked)
            }
            className="mt-1"
          />
          <div>
            <Label
              htmlFor="informationAccurate"
              className="text-base font-medium cursor-pointer"
            >
              {t.pledge?.nikahResponsibility}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t.pledge?.confirmResponsibilities}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-emerald-200 dark:border-emerald-700 rounded-lg">
          <Checkbox
            id="nikahResponsibility"
            checked={pledge.nikahResponsibility}
            onCheckedChange={(checked: boolean) =>
              handleChange("nikahResponsibility", checked)
            }
            className="mt-1"
          />
          <div>
            <Label
              htmlFor="nikahResponsibility"
              className="text-base font-medium cursor-pointer"
            >
              {t.pledge?.confirmResponsibilities}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t.pledge?.confirmResponsibilities}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">
          {t.pledge?.importantRemainder}
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
          <li>{t.pledge?.reminder1}</li>
          <li>{t.pledge?.reminder2}</li>
          <li>{t.pledge?.reminder3}</li>
          <li>{t.pledge?.reminder4}</li>
          <li>{t.pledge?.reminder5}</li>
        </ul>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>{t.pledge?.conclusion}</p>
      </div>
    </div>
  );
}
