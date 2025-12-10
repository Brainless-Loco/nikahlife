"use client";

import type React from "react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  GraduationCap,
  Users,
  Heart,
  Phone,
  Search,
  Save,
  Camera,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { profileSchema } from "./formValidation";
import { useAuth } from "@/app/(auth)/context/auth-context";
import axios from "axios";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileUpdate() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { user } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      age: 0,
      description: "",
      phone: "",
      email: user?.email || "",
      country: "Bangladesh",
      complexion: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name || "",
      age: 0,
      description: "",
      phone: "",
      email: user?.email || "",
      country: "Bangladesh",
      complexion: "",
    });
  }, [user]);

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      icon: User,
      description: "Personal details and bio",
    },
    {
      id: 2,
      title: "Address Details",
      icon: MapPin,
      description: "Current and permanent address",
    },
    {
      id: 3,
      title: "Educational Background",
      icon: GraduationCap,
      description: "Academic qualifications",
    },
    {
      id: 4,
      title: "Family Information",
      icon: Users,
      description: "Family background details",
    },
    {
      id: 5,
      title: "Personal & Religious",
      icon: Heart,
      description: "Personal characteristics",
    },
    {
      id: 6,
      title: "Contact Information",
      icon: Phone,
      description: "How to reach you",
    },
    {
      id: 7,
      title: "Partner Preferences",
      icon: Search,
      description: "What you're looking for",
    },
  ];

  const transformProfileFormData = (data: ProfileFormData) => {
    return {
      name: data.name,
      description: data.description,
      age: data.age,
      address: {
        present: data.presentDetails,
        permanent: data.permanentDetails,
        country: data.country,
        division: data.permanentDivision,
        district: data.permanentDistrict,
        upazila: data.permanentUpazila,
      },
      education: {
        sscYear: data.sscYear,
        sscGroup: data.sscGroup,
        sscResult: data.sscResult,
        hscYear: data.hscYear,
        hscGroup: data.hscGroup,
        hscResult: data.hscResult,
        honours: data.honours,
        educationLevel: data.educationLevel,
      },
      familyInfo: {
        fatherAlive: data.fatherAlive,
        fatherOccupation: data.fatherOccupation,
        motherAlive: data.motherAlive,
        motherOccupation: data.motherOccupation,
        brothers: data.brothers,
        sisters: data.sisters,
        siblingsDetails: data.siblingsDetails,
      },
      personalInfo: {
        beard: data.beard,
        salat: data.salat,
        mahramTravel: data.mahramTravel,
        health: data.health,
        disability: data.disability,
        religiousPractice: data.religiousPractice,
      },
      physicalInfo: {
        height: data.height,
        weight: data.weight,
        bloodGroup: data.bloodGroup,
        bodyColor: data.bodyColor,
        physicalAppearance: data.physicalAppearance,
      },
      maritalInfo: {
        maritalStatus: data.maritalStatus,
        preferredMaritalStatus: data.preferredMaritalStatus,
        childAllow: data.childAllow,
        whyWantToMarry: data.whyWantToMarry,
        futurePlan: data.futurePlan,
      },
      contactInfo: {
        email: data.email,
        phone: data.phone,
        facebook: data.facebook,
      },
      preference: {
        additionalQualities: data.additionalQualities,
        ageRange: data.ageRange,
        educationLevel: data.educationLevel,
        maritalStatus: data.maritalStatus,
        physicalAppearance: data.physicalAppearance,
        religiousPractice: data.religiousPractice,
      },
      additionalQualities: data.additionalQualities,
      ageRange: data.ageRange,
    };
  };

  /**
   * Handles profile form submission
   */

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Transform form data to nested structure
      const biodataPayload = transformProfileFormData(data);

      // Add user information to payload
      const payload = {
        ...biodataPayload,
        email: user?.email, // Assuming 'user' is available in scope
      };

      console.debug("Submitting profile data:", payload);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("Profile update successful:", response.data);
      toast.success("Profile updated successfully!");

      return response.data;
    } catch (error: unknown) {
      console.error("Profile update failed:", error);

      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      throw error; // Re-throw for further handling if needed
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Update Profile
              </h1>
              <p className="text-gray-600">
                Keep your information up to date to find better matches
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 7
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="hidden lg:flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`w-12 h-12 cursor-pointer rounded-full flex items-center justify-center mb-2 transition-all ${
                    currentStep === step.id
                      ? "bg-emerald-600 text-white shadow-lg"
                      : currentStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </button>
                <div className="text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep === step.id
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden xl:block">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 w-24 h-0.5 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                    style={{
                      left: `${(index + 1) * 14.28}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Step Indicator */}
          <div className="lg:hidden">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${"bg-emerald-600 text-white"}`}
                  >
                    {/* <steps[currentStep - 1].icon className="h-5 w-5" /> */}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {steps[currentStep - 1].title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {steps[currentStep - 1].description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your basic profile information that others will see first
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={
                          profileImage ||
                          "/placeholder.svg?height=128&width=128"
                        }
                      />
                      <AvatarFallback className="text-2xl">AR</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="relative bg-transparent"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter your age"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Yourself *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a brief description about yourself, your values, and what you're looking for in a life partner..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be the first thing potential matches see
                          about you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    Address Information
                  </CardTitle>
                  <CardDescription>
                    Your current and permanent address details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Present Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="presentDivision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dhaka">Dhaka</SelectItem>
                                <SelectItem value="chittagong">
                                  Chittagong
                                </SelectItem>
                                <SelectItem value="sylhet">Sylhet</SelectItem>
                                <SelectItem value="rajshahi">
                                  Rajshahi
                                </SelectItem>
                                <SelectItem value="khulna">Khulna</SelectItem>
                                <SelectItem value="barisal">Barisal</SelectItem>
                                <SelectItem value="rangpur">Rangpur</SelectItem>
                                <SelectItem value="mymensingh">
                                  Mymensingh
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="presentDistrict"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter district" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="presentUpazila"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upazila</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter upazila" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="presentDetails"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Detailed Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="House/Road/Area details..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Permanent Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="permanentDivision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Division</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dhaka">Dhaka</SelectItem>
                                <SelectItem value="chittagong">
                                  Chittagong
                                </SelectItem>
                                <SelectItem value="sylhet">Sylhet</SelectItem>
                                <SelectItem value="rajshahi">
                                  Rajshahi
                                </SelectItem>
                                <SelectItem value="khulna">Khulna</SelectItem>
                                <SelectItem value="barisal">Barisal</SelectItem>
                                <SelectItem value="rangpur">Rangpur</SelectItem>
                                <SelectItem value="mymensingh">
                                  Mymensingh
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="permanentDistrict"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter district" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="permanentUpazila"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upazila</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter upazila" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="permanentDetails"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Detailed Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="House/Road/Area details..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    Educational Background
                  </CardTitle>
                  <CardDescription>
                    Your academic qualifications and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      SSC Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="sscYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passing Year</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2015" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sscGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="commerce">
                                  Commerce
                                </SelectItem>
                                <SelectItem value="arts">Arts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sscResult"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Result</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., GPA 5.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      HSC Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="hscYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passing Year</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2017" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hscGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="commerce">
                                  Commerce
                                </SelectItem>
                                <SelectItem value="arts">Arts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hscResult"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Result</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., GPA 5.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="honours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Higher Education</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Bachelor's, Master's, or other higher education details..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include degree, institution, year, and any special
                          achievements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Family Information */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Family Information
                  </CardTitle>
                  <CardDescription>
                    Details about your family background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Father&apos;s Information
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fatherAlive"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                             <Select
  onValueChange={(value) => field.onChange(value === "alive")}
  defaultValue={field.value ? "alive" : "deceased"}
>
  <FormControl>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="alive">Alive</SelectItem>
    <SelectItem value="deceased">Deceased</SelectItem>
  </SelectContent>
</Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fatherOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Father's occupation"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Mother&apos;s Information
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="motherAlive"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                             <Select
  onValueChange={(value) => field.onChange(value === "alive")}
  defaultValue={field.value ? "alive" : "deceased"}
>
  <FormControl>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="alive">Alive</SelectItem>
    <SelectItem value="deceased">Deceased</SelectItem>
  </SelectContent>
</Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="motherOccupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Mother's occupation"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Siblings Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brothers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Brothers</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sisters"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Sisters</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="siblingsDetails"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Siblings Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief information about your siblings (occupation, marital status, etc.)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Personal & Religious Information */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Personal & Religious Information
                  </CardTitle>
                  <CardDescription>
                    Your personal characteristics and religious practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Religious Practice
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="beard"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Beard</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="sometimes">
                                    Sometimes
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prayer (Salat)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="regular">
                                    Regular (5 times)
                                  </SelectItem>
                                  <SelectItem value="sometimes">
                                    Sometimes
                                  </SelectItem>
                                  <SelectItem value="rarely">Rarely</SelectItem>
                                  <SelectItem value="learning">
                                    Learning
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mahramTravel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Travel with Mahram</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select preference" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="yes">
                                    Yes, always
                                  </SelectItem>
                                  <SelectItem value="depends">
                                    Depends on situation
                                  </SelectItem>
                                  <SelectItem value="no">
                                    No restriction
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Health & Physical
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 5'8&quot; or 173 cm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 70 kg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bodyColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complexion</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select complexion" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="fair">Fair</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bloodGroup"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blood Group</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select blood group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A-">A-</SelectItem>
                                  <SelectItem value="B+">B+</SelectItem>
                                  <SelectItem value="B-">B-</SelectItem>
                                  <SelectItem value="AB+">AB+</SelectItem>
                                  <SelectItem value="AB-">AB-</SelectItem>
                                  <SelectItem value="O+">O+</SelectItem>
                                  <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="health"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Condition</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your general health condition..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="disability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Any Disability</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please mention if you have any disability or special needs..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Marital Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marital Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="never-married">
                                  Never Married
                                </SelectItem>
                                <SelectItem value="divorced">
                                  Divorced
                                </SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
  control={form.control}
  name="childAllow"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Children Allowed</FormLabel>
      <Select
        onValueChange={(value) =>
          field.onChange(value === "yes" ? true : value === "no" ? false : undefined)
        }
        defaultValue={
          field.value === true
            ? "yes"
            : field.value === false
            ? "no"
            : "depends"
        }
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
          <SelectItem value="depends">Depends</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                    
                    </div>
                    <FormField
                      control={form.control}
                      name="whyWantToMarry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why do you want to get married?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your thoughts about marriage and what it means to you..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="futurePlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Future Plans</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your future plans and goals..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Contact Information */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>How others can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+8801712345678" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be used for verification and contact
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional but recommended for account recovery
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Profile (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/yourprofile"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This can help verify your identity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 7: Partner Preferences */}
            {currentStep === 7 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-600" />
                    Partner Preferences
                  </CardTitle>
                  <CardDescription>
                    What you&apos;re looking for in a life partner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Age Range</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 22-28" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complexion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complexion Preference</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select complexion" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="উজ্জ্বল ফর্সা">
                                Very Fair
                              </SelectItem>
                              <SelectItem value="ফর্সা">Fair</SelectItem>
                              <SelectItem value="উজ্জ্বল শ্যামলা">
                                Light Brown
                              </SelectItem>
                              <SelectItem value="শ্যামলা">Brown</SelectItem>
                              <SelectItem value="কালো">Black</SelectItem>
                              <SelectItem value="যেকোনো">Any</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="ssc">
                                SSC or equivalent
                              </SelectItem>
                              <SelectItem value="hsc">
                                HSC or equivalent
                              </SelectItem>
                              <SelectItem value="bachelor">
                                Bachelor&apos;s degree
                              </SelectItem>
                              <SelectItem value="master">
                                Master&apos;s degree
                              </SelectItem>
                              <SelectItem value="phd">PhD or higher</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredMaritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="never-married">
                                Never Married
                              </SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="religiousPractice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Religious Practice</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="very-religious">
                                Very Religious
                              </SelectItem>
                              <SelectItem value="moderately-religious">
                                Moderately Religious
                              </SelectItem>
                              <SelectItem value="learning">Learning</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="physicalAppearance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Appearance Preferences</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your preferences for physical appearance (height, complexion, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalQualities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Qualities</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What other qualities are important to you in a life partner?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mention personality traits, values, lifestyle
                          preferences, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>All changes are saved automatically</span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < 7 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-emerald-500 to-pink-600 hover:from-emerald-600 hover:to-pink-700 flex-1 sm:flex-none"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex gap-2 flex-1 sm:flex-none">
                    <Button type="button" variant="outline">
                      Preview Profile
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-pink-600 hover:from-emerald-600 hover:to-pink-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
