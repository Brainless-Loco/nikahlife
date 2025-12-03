import Link from "next/link";
import { Button } from "../ui/button";

export default function UnderDevelopment() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200">
      <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-md">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-pink-500 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800">
          Page Under Development
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-600">
          We’re working hard to bring you something amazing. Please check back
          soon!
        </p>

        {/* Launch info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-pink-600 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Launching Soon</span>
        </div>

        {/* Back to home button */}
        <Link href="/">
          <Button className="mt-8 inline-block rounded-xl bg-pink-500 px-6 py-2 text-white font-semibold shadow-md hover:bg-pink-600 transition">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
