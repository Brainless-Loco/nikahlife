"use client";
import { Suspense } from "react";
import BiodatasPage from "@/components/features/public/Biodata/Biodata";
import CreateBiodataSection from "@/components/features/public/Home/CreateBiodataSection/CreateBIodataSection";
import { getCookie } from "@/utils/getToken";
import { useEffect, useState } from "react";

export default function BiodataPage() {
  const [token, setToken] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = getCookie("token") || "";
    setToken(storedToken);
  }, []);

  if (!isClient) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Suspense
      fallback={<div className="p-4 text-center">Loading biodata...</div>}
    >
      {!token && <CreateBiodataSection />}
      <BiodatasPage />
    </Suspense>
  );
}
