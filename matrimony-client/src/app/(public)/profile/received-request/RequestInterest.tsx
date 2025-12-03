import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, Home, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Address {
  address: string;
  district: string;
  division: string;
  upazila: string;
}

interface SenderBiodata {
  _id: string;
  name: string;
  age: number;
  gender: string;
  address: {
    present: Address;
  };
}

interface InterestItem {
  senderBiodata: SenderBiodata;
  status: string;
  createdAt: string;
  _id: string;
}

interface InterestCardProps {
  interest: InterestItem;
}

const InterestCard: React.FC<InterestCardProps> = ({ interest }) => {
  const { senderBiodata } = interest;
  const { name, age, gender, address, _id } = senderBiodata;
  const presentAddress = address.present;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20 hover:scale-[1.02]">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center ring-2 ring-emerald-200 dark:ring-emerald-800">
              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white text-balance">
                {name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs"
                >
                  {gender}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {age} years
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Present Address
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-pretty">
                {presentAddress.address}
              </p>
            </div>
          </div>

          {/* Location Details */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Location Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Upazila
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {presentAddress.upazila}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    District
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {presentAddress.district}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Division
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {presentAddress.division}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-100 dark:border-emerald-900/30">
          <Link href={`/biodatas/${_id}`} className="block">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white transition-all duration-200 group-hover:shadow-md"
              size="sm"
            >
              <span>View Full Biodata</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Hover Effect Indicator */}
        <div className="mt-4">
          <div className="w-full h-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestCard;
