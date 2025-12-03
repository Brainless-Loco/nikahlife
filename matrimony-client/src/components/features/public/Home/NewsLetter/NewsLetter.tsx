"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeTranslation } from "@/dictionary/subscription";
import { useLanguage } from "@/hooks/use-language";
import axios from "axios";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const NewsLetter = () => {
  const { language } = useLanguage();
  const t = subscribeTranslation[language];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscriber`, {
        email,
      });

      toast.success("🎉 Successfully subscribed!");
      setEmail("");
    } catch (error) {
      toast.error("❌ Subscription failed! Try again.");
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8">
          <form onSubmit={handleEmailSubmit}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg">
                  <Mail className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-sm">
                {t.title}
              </h3>
              <p className="text-emerald-100 dark:text-emerald-50 mb-8 text-lg drop-shadow-sm">
                {t.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  required
                  disabled={loading}
                  className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/15 text-white placeholder:text-emerald-100 dark:placeholder:text-emerald-50 focus:border-white/40 dark:focus:border-white/30 focus:bg-white/15 dark:focus:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-200"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-white dark:bg-gray-100 text-emerald-600 dark:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-white hover:text-emerald-700 dark:hover:text-emerald-800 font-semibold px-8 rounded-xl whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200 border-0 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t.button
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
