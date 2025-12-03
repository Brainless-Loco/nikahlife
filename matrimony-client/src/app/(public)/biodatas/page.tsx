"use client";
import { Suspense } from "react";
import BiodatasPage from "@/components/features/public/Biodata/Biodata";
import CreateBiodataSection from "@/components/features/public/Home/CreateBiodataSection/CreateBIodataSection";
import { getCookie } from "@/utils/getToken";

export default function BiodataPage() {
  const token = getCookie("token") || "";
  return (
    <Suspense
      fallback={<div className="p-4 text-center">Loading biodata...</div>}
    >
      {!token && <CreateBiodataSection />}
      <BiodatasPage />
    </Suspense>
  );
}
