import { Check, Heart, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { pricingTranslation } from "@/dictionary/pricing";

export default function PricingSection() {
  const { language } = useLanguage();
  const t = pricingTranslation[language];

  const plans = [
    {
      name: t.free,
      price: t.freePrice,
      period: t.freeDuration,
      description: t.freeDesc,
      icon: Heart,
      features: [
        t.freeFeatures?.create,
        t.freeFeatures?.ignore,
        t.freeFeatures?.shortlist,
        t.freeFeatures?.view,
      ],
      buttonText: t.freeBtn,
      popular: false,
      buttonVariant: "outline" as const,
    },
    {
      name: t.premium,
      price: t.premiumPrice,
      period: t.premiumDuration,
      description: t.premiumDesc,
      icon: Star,
      features: [
        t.premiumFeatures?.freeFeatures,
        t.premiumFeatures?.featuring,
        t.premiumFeatures?.contactView,
        t.premiumFeatures?.interest,
      ],
      buttonText: t.premiumBtn,
      popular: true,
      buttonVariant: "default" as const,
    },
    {
      name: t.vip,
      price: t.vipPrice,
      period: t.vipDuration,
      description: t.vipDesc,
      icon: Crown,
      features: [
        t.vipFeatures?.premiumFeatures,
        t.vipFeatures?.unlimited,
        t.vipFeatures?.support,
        t.vipFeatures?.duration,
      ],
      buttonText: t.vipBtn,
      popular: false,
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-emerald-500 dark:border-emerald-400 shadow-lg dark:shadow-emerald-500/20 scale-105 bg-white dark:bg-gray-800"
                    : "border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-emerald-500/10"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 dark:bg-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-gray-900 px-4 py-1 shadow-lg">
                    Popular 🔥
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
                      plan.popular
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-emerald-100 dark:bg-emerald-900/50"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        plan.popular
                          ? "text-white dark:text-gray-900"
                          : "text-emerald-500 dark:text-emerald-400"
                      }`}
                    />
                  </div>

                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.period}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={
                      plan.name === "VIP"
                        ? "/payment?plan=vip"
                        : plan.name === "Premium"
                        ? "/payment?plan=premium"
                        : "/payment"
                    }
                  >
                    <Button
                      className={`w-full py-3 text-base font-semibold transition-all duration-200 cursor-pointer ${
                        plan.buttonVariant === "default"
                          ? "bg-emerald-500 dark:bg-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-gray-900 shadow-lg hover:shadow-xl dark:shadow-emerald-400/20"
                          : "border-2 border-emerald-500 dark:border-emerald-400 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-gray-900 bg-transparent dark:bg-transparent"
                      }`}
                      variant={plan.buttonVariant}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t.contact}</p>
          <a
            href="https://wa.me/8801721972807"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="border-emerald-500 dark:border-emerald-400 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-gray-900 bg-transparent dark:bg-transparent transition-all duration-200 cursor-pointer"
            >
              {t.supportBtn}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
