"use client"

import Link from "next/link"
import { Heart, Home, ArrowLeft, HeartHandshake, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/10 to-pink-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto text-center space-y-12">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Nikah
            </span>
            <span className="text-sm text-emerald-500/70 font-medium -mt-1">Find Your Perfect Match</span>
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-emerald-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-8 shadow-2xl">
              <HeartHandshake className="h-16 w-16 md:h-20 md:w-20 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! This Page Went on a
            <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Different Love Journey
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            It seems like the page you&apos;re looking for has found its perfect match elsewhere. Don&apos;t worry, there are
            plenty of other amazing pages waiting to connect with you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-emerald-200 transition-all duration-300 font-semibold px-8 py-4 text-lg rounded-xl group">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link href="/biodatas">
            <Button
              variant="outline"
              className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 font-semibold px-8 py-4 text-lg rounded-xl group bg-white/80 backdrop-blur-sm"
            >
              <Users className="mr-2 h-5 w-5" />
              Browse Profiles
            </Button>
          </Link>
        </div>
        {/* Fun Message */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-emerald-100">
          <p className="text-gray-700 italic">
            💕 Sometimes the best connections happen when you least expect them. While you&apos;re here, why not explore
            some amazing profiles or read success stories from couples who found their happily ever after!
          </p>
        </div>

        {/* Back Link */}
        <div className="pt-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Take me back to safety
          </Link>
        </div>
      </div>
    </div>
  )
}