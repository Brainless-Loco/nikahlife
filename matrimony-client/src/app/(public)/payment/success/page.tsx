"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Success Icon */}
      <CheckCircle className="h-20 w-20 text-green-500 mb-4" />

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Payment Successful
      </h1>

      {/* Message */}
      <p className="text-gray-600 mb-6 text-center">
        Thank you! Your payment was processed successfully.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => router.push("/profile")}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Go to My Profile
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
