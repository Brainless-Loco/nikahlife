export const profileTranslation = {
  en: {
    // Navigation
    mySendRequests: "My Send Requests",
    receivedRequests: "Received Requests",
    myInterests: "Shortlist",
    ignoreList: "Ignore List",

    // Profile
    profile: "Profile",
    name: "Name",
    email: "Email",
    phone: "Phone",
    gender: "Gender",
    subscription: "Subscription",
    profileViewLimit: "Profile View Limit",
    subscriptionStatus: "Subscription Status",
    subscriptionType: "Subscription Type",
    duration: "Duration",
    startDate: "Start Date",
    endDate: "End Date",

    // Actions
    viewProfile: "View Profile",
    editProfile: "Edit Profile",
    accept: "Accept",
    decline: "Decline",
    send: "Send",
    cancel: "Cancel",

    // Status
    active: "Active",
    premium: "Premium",
    verified: "Verified",
    notVerified: "Not Verified",

    // Common
    loading: "Loading...",
    noData: "No data available",
    months: "months",

    // Dashboard
    dashboard: "Profile",
    welcome: "Welcome",
    totalRequests: "Total Requests",
    pendingRequests: "Pending Requests",
    acceptedRequests: "Accepted Requests",
  },
  bn: {
    // Navigation
    mySendRequests: "আমার পাঠানো অনুরোধ",
    receivedRequests: "প্রাপ্ত অনুরোধ",
    myInterests: "আমার আগ্রহ",
    ignoreList: "উপেক্ষিত তালিকা",

    // Profile
    profile: "প্রোফাইল",
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    gender: "লিঙ্গ",
    subscription: "সাবস্ক্রিপশন",
    profileViewLimit: "প্রোফাইল দেখার সীমা",
    subscriptionStatus: "সাবস্ক্রিপশনের অবস্থা",
    subscriptionType: "সাবস্ক্রিপশনের ধরন",
    duration: "সময়কাল",
    startDate: "শুরুর তারিখ",
    endDate: "শেষের তারিখ",

    // Actions
    viewProfile: "প্রোফাইল দেখুন",
    editProfile: "প্রোফাইল সম্পাদনা",
    accept: "গ্রহণ করুন",
    decline: "প্রত্যাখ্যান করুন",
    send: "পাঠান",
    cancel: "বাতিল",

    // Status
    active: "সক্রিয়",
    premium: "প্রিমিয়াম",
    verified: "যাচাইকৃত",
    notVerified: "যাচাই করা হয়নি",

    // Common
    loading: "লোড হচ্ছে...",
    noData: "কোন তথ্য নেই",
    months: "মাস",

    // Dashboard
    dashboard: "ড্যাশবোর্ড",
    welcome: "স্বাগতম",
    totalRequests: "মোট অনুরোধ",
    pendingRequests: "অপেক্ষমাণ অনুরোধ",
    acceptedRequests: "গৃহীত অনুরোধ",
  },
};

export type TranslationKey = keyof typeof profileTranslation.en;
