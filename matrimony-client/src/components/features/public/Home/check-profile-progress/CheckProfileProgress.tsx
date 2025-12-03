// "use client";
// import { User, Heart, ArrowRight, Shield, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/app/(auth)/context/auth-context";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function CheckProfileProgress() {
//   const { user } = useAuth();
//   const [status, setStatus] = useState(400);

//   useEffect(() => {
//     const fetchProfileProgress = async () => {
//       if (user?.userId) {
//         const token = localStorage.getItem("token");
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/biodata/${user.userId}`,
//             {
//               headers: {
//                 Authorization: `${token}`,
//               },
//             }
//           );
//           console.log("Profile progress:", response.data);
//           //   setStatus(response?.data?.response?.status);
//         } catch (error) {
//           console.error("Error fetching profile progress:", error);
//           if (axios.isAxiosError(error) && error.response) {
//             setStatus(error.response.status);
//           } else {
//             setStatus(400);
//           }
//         }
//       }
//     };

//     fetchProfileProgress();
//   }, [user?.userId]);
//   console.log(status);

//   if (status === 200) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50">
//         <div className="container mx-auto px-4 lg:px-8 py-12">
//           <div className="max-w-4xl mx-auto">
//             {/* Header Section */}
//             <div className="text-center mb-12">
//               <div className="relative inline-block mb-6">
//                 <div className="h-32 w-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
//                   <User className="h-16 w-16 text-emerald-600" />
//                 </div>
//                 <div className="absolute -top-2 -right-2 h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
//                   <Sparkles className="h-6 w-6 text-white" />
//                 </div>
//               </div>

//               <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//                 Your Profile Awaits!
//               </h1>
//               <p className="text-xl text-gray-600 mb-2">
//                 Complete your biodata to start your matrimonial journey
//               </p>
//               <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium">
//                 Profile Not Found
//               </Badge>
//             </div>

//             <div className="text-center">
//               <Card className="border-emerald-200 shadow-xl bg-gradient-to-r from-white to-emerald-50/50">
//                 <CardContent className="p-8 md:p-12">
//                   <div className="max-w-2xl mx-auto">
//                     <div className="flex items-center justify-center space-x-2 mb-4">
//                       <Heart className="h-6 w-6 text-emerald-500 fill-current" />
//                       <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
//                         Ready to Find Your Soulmate?
//                       </h3>
//                     </div>

//                     <p className="text-gray-600 text-lg mb-8">
//                       Join thousands of happy couples who found their perfect
//                       match through our platform. Your journey to happiness
//                       starts with a complete profile.
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                       <Button
//                         size="lg"
//                         className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
//                       >
//                         <User className="h-5 w-5 mr-2" />
//                         Create Biodata
//                         <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                       </Button>
//                     </div>

//                     <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Shield className="h-4 w-4" />
//                         <span>100% Secure</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     return null;
//   }
// }

"use client";
import { User, Heart, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { SpinnerLoader } from "@/components/common/Loader";
import Link from "next/link";

export default function CheckProfileProgress() {
  const { user } = useAuth();
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileProgress = async () => {
      // Reset loading state
      setIsLoading(true);

      if (!user?.userId) {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/my-biodata`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        console.log("Profile progress:", response.data);
        setStatus(response.status);
      } catch (error) {
        console.error("Error fetching profile progress:", error);

        if (axios.isAxiosError(error) && error.response) {
          setStatus(error.response.status);
        } else {
          setStatus(400);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileProgress();
  }, [user?.userId]);

  // Show loading state (optional)
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  // Only show UI when status is 404
  if (status !== 404) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <User className="h-16 w-16 text-emerald-600" />
              </div>
              <div className="absolute -top-2 -right-2 h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Your Profile Awaits!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Complete your biodata to start your matrimonial journey
            </p>
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium">
              Profile Not Found
            </Badge>
          </div>

          <div className="text-center">
            <Card className="border-emerald-200 shadow-xl bg-gradient-to-r from-white to-emerald-50/50">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Heart className="h-6 w-6 text-emerald-500 fill-current" />
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Ready to Find Your Soulmate?
                    </h3>
                  </div>

                  <p className="text-gray-600 text-lg mb-8">
                    Join thousands of happy couples who found their perfect
                    match through our platform. Your journey to happiness starts
                    with a complete profile.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href={"/profile/create-biodata"}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      >
                        <User className="h-5 w-5 mr-2" />
                        Create Biodata
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>100% Secure</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
