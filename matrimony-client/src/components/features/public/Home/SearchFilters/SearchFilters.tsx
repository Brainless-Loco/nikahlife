// "use client";

// import * as React from "react";
// import { Search, Users, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import divisions from "../../../../../../public/division.json";
// import districts from "../../../../../../public/district.json";
// import upazilas from "../../../../../../public/upzila.json";
// import { District, Upazila } from "@/types/filterForm";
// import { FilterParams } from "@/types/filters";
// import { generateSearchParams } from "@/utils/searchParams";
// import { useRouter } from "next/navigation";
// import { useLanguage } from "@/hooks/use-language";
// import { filterTranslation } from "@/dictionary/filter";
// import UniversitySelector from "../../Biodata/BiodataSteps/UniversitySelector";

// // Zod schema for form validation
// const filterSchema = z.object({
//   gender: z.enum(["male", "female", ""]).optional(),
//   division: z.string().optional(),
//   district: z.string().optional(),
//   upazila: z.string().optional(),
//   maritalStatus: z.string().optional(),
// });

// type FilterFormData = z.infer<typeof filterSchema>;

// export default function SearchFilters() {
//   const [isSearching, setIsSearching] = React.useState(false);
//   const [selectedDivision, setSelectedDivision] = React.useState<string>("");
//   const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");

//   const router = useRouter();

//   const { language } = useLanguage();
//   const t = filterTranslation[language];

//   const form = useForm<FilterFormData>({
//     resolver: zodResolver(filterSchema),
//     defaultValues: {
//       gender: "",
//       division: "",
//       district: "",
//       upazila: "",
//       maritalStatus: "",
//     },
//   });
//   // const maritalStatuses = [t.naverMarried, t.divorced, t.married];

//   // Get unique districts for the selected division
//   const filteredDistricts = React.useMemo(() => {
//     if (!selectedDivision) return [];
//     return districts
//       .filter((d) => d.division_id === selectedDivision)
//       .reduce((unique: District[], district) => {
//         if (!unique.some((d) => d.districtsName === district.districtsName)) {
//           unique.push(district);
//         }
//         return unique;
//       }, []);
//   }, [selectedDivision]);

//   // Get unique upazilas for the selected district
//   const filteredUpazilas = React.useMemo(() => {
//     if (!selectedDistrict) return [];
//     return upazilas
//       .filter((u) => u.districtsName === selectedDistrict)
//       .reduce((unique: Upazila[], upazila) => {
//         if (
//           !unique.some((u) => u.subDistrictsName === upazila.subDistrictsName)
//         ) {
//           unique.push(upazila);
//         }
//         return unique;
//       }, []);
//   }, [selectedDistrict]);

//   const handleSearch = async (filters: FilterParams) => {
//     setIsSearching(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const params = generateSearchParams(filters);
//       router.push(`/biodatas?${params.toString()}`, { scroll: false });
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleDivisionChange = (value: string) => {
//     setSelectedDivision(value);
//     setSelectedDistrict("");
//     form.setValue("division", value);
//     form.setValue("district", "");
//     form.setValue("upazila", "");
//   };

//   const handleDistrictChange = (value: string) => {
//     setSelectedDistrict(value);
//     form.setValue("district", value);
//     form.setValue("upazila", "");
//   };

//   return (
//     <section className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 py-12 transition-colors duration-300">
//       <div className="container mx-auto px-4 lg:px-8">
//         {/* Header */}
//         <Card className="shadow-lg dark:shadow-emerald-500/10 bg-white dark:bg-gray-800 border-0 dark:border dark:border-gray-700">
//           <CardContent className="p-8 md:p-12">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(handleSearch)}
//                 className="space-y-8"
//               >
//                 {/* Main Filters */}
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                   {/* Looking For */}
//                   <FormField
//                     control={form.control}
//                     name="gender"
//                     render={({ field }) => (
//                       <FormItem className="space-y-4">
//                         <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
//                           <Users className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400 text-xl" />
//                           {t.lookingFor}
//                         </FormLabel>
//                         <FormControl>
//                           <RadioGroup
//                             value={field.value}
//                             onValueChange={field.onChange}
//                             className="flex flex-col lg:flex-row lg:space-x-6 space-y-3 lg:space-y-0"
//                           >
//                             <div className="flex items-center space-x-2">
//                               <RadioGroupItem
//                                 value="male"
//                                 id="male"
//                                 className="border-2 border-gray-300 dark:border-gray-600 text-emerald-600 dark:text-emerald-400"
//                               />
//                               <Label
//                                 htmlFor="male"
//                                 className="cursor-pointer font-medium text-gray-700 dark:text-gray-300"
//                               >
//                                 {t.male}
//                               </Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <RadioGroupItem
//                                 value="female"
//                                 id="female"
//                                 className="border-2 border-gray-300 dark:border-gray-600 text-emerald-600 dark:text-emerald-400"
//                               />
//                               <Label
//                                 htmlFor="female"
//                                 className="cursor-pointer font-medium text-gray-700 dark:text-gray-300"
//                               >
//                                 {t.female}
//                               </Label>
//                             </div>
//                           </RadioGroup>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Division */}
//                   <FormField
//                     control={form.control}
//                     name="division"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
//                           <MapPin className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
//                           {t.division}
//                         </FormLabel>
//                         <Select
//                           onValueChange={handleDivisionChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
//                               <SelectValue placeholder={t.selectDivision} />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
//                             {divisions.map((div) => (
//                               <SelectItem
//                                 key={div.division_id}
//                                 value={div.division_id}
//                                 className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                               >
//                                 {div.bnDivisionName}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* District */}
//                   <FormField
//                     control={form.control}
//                     name="district"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           {t.district}
//                         </FormLabel>
//                         <Select
//                           onValueChange={handleDistrictChange}
//                           value={field.value}
//                           disabled={!selectedDivision}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 dark:disabled:opacity-50 cursor-pointer">
//                               <SelectValue placeholder={t.selectDistrict} />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
//                             {filteredDistricts.map((dis) => (
//                               <SelectItem
//                                 key={dis.districtsName}
//                                 value={dis.districtsName}
//                                 className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                               >
//                                 {dis.bnDistrictsName}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Upazila */}
//                   <FormField
//                     control={form.control}
//                     name="upazila"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           {t.upazila}
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                           disabled={!selectedDistrict}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 dark:disabled:opacity-50 cursor-pointer">
//                               <SelectValue placeholder={t.selectUpazila} />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
//                             {filteredUpazilas.map((upa) => (
//                               <SelectItem
//                                 key={upa.subDistrictsName}
//                                 value={upa.subDistrictsName}
//                                 className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                               >
//                                 {upa.bnSubDistrictsName}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Profession and Marital Status */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   <FormField
//                     control={form.control}
//                     name="maritalStatus"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           {t.maritalStatus}
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
//                               <SelectValue
//                                 placeholder={t.selectMaritalStatus}
//                               />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
//                             <SelectItem
//                               value={"Divorced".toLowerCase()}
//                               className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                             >
//                               {t.divorced}
//                             </SelectItem>
//                             <SelectItem
//                               value={"Naver Married".toLowerCase()}
//                               className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                             >
//                               {t.naverMarried}
//                             </SelectItem>
//                             <SelectItem
//                               value={"Married".toLowerCase()}
//                               className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                             >
//                               {t.married}
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   {/* University selector */}
//                   <UniversitySelector />
//                 </div>
//                 {/* Search Button */}
//                 <div className="flex justify-center">
//                   <Button
//                     type="submit"
//                     disabled={isSearching}
//                     className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-12 py-4 rounded-lg font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl dark:shadow-emerald-500/20 cursor-pointer"
//                   >
//                     {isSearching ? (
//                       <div className="flex items-center space-x-3">
//                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
//                         <span>{t.searching}...</span>
//                       </div>
//                     ) : (
//                       <>
//                         <Search className="mr-3 h-5 w-5" />
//                         {t.search}
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </section>
//   );
// }


"use client";

import * as React from "react";
import { Search, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import divisions from "../../../../../../public/division.json";
import districts from "../../../../../../public/district.json";
import upazilas from "../../../../../../public/upzila.json";
import universities from "../../../../../../public/universities.json";
import { District, Upazila } from "@/types/filterForm";
import { FilterParams } from "@/types/filters";
import { generateSearchParams } from "@/utils/searchParams";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { filterTranslation } from "@/dictionary/filter";
import UniversitySelector from "../../Biodata/BiodataSteps/UniversitySelector";

// Zod schema for form validation
const filterSchema = z.object({
  gender: z.enum(["male", "female", ""]).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  upazila: z.string().optional(),
  maritalStatus: z.string().optional(),
  university: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

export default function SearchFilters() {
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedDivision, setSelectedDivision] = React.useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");

  const router = useRouter();

  const { language } = useLanguage();
  const t = filterTranslation[language];

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      gender: "",
      division: "",
      district: "",
      upazila: "",
      maritalStatus: "",
      university: "",
    },
  });

  // Get unique districts for the selected division
  const filteredDistricts = React.useMemo(() => {
    if (!selectedDivision) return [];
    return districts
      .filter((d) => d.division_id === selectedDivision)
      .reduce((unique: District[], district) => {
        if (!unique.some((d) => d.districtsName === district.districtsName)) {
          unique.push(district);
        }
        return unique;
      }, []);
  }, [selectedDivision]);

  // Get unique upazilas for the selected district
  const filteredUpazilas = React.useMemo(() => {
    if (!selectedDistrict) return [];
    return upazilas
      .filter((u) => u.districtsName === selectedDistrict)
      .reduce((unique: Upazila[], upazila) => {
        if (
          !unique.some((u) => u.subDistrictsName === upazila.subDistrictsName)
        ) {
          unique.push(upazila);
        }
        return unique;
      }, []);
  }, [selectedDistrict]);

  const handleSearch = async (filters: FilterParams) => {
    setIsSearching(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const params = generateSearchParams(filters);
      router.push(`/biodatas?${params.toString()}`, { scroll: false });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict("");
    form.setValue("division", value);
    form.setValue("district", "");
    form.setValue("upazila", "");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    form.setValue("district", value);
    form.setValue("upazila", "");
  };

  return (
    <section className="bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <Card className="shadow-lg dark:shadow-emerald-500/10 bg-white dark:bg-gray-800 border-0 dark:border dark:border-gray-700">
          <CardContent className="p-8 md:p-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSearch)}
                className="space-y-8"
              >
                {/* Main Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Looking For */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400 text-xl" />
                          {t.lookingFor}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-col lg:flex-row lg:space-x-6 space-y-3 lg:space-y-0"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="male"
                                id="male"
                                className="border-2 border-gray-300 dark:border-gray-600 text-emerald-600 dark:text-emerald-400"
                              />
                              <Label
                                htmlFor="male"
                                className="cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                              >
                                {t.male}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="female"
                                id="female"
                                className="border-2 border-gray-300 dark:border-gray-600 text-emerald-600 dark:text-emerald-400"
                              />
                              <Label
                                htmlFor="female"
                                className="cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                              >
                                {t.female}
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Division */}
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                          {t.division}
                        </FormLabel>
                        <Select
                          onValueChange={handleDivisionChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
                              <SelectValue placeholder={t.selectDivision} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            {divisions.map((div) => (
                              <SelectItem
                                key={div.division_id}
                                value={div.division_id}
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                {div.bnDivisionName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* District */}
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t.district}
                        </FormLabel>
                        <Select
                          onValueChange={handleDistrictChange}
                          value={field.value}
                          disabled={!selectedDivision}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 dark:disabled:opacity-50 cursor-pointer">
                              <SelectValue placeholder={t.selectDistrict} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            {filteredDistricts.map((dis) => (
                              <SelectItem
                                key={dis.districtsName}
                                value={dis.districtsName}
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                {dis.bnDistrictsName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upazila */}
                  <FormField
                    control={form.control}
                    name="upazila"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t.upazila}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedDistrict}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 dark:disabled:opacity-50 cursor-pointer">
                              <SelectValue placeholder={t.selectUpazila} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            {filteredUpazilas.map((upa) => (
                              <SelectItem
                                key={upa.subDistrictsName}
                                value={upa.subDistrictsName}
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                {upa.bnSubDistrictsName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Profession and Marital Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t.maritalStatus}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-400 dark:focus:border-emerald-500 h-12 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
                              <SelectValue
                                placeholder={t.selectMaritalStatus}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            <SelectItem
                              value={"Divorced".toLowerCase()}
                              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            >
                              {t.divorced}
                            </SelectItem>
                            <SelectItem
                              value={"Unmarried".toLowerCase()}
                              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            >
                              {t.naverMarried}
                            </SelectItem>
                            <SelectItem
                              value={"Married".toLowerCase()}
                              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            >
                              {t.married}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* University selector - Now properly integrated */}
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {"University"}
                        </FormLabel>
                        <FormControl>
                          <UniversitySelector
                            universities={universities}
                            value={field.value}
                            onChange={(university) => {
                              // Store the English name for consistency
                              field.onChange(university.name_english);
                            }}
                            placeholder={t.universitySelectPlaceholder}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Search Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-12 py-4 rounded-lg font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl dark:shadow-emerald-500/20 cursor-pointer"
                  >
                    {isSearching ? (
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        <span>{t.searching}...</span>
                      </div>
                    ) : (
                      <>
                        <Search className="mr-3 h-5 w-5" />
                        {t.search}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}