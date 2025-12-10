"use client";

import SingleBiodata from "@/components/features/public/Biodata/SingleBiodata/SingleBiodata";
import React from "react";
import { useParams } from "next/navigation";

const BioData = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <SingleBiodata id={id} />
    </div>
  );
};

export default BioData;