import SingleBiodata from "@/components/features/public/Biodata/SingleBiodata/SingleBiodata";
import React from "react";

type BioDataPageProps = {
  params: Promise<{ id: string }>;
};

const BioData = async ({ params }: BioDataPageProps) => {
  const { id } = await params;

  return (
    <div>
      <SingleBiodata id={id} />
    </div>
  );
};

export default BioData;