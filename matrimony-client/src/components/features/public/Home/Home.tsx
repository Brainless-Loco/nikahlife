"use client";
import React from "react";
import Banner from "./Banner/Banner";
import SearchFilters from "./SearchFilters/SearchFilters";
import PricingSection from "./PricingSection/PricingSection";
import NewsLetter from "./NewsLetter/NewsLetter";
import { useAuth } from "@/app/(auth)/context/auth-context";
import CreateBiodataSection from "./CreateBiodataSection/CreateBIodataSection";

const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <Banner />
      <SearchFilters />
      {!user && <CreateBiodataSection />}
      {(user?.subscriptionType === "free" || user === null) && (
        <PricingSection />
      )}
      <NewsLetter />
    </div>
  );
};

export default Home;
