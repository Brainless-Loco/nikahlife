import { getCookie } from "@/utils/getToken";

export const getOwnBiodata = async () => {
  const token = getCookie("token") || "";

  try {
    if (!token) {
      console.log("No token found. Please login first.");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/my-biodata`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    const result = await response.json();

    if (result.success && result.data) {
      localStorage.setItem("biodata", JSON.stringify(result.data));
    } else {
      console.log("Failed to fetch biodata:", result.message);
    }
  } catch (error) {
    console.log("Error fetching biodata:", error);
  }
};
