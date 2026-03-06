import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage = "en" | "si" | "ta";

const LANGUAGE_KEY = "agrolink.app.language";

const localeMap: Record<AppLanguage, string> = {
  en: "en-LK",
  si: "si-LK",
  ta: "ta-LK",
};

const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    "common.appName": "AgroLink",
    "common.tagline": "Future of Agri-Finance",
    "common.language": "Language",
    "common.english": "English",
    "common.sinhala": "Sinhala",
    "common.tamil": "Tamil",
    "common.ok": "OK",
    "common.cancel": "Cancel",
    "common.farmer": "Farmer",
    "common.investor": "Investor",
    "common.low": "Low",
    "common.medium": "Medium",
    "common.high": "High",
    "common.recently": "Recently",
    "common.recentlyUpdated": "Recently updated",
    "common.updated": "Updated",
    "common.memberSince": "Member since {date}",
    "common.verified": "Verified",
    "common.fundingProgress": "Funding Progress",
    "common.raisedValue": "Raised: {amount}",
    "common.goalValue": "Goal: {amount}",
    "common.add": "Add",
    "common.save": "Save",
    "common.new": "New",
    "common.languageShort": "EN",
    "tabs.home": "Home",
    "tabs.dashboard": "Dashboard",
    "tabs.profile": "Profile",
    "splash.initializing": "Initializing...",
    "splash.loading": "Loading...",
    "login.welcomeBack": "Welcome Back",
    "login.signInToManage": "Sign in to manage your investments",
    "login.quickDemoAccess": "Quick Demo Access",
    "login.threeFarmerDemoAccounts": "Three farmer demo accounts",
    "login.threeInvestorDemoAccounts": "Three investor demo accounts",
    "login.demoFarmer": "Demo Farmer",
    "login.demoInvestor": "Demo Investor",
    "login.emailAddress": "Email Address",
    "login.emailPlaceholder": "sample@email.com",
    "login.password": "Password",
    "login.stayLoggedIn": "Stay logged in",
    "login.forgotPassword": "Forgot Password?",
    "login.login": "Login",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign Up",
    "login.enterCredentials": "Enter your email and password to continue.",
    "login.signedIn": "Signed in",
    "login.loggedInWith": "Logged in with {source} account.",
    "login.backend": "backend",
    "login.demo": "demo",
    "login.unableToSignIn": "Unable to sign in right now.",
    "login.quickUnlockTitle": "Quick unlock",
    "login.quickUnlockMessage":
      "Signed in as {name}. Use biometrics to open your saved session.",
    "login.quickUnlockButton": "Unlock with biometrics",
    "login.quickUnlockUnavailable":
      "Biometric quick unlock is enabled for this account, but this device cannot complete a biometric check right now.",
    "login.quickUnlockFailed":
      "Biometric unlock failed. You can still sign in with email and password.",
    "signup.createAccount": "Create Account",
    "signup.fullName": "Full Name",
    "signup.fullNamePlaceholder": "Your full name",
    "signup.email": "Email",
    "signup.password": "Password",
    "signup.confirmPassword": "Confirm Password",
    "signup.farmerId": "Farmer ID",
    "signup.nic": "NIC Number",
    "signup.verificationUploads": "Verification Uploads",
    "signup.uploadHint":
      "Upload the Grama Sevaka letter before creating the account.",
    "signup.gramaSevakaLetter": "Grama Sevaka Letter",
    "signup.uploadPdfOrImage": "Upload PDF or image",
    "signup.remove": "Remove",
    "signup.signUp": "Sign Up",
    "signup.alreadyHaveAccount": "Already have an account?",
    "signup.login": "Login",
    "signup.missingDetailsTitle": "Missing details",
    "signup.missingDetailsMessage":
      "Please complete the required fields first.",
    "signup.passwordMismatchTitle": "Password mismatch",
    "signup.passwordMismatchMessage":
      "Password and confirm password must match.",
    "signup.verificationRequiredTitle": "Verification required",
    "signup.verificationRequiredMessage":
      "Farmers must enter a farmer ID and upload the required document.",
    "signup.signupFailed": "Signup failed",
    "signup.unableToCreateAccount": "Unable to create account right now.",
    "signup.uploadFailed": "Upload failed",
    "signup.uploadFailedMessage":
      "Unable to pick the Grama Sevaka letter right now. Please try again.",
    "home.welcomeFarmer": "Welcome back farmer 🌾",
    "home.welcomeInvestor": "Investor insights ready 📈",
    "home.searchFarmer": "Search crops, equipment...",
    "home.searchInvestor": "Search farmers, projects...",
    "home.searchHintTitle": "Search hint",
    "home.searchHintFarmer":
      "Use the dashboard to manage only your own investment requests.",
    "home.searchHintInvestor":
      "Use the dashboard to review and invest in active farmer requests.",
    "home.roleBannerFarmer":
      "Private farmer view: only your own requests appear on this home feed.",
    "home.roleBannerInvestor":
      "Investor marketplace: you are seeing active requests from multiple farmers.",
    "home.lightRainExpected": "Light rain expected",
    "home.humidity": "Humidity",
    "home.soilTemp": "Soil Temp",
    "home.wind": "Wind",
    "home.activeCrops": "Active Crops",
    "home.investors": "Investors",
    "home.fundedToday": "Funded Today",
    "home.avgReturn": "Avg Return",
    "home.openInvestmentRequests": "Open Investment Requests",
    "home.yourActiveRequests": "Your Active Requests",
    "home.seeAll": "See all",
    "home.noPersonalRequests": "No personal requests yet",
    "home.noFarmerRequests": "No farmer requests live yet",
    "home.noPersonalRequestsText":
      "Farmers only see their own requests here. Create one from the dashboard.",
    "home.noFarmerRequestsText":
      "Investors can review multiple farmer requests here once they are created.",
    "home.openDashboard": "Open Dashboard",
    "home.viewDashboard": "View Dashboard",
    "home.investNow": "Invest Now",
    "home.manageRequest": "Manage Request",
    "dashboard.farmerDashboard": "Farmer Dashboard",
    "dashboard.investorDashboard": "Investor Dashboard",
    "dashboard.farmerSubtitle":
      "See the investors backing your farm and create investment requests that investors can review.",
    "dashboard.investorSubtitle":
      "See farmer investment requests, use AI before investing, and fund requests directly from this screen.",
    "dashboard.roleBannerFarmer":
      "Private farmer view: only your own requests are shown here.",
    "dashboard.roleBannerInvestor":
      "Investor marketplace: all live farmer requests are shown here.",
    "dashboard.activeFields": "Active Fields",
    "dashboard.pendingFunding": "Pending Funding",
    "dashboard.investorsVisible": "Investors Visible",
    "dashboard.liveDeals": "Live Deals",
    "dashboard.farmersSeekingCapital": "Farmers Seeking Capital",
    "dashboard.expectedReturn": "Expected Return",
    "dashboard.investmentRequests": "Investment Requests",
    "dashboard.farmerOpportunityFeed": "Farmer Opportunity Feed",
    "dashboard.farmerPanelText":
      "Use the existing dashboard to submit requests and track what investors have already funded, while keeping your connected investors visible below.",
    "dashboard.investorPanelText":
      "These live requests can be reviewed, checked with AI, and funded directly from the existing dashboard UI.",
    "dashboard.createInvestmentRequest": "Create Investment Request",
    "dashboard.createInvestmentRequestSubtitle":
      "Add a request so investors can review and fund it.",
    "dashboard.crop": "Crop",
    "dashboard.location": "Location",
    "dashboard.amountNeeded": "Amount needed",
    "dashboard.requestSummaryPlaceholder":
      "What will this investment be used for?",
    "dashboard.submitRequest": "Submit Request",
    "dashboard.yourLiveRequests": "Your Live Requests",
    "dashboard.requestsOpenForInvestment": "Requests Open For Investment",
    "dashboard.loadingRoleData": "Loading role data...",
    "dashboard.noRequestsCreated": "No requests created yet",
    "dashboard.noInvestmentRequestsAvailable":
      "No investment requests available",
    "dashboard.noRequestsCreatedText":
      "Create your own investment request above. Only your requests appear in this view.",
    "dashboard.noInvestmentRequestsAvailableText":
      "Investor accounts can review and invest in all live farmer requests from here.",
    "dashboard.investorsBackingYou": "Investors Backing You",
    "dashboard.avgReturn": "Avg Return",
    "dashboard.projects": "Projects",
    "dashboard.investorConnected": "Investor already connected to your farm",
    "dashboard.raised": "Raised",
    "dashboard.need": "Need",
    "dashboard.pastRate": "Past Rate",
    "dashboard.funded": "{progress}% funded",
    "dashboard.askAi": "Ask AI",
    "dashboard.investNow": "Invest Now",
    "dashboard.yourLiveInvestmentRequest":
      "This is your live investment request",
    "dashboard.delete": "Delete",
    "dashboard.aiInsight": "AI Investment Insight",
    "dashboard.preparingAi": "Preparing AI response...",
    "dashboard.aiUnavailable": "AI insight unavailable",
    "dashboard.aiTryAgain": "Try again once the backend is reachable.",
    "dashboard.aiNoHistoricalRate": "No historical rate could be loaded.",
    "dashboard.aiConnectionIssue":
      "Connection issue prevented a fresh dummy assessment.",
    "dashboard.aiUnknownError": "Unknown AI request error.",
    "dashboard.previousRates": "Previous rates",
    "dashboard.outlook": "Outlook",
    "dashboard.confidence": "Confidence",
    "dashboard.requestSent": "Request has been sent",
    "dashboard.requestSentMessage":
      "Your investment request was submitted successfully and is now visible to investors.",
    "dashboard.chooseInvestmentAmount": "Choose Investment Amount",
    "dashboard.chooseInvestmentAmountText":
      "Enter how much you want to invest in this farmer request.",
    "dashboard.amountInLkr": "Amount in LKR",
    "dashboard.confirmInvestment": "Confirm Investment",
    "dashboard.missingDetails": "Missing details",
    "dashboard.missingDetailsMessage":
      "Enter crop, location, amount, and summary before submitting the request.",
    "dashboard.invalidCrop": "Invalid crop",
    "dashboard.invalidCropMessage": "Crop name must be at least 2 characters.",
    "dashboard.invalidLocation": "Invalid location",
    "dashboard.invalidLocationMessage":
      "Location must be at least 2 characters.",
    "dashboard.invalidSummary": "Invalid summary",
    "dashboard.invalidSummaryMessage":
      "Summary must be at least 10 characters so investors can understand the request.",
    "dashboard.invalidAmount": "Invalid amount",
    "dashboard.invalidAmountMessage": "Enter an amount of at least LKR 1,000.",
    "dashboard.invalidRequestAmountMax":
      "Amount must be LKR 10,000,000 or less.",
    "dashboard.invalidInvestmentAmountMax":
      "Investment amount must be LKR 1,000,000 or less.",
    "dashboard.unableToSubmitRequest": "Unable to submit request",
    "dashboard.unknownRequestError": "Unknown request error.",
    "dashboard.investmentRecorded": "Investment recorded",
    "dashboard.investmentRecordedMessage":
      "LKR {amount} has been added to this request.",
    "dashboard.investmentFailed": "Investment failed",
    "dashboard.unknownInvestmentError": "Unknown investment error.",
    "dashboard.deleteRequest": "Delete request",
    "dashboard.deleteRequestMessage":
      "This will remove the request from the active database and from the investor feed.",
    "dashboard.requestDeleted": "Request deleted",
    "dashboard.requestDeletedMessage":
      "The request was removed from your account and the shared database.",
    "dashboard.deleteFailed": "Delete failed",
    "dashboard.unknownDeleteError": "Unknown delete error.",
    "dashboard.sessionExpired": "Session expired",
    "dashboard.signIn": "Sign in",
    "profile.myProfile": "My Profile",
    "profile.roleFarmer": "Farmer",
    "profile.roleInvestor": "Investor",
    "profile.profileStrength": "Profile Strength: {percent}%",
    "profile.profileStrengthTitle": "Profile Strength",
    "profile.completeProfile": "Complete your profile to increase trust.",
    "profile.accountSettings": "Account Settings",
    "profile.editPersonalDetails": "Edit Personal Details",
    "profile.securityPassword": "Security & Password",
    "profile.paymentMethods": "Payment Methods",
    "profile.alertsCenter": "Alerts Center",
    "profile.support": "Support",
    "profile.helpSupport": "Help & Support",
    "profile.termsConditions": "Terms & Conditions",
    "profile.logout": "Log Out",
    "profile.languageTitle": "Select Language",
    "profile.languageDescription":
      "Choose the app language. The visible app screens will update immediately.",
    "profile.quickUnlockTitle": "Biometric Quick Unlock",
    "profile.quickUnlockDescription":
      "Re-open the app with fingerprint or face unlock before restoring your session.",
    "profile.quickUnlockUnavailable":
      "Biometric quick unlock is unavailable on this device.",
    "profile.quickUnlockEnabledTitle": "Quick unlock enabled",
    "profile.quickUnlockEnabledMessage":
      "Biometric unlock will be required before your saved session opens.",
    "profile.quickUnlockDisabledTitle": "Quick unlock disabled",
    "profile.quickUnlockDisabledMessage":
      "Saved sessions will open normally without a biometric check.",
    "profile.quickUnlockFailedTitle": "Unable to enable quick unlock",
    "profile.quickUnlockFailedMessage":
      "Complete a successful biometric check to enable quick unlock.",
    "profile.paymentMethodsTitle": "Payment methods",
    "profile.paymentMethodsMessage":
      "Bank account management is available from Settings.",
    "profile.helpSupportTitle": "Help & Support",
    "profile.helpSupportMessage":
      "Contact support@agrolink.app for account or funding help.",
    "profile.termsTitle": "Terms & Conditions",
    "profile.termsMessage":
      "Legal and privacy details are available in the app documentation.",
    "profile.editTitle": "Edit Profile",
    "profile.editTapCamera": "Tap camera to upload",
    "profile.editPersonalInfo": "Personal Information",
    "profile.editPersonalInfoSub": "Legal details for verification",
    "profile.editFirstName": "First Name",
    "profile.editFirstNamePlaceholder": "e.g. Kasun",
    "profile.editLastName": "Last Name",
    "profile.editLastNamePlaceholder": "e.g. Perera",
    "profile.editDisplayName": "Display Name",
    "profile.editDisplayNamePlaceholder": "How you appear to others",
    "profile.editNicNumber": "NIC Number",
    "profile.editNicPlaceholder": "e.g. 991234567V",
    "profile.editContactDetails": "Contact Details",
    "profile.editContactDetailsSub": "For investor communications",
    "profile.editAddress": "Address",
    "profile.editAddressPlaceholder": "e.g. 12 Kandy Rd, Colombo",
    "profile.editPhoneNumber": "Phone Number",
    "profile.editPhonePlaceholder": "07X XXX XXXX",
    "profile.editSkillsTitle": "Skills & Expertise",
    "profile.editSkillsSub": "Your farming strengths",
    "profile.editQuickAdd": "Quick Add:",
    "profile.editSkillPlaceholder": "Add a skill...",
    "profile.editSaveProfile": "Save Profile",
    "profile.editSaveSuccessTitle": "Success",
    "profile.editSaveSuccessMessage": "Profile updated successfully!",
    "profile.editSaveErrorTitle": "Error",
    "profile.editSaveErrorMessage": "Failed to update profile.",
    "profile.editFirstNameRequired": "First name is required",
    "profile.editLastNameRequired": "Last name is required",
    "profile.editDisplayNameRequired": "Display name is required",
    "profile.editNicRequired": "NIC number is required",
    "profile.editAddressRequired": "Address is required",
    "profile.editPhoneInvalid": "Enter valid 10-digit number",
    "profile.securityTitle": "Security Settings",
    "profile.securitySubtitle":
      "Change your password to keep your account safe",
    "profile.securityLastChanged": "Last changed: 30 days ago",
    "profile.securityUpdateCredentials": "Update Credentials",
    "profile.securityCurrentPassword": "Current Password",
    "profile.securityNewPassword": "New Password",
    "profile.securityConfirmNewPassword": "Confirm New Password",
    "profile.securityPasswordStrength": "Password strength",
    "profile.securityWeak": "Weak",
    "profile.securityFair": "Fair",
    "profile.securityGood": "Good",
    "profile.securityStrong": "Strong",
    "profile.securityReqLength": "At least 8 characters",
    "profile.securityReqUpper": "One uppercase letter (A-Z)",
    "profile.securityReqNumber": "One number (0-9)",
    "profile.securityReqSpecial": "One special character (!@#...)",
    "profile.securityCurrentRequired": "Current password is required",
    "profile.securityNewRequired": "New password is required",
    "profile.securityRequirementsError":
      "Password does not meet all requirements",
    "profile.securityConfirmRequired": "Please confirm your new password",
    "profile.securityMismatch": "Passwords do not match",
    "profile.securityMatch": "Passwords match",
    "profile.securityAgreeTitle": "I understand",
    "profile.securityAgreeText":
      "My current password will no longer work after this change. I will need to use the new password to log in.",
    "profile.securityAgreeRequired":
      "You must acknowledge this change before continuing",
    "profile.securityUpdatedTitle": "Password Updated",
    "profile.securityUpdatedMessage":
      "Your new password is active. Please use it next time you log in.",
    "profile.securityErrorTitle": "Error",
    "profile.securityErrorMessage": "Something went wrong. Please try again.",
    "profile.securityUpdatePassword": "Update Password",
    "profile.securityCancelGoBack": "Cancel & Go Back",
    "profile.investorRoleLine": "Farmer · ID: 20321212",
    "profile.investorActiveCrops": "Active Crops",
    "profile.investorTotalInvested": "Total Invested",
    "profile.investorRating": "Rating",
    "profile.investorNeedsWork": "Needs work",
    "profile.investorGettingThere": "Getting there",
    "profile.investorLookingGreat": "Looking great!",
    "profile.investorTipAddPhoto": "Add a photo",
    "profile.investorTipVerifyNic": "Verify NIC",
    "profile.investorTipAddBank": "Add bank account",
    "profile.investorTipAddSkills": "Add 3+ skills",
    "profile.investorTipCompleteAddress": "Complete address",
    "profile.investorNext": "Next:",
    "profile.investorEditSub": "Name, NIC, address and more",
    "profile.investorSecuritySub": "2FA, password, login history",
    "profile.investorPaymentSub": "Add or manage bank accounts",
    "profile.investorSupportSub": "FAQs, live chat, report an issue",
    "profile.investorTermsSub": "Privacy policy and legal terms",
    "alerts.title": "Alerts",
    "alerts.subtitle":
      "Stay on top of account activity and marketplace changes.",
    "alerts.markAllRead": "Mark all as read",
    "alerts.emptyTitle": "No alerts right now",
    "alerts.emptyMessage":
      "New funding activity and account reminders will appear here.",
    "alerts.retry": "Retry",
    "alerts.offlineTitle": "You're offline",
    "alerts.offlineMessage":
      "Reconnect to refresh alerts and latest funding activity.",
    "alerts.securityTitle": "Security checkup",
    "alerts.securityMessage":
      "Biometric quick unlock can speed up re-entry while keeping this device protected.",
    "alerts.farmerFirstRequestTitle": "Create your first request",
    "alerts.farmerFirstRequestMessage":
      "Investors will start seeing your farm once a funding request is live.",
    "alerts.farmerFundingProgressTitle": "{crop} request is getting funded",
    "alerts.farmerFundingProgressMessage":
      "Raised {raised} out of {goal}. Open the dashboard for the latest investor activity.",
    "alerts.farmerRequestLiveTitle": "{crop} request is live",
    "alerts.farmerRequestLiveMessage":
      "Your request is visible to investors. Keep the summary updated if plans change.",
    "alerts.investorOpportunityTitle": "{crop} opportunity is open",
    "alerts.investorOpportunityMessage":
      "{farmer} is seeking {goal} in {location}. Review the request before the round closes.",
    "alerts.investorQuietTitle": "Marketplace is quiet",
    "alerts.investorQuietMessage":
      "No farmer requests are live yet. Check back soon or pull to refresh.",
    "alerts.updatedNow": "Just now",
    "alerts.openDashboard": "Open dashboard",
  },
  si: {
    "common.appName": "AgroLink",
    "common.tagline": "කෘෂි මූල්‍යකරණයේ අනාගතය",
    "common.language": "භාෂාව",
    "common.english": "ඉංග්‍රීසි",
    "common.sinhala": "සිංහල",
    "common.tamil": "දෙමළ",
    "common.ok": "හරි",
    "common.cancel": "අවලංගු කරන්න",
    "common.farmer": "ගොවියා",
    "common.investor": "ආයෝජකයා",
    "common.low": "අඩු",
    "common.medium": "මධ්‍යම",
    "common.high": "ඉහළ",
    "common.recently": "මෑතකදී",
    "common.recentlyUpdated": "මෑතකදී යාවත්කාලීන කරන ලදී",
    "common.updated": "යාවත්කාලීන කරන ලදී",
    "common.memberSince": "සාමාජිකයා වූ දිනය {date}",
    "common.verified": "සත්‍යාපිතයි",
    "common.fundingProgress": "අරමුදල් ප්‍රගතිය",
    "common.raisedValue": "ලැබූ මුදල: {amount}",
    "common.goalValue": "ඉලක්කය: {amount}",
    "common.add": "එක් කරන්න",
    "common.save": "සුරකින්න",
    "common.new": "නව",
    "common.languageShort": "සි",
    "tabs.home": "මුල් පිටුව",
    "tabs.dashboard": "පාලක පුවරුව",
    "tabs.profile": "පැතිකඩ",
    "splash.initializing": "ආරම්භ කරමින්...",
    "splash.loading": "පූරණය වෙමින්...",
    "login.welcomeBack": "නැවතත් සාදරයෙන් පිළිගනිමු",
    "login.signInToManage": "ඔබගේ ආයෝජන කළමනාකරණය කිරීමට පුරන්න",
    "login.quickDemoAccess": "වේගවත් ඩෙමෝ ප්‍රවේශය",
    "login.threeFarmerDemoAccounts": "ඩෙමෝ ගොවි ගිණුම් 3ක්",
    "login.threeInvestorDemoAccounts": "ඩෙමෝ ආයෝජක ගිණුම් 3ක්",
    "login.demoFarmer": "ඩෙමෝ ගොවියා",
    "login.demoInvestor": "ඩෙමෝ ආයෝජකයා",
    "login.emailAddress": "ඊමේල් ලිපිනය",
    "login.emailPlaceholder": "sample@email.com",
    "login.password": "මුරපදය",
    "login.stayLoggedIn": "ලොග් වී සිටින්න",
    "login.forgotPassword": "මුරපදය අමතකද?",
    "login.login": "පුරන්න",
    "login.noAccount": "ගිණුමක් නැද්ද?",
    "login.signUp": "ලියාපදිංචි වන්න",
    "login.enterCredentials": "ඉදිරියට යාමට ඔබගේ ඊමේල් හා මුරපදය ඇතුළත් කරන්න.",
    "login.signedIn": "සාර්ථකව පිවිසියා",
    "login.loggedInWith": "{source} ගිණුමෙන් පිවිසියා.",
    "login.backend": "පසුපස පද්ධති",
    "login.demo": "ඩෙමෝ",
    "login.unableToSignIn": "දැනට පුරනය වීමට නොහැක.",
    "login.quickUnlockTitle": "වේගවත් අගුළු හැරීම",
    "login.quickUnlockMessage":
      "{name} ලෙස පුරනය වී ඇත. ඔබගේ සුරකින ලද සැසිය විවෘත කිරීමට ජෛව සත්‍යාපනය භාවිතා කරන්න.",
    "login.quickUnlockButton": "ජෛව සත්‍යාපනයෙන් අගුළු හරින්න",
    "login.quickUnlockUnavailable":
      "මෙම ගිණුම සඳහා ජෛව අගුළු හැරීම සක්‍රීය කර ඇති නමුත් මේ මොහොතේ මෙම උපාංගයට ජෛව පරීක්ෂාව සම්පූර්ණ කළ නොහැක.",
    "login.quickUnlockFailed":
      "ජෛව අගුළු හැරීම අසාර්ථකයි. ඔබට තවමත් ඊමේල් සහ මුරපදය භාවිතා කර පුරනය විය හැක.",
    "signup.createAccount": "ගිණුමක් සාදන්න",
    "signup.fullName": "සම්පූර්ණ නම",
    "signup.fullNamePlaceholder": "ඔබගේ සම්පූර්ණ නම",
    "signup.email": "ඊමේල්",
    "signup.password": "මුරපදය",
    "signup.confirmPassword": "මුරපදය තහවුරු කරන්න",
    "signup.farmerId": "ගොවි හැඳුනුම් අංකය",
    "signup.nic": "ජා.හැ. අංකය",
    "signup.verificationUploads": "සත්‍යාපන උඩුගත කිරීම්",
    "signup.uploadHint": "ගිණුම සෑදීමට පෙර ග්‍රාම සේවක ලිපිය උඩුගත කරන්න.",
    "signup.gramaSevakaLetter": "ග්‍රාම සේවක ලිපිය",
    "signup.uploadPdfOrImage": "PDF හෝ රූපයක් උඩුගත කරන්න",
    "signup.remove": "ඉවත් කරන්න",
    "signup.signUp": "ලියාපදිංචි වන්න",
    "signup.alreadyHaveAccount": "දැනටමත් ගිණුමක් තිබේද?",
    "signup.login": "පුරන්න",
    "signup.missingDetailsTitle": "තොරතුරු අඩුයි",
    "signup.missingDetailsMessage":
      "අවශ්‍ය තොරතුරු පුරවා පසුව නැවත උත්සාහ කරන්න.",
    "signup.passwordMismatchTitle": "මුරපද නොගැළපේ",
    "signup.passwordMismatchMessage": "මුරපදය සහ තහවුරු මුරපදය එකම විය යුතුය.",
    "signup.verificationRequiredTitle": "සත්‍යාපනය අවශ්‍යයි",
    "signup.verificationRequiredMessage":
      "ගොවීන් ගොවි හැඳුනුම් අංකය ඇතුළත් කර අවශ්‍ය ලේඛනය උඩුගත කළ යුතුය.",
    "signup.signupFailed": "ලියාපදිංචි වීම අසාර්ථකයි",
    "signup.unableToCreateAccount": "දැනට ගිණුමක් සාදන්න නොහැක.",
    "signup.uploadFailed": "උඩුගත කිරීම අසාර්ථකයි",
    "signup.uploadFailedMessage":
      "දැනට ග්‍රාම සේවක ලිපිය තෝරාගත නොහැක. කරුණාකර නැවත උත්සාහ කරන්න.",
    "home.welcomeFarmer": "නැවතත් සාදරයෙන් පිළිගනිමු ගොවියානි 🌾",
    "home.welcomeInvestor": "ආයෝජක තොරතුරු සූදානම් 📈",
    "home.searchFarmer": "බෝග, උපකරණ සොයන්න...",
    "home.searchInvestor": "ගොවීන්, ව්‍යාපෘති සොයන්න...",
    "home.searchHintTitle": "සෙවුම් ඉඟිය",
    "home.searchHintFarmer":
      "ඔබගේම ආයෝජන ඉල්ලීම් කළමනාකරණය කිරීමට පාලක පුවරුව භාවිතා කරන්න.",
    "home.searchHintInvestor":
      "ක්‍රියාකාරී ගොවි ඉල්ලීම් සමාලෝචනය කර ආයෝජනය කිරීමට පාලක පුවරුව භාවිතා කරන්න.",
    "home.roleBannerFarmer":
      "පුද්ගලික ගොවි දසුන: මෙම මුල් පිටුවේ ඔබගේම ඉල්ලීම් පමණක් පෙනේ.",
    "home.roleBannerInvestor":
      "ආයෝජක වෙළඳපොළ: ඔබට ගොවීන් කිහිපදෙනෙකුගේ ක්‍රියාකාරී ඉල්ලීම් පෙනේ.",
    "home.lightRainExpected": "සැහැල්ලු වැසි බලාපොරොත්තු වේ",
    "home.humidity": "ආර්ද්‍රතාව",
    "home.soilTemp": "පස උෂ්ණත්වය",
    "home.wind": "සුළඟ",
    "home.activeCrops": "ක්‍රියාකාරී බෝග",
    "home.investors": "ආයෝජකයින්",
    "home.fundedToday": "අද අරමුදල් ලැබූ",
    "home.avgReturn": "සාමාන්‍ය ප්‍රතිලාභය",
    "home.openInvestmentRequests": "විවෘත ආයෝජන ඉල්ලීම්",
    "home.yourActiveRequests": "ඔබගේ ක්‍රියාකාරී ඉල්ලීම්",
    "home.seeAll": "සියල්ල බලන්න",
    "home.noPersonalRequests": "තවම පුද්ගලික ඉල්ලීම් නොමැත",
    "home.noFarmerRequests": "තවම ක්‍රියාකාරී ගොවි ඉල්ලීම් නොමැත",
    "home.noPersonalRequestsText":
      "ගොවීන්ට මෙහි පෙනෙන්නේ ඔවුන්ගේම ඉල්ලීම් පමණි. පාලක පුවරුවෙන් එකක් සාදන්න.",
    "home.noFarmerRequestsText":
      "ගොවීන් ඉල්ලීම් සාදන විට ආයෝජකයින්ට මෙහි ඒවා සමාලෝචනය කළ හැක.",
    "home.openDashboard": "පාලක පුවරුව විවෘත කරන්න",
    "home.viewDashboard": "පාලක පුවරුව බලන්න",
    "home.investNow": "දැන් ආයෝජනය කරන්න",
    "home.manageRequest": "ඉල්ලීම කළමනාකරණය කරන්න",
    "dashboard.farmerDashboard": "ගොවි පාලක පුවරුව",
    "dashboard.investorDashboard": "ආයෝජක පාලක පුවරුව",
    "dashboard.farmerSubtitle":
      "ඔබගේ ගොවිපොළට සහාය දක්වන ආයෝජකයින් බලන්න සහ ආයෝජකයින් සමාලෝචනය කළ හැකි ඉල්ලීම් සාදන්න.",
    "dashboard.investorSubtitle":
      "ගොවි ආයෝජන ඉල්ලීම් බලන්න, ආයෝජනයට පෙර AI භාවිතා කරන්න, සහ සෘජුවම අරමුදල් සපයන්න.",
    "dashboard.roleBannerFarmer":
      "පුද්ගලික ගොවි දසුන: මෙහි ඔබගේම ඉල්ලීම් පමණක් පෙන්වයි.",
    "dashboard.roleBannerInvestor":
      "ආයෝජක වෙළඳපොළ: සියලුම ක්‍රියාකාරී ගොවි ඉල්ලීම් මෙහි පෙන්වයි.",
    "dashboard.activeFields": "ක්‍රියාකාරී වගා භූමි",
    "dashboard.pendingFunding": "අපේක්ෂිත අරමුදල්",
    "dashboard.investorsVisible": "පෙනෙන ආයෝජකයින්",
    "dashboard.liveDeals": "ක්‍රියාකාරී ගනුදෙනු",
    "dashboard.farmersSeekingCapital": "ප්‍රාග්ධනය අවශ්‍ය ගොවීන්",
    "dashboard.expectedReturn": "අපේක්ෂිත ප්‍රතිලාභය",
    "dashboard.investmentRequests": "ආයෝජන ඉල්ලීම්",
    "dashboard.farmerOpportunityFeed": "ගොවි අවස්ථා සංග්‍රහය",
    "dashboard.farmerPanelText":
      "ආයෝජකයින් දැනටමත් අරමුදල් ලබා දී ඇති දේවල් නිරීක්ෂණය කරමින්, ඔබගේ ආයෝජන ඉල්ලීම් ඉදිරිපත් කිරීමට පාලක පුවරුව භාවිතා කරන්න.",
    "dashboard.investorPanelText":
      "මෙම ක්‍රියාකාරී ඉල්ලීම් සමාලෝචනය කර, AI සමඟ පරීක්ෂා කර, සෘජුවම අරමුදල් ලබා දිය හැක.",
    "dashboard.createInvestmentRequest": "ආයෝජන ඉල්ලීමක් සාදන්න",
    "dashboard.createInvestmentRequestSubtitle":
      "ආයෝජකයින් සමාලෝචනය කර අරමුදල් ලබා දීමට ඉල්ලීමක් එක් කරන්න.",
    "dashboard.crop": "බෝගය",
    "dashboard.location": "ස්ථානය",
    "dashboard.amountNeeded": "අවශ්‍ය මුදල",
    "dashboard.requestSummaryPlaceholder":
      "මෙම ආයෝජනය භාවිතා කරන්නේ කුමක් සඳහාද?",
    "dashboard.submitRequest": "ඉල්ලීම යවන්න",
    "dashboard.yourLiveRequests": "ඔබගේ ක්‍රියාකාරී ඉල්ලීම්",
    "dashboard.requestsOpenForInvestment": "ආයෝජනයට විවෘත ඉල්ලීම්",
    "dashboard.loadingRoleData": "භූමිකා දත්ත පූරණය වෙමින්...",
    "dashboard.noRequestsCreated": "තවම ඉල්ලීම් සාදා නැත",
    "dashboard.noInvestmentRequestsAvailable": "ආයෝජන ඉල්ලීම් නොමැත",
    "dashboard.noRequestsCreatedText":
      "ඉහතින් ඔබගේම ආයෝජන ඉල්ලීමක් සාදන්න. මෙහි පෙනෙන්නේ ඔබගේම ඉල්ලීම් පමණි.",
    "dashboard.noInvestmentRequestsAvailableText":
      "ආයෝජක ගිණුම්වලට මෙහි සියලුම ක්‍රියාකාරී ගොවි ඉල්ලීම් සමාලෝචනය කර ආයෝජනය කළ හැක.",
    "dashboard.investorsBackingYou": "ඔබට සහාය දක්වන ආයෝජකයින්",
    "dashboard.avgReturn": "සාමාන්‍ය ප්‍රතිලාභය",
    "dashboard.projects": "ව්‍යාපෘති",
    "dashboard.investorConnected":
      "ආයෝජකයා දැනටමත් ඔබගේ ගොවිපොළ සමඟ සම්බන්ධ වී ඇත",
    "dashboard.raised": "ලැබී ඇති මුදල",
    "dashboard.need": "අවශ්‍ය මුදල",
    "dashboard.pastRate": "පසුගිය අනුපාතය",
    "dashboard.funded": "{progress}% අරමුදල් ලැබී ඇත",
    "dashboard.askAi": "AI අසන්න",
    "dashboard.investNow": "දැන් ආයෝජනය කරන්න",
    "dashboard.yourLiveInvestmentRequest":
      "මෙය ඔබගේ ක්‍රියාකාරී ආයෝජන ඉල්ලීමයි",
    "dashboard.delete": "මකන්න",
    "dashboard.aiInsight": "AI ආයෝජන අවබෝධය",
    "dashboard.preparingAi": "AI පිළිතුර සූදානම් කරමින්...",
    "dashboard.aiUnavailable": "AI අවබෝධය නොලැබේ",
    "dashboard.aiTryAgain": "පසුපස පද්ධතිය සම්බන්ධ වූ පසු නැවත උත්සාහ කරන්න.",
    "dashboard.aiNoHistoricalRate": "ඓතිහාසික අනුපාත දත්ත පූරණය කළ නොහැකි විය.",
    "dashboard.aiConnectionIssue":
      "සම්බන්ධතා ගැටළුවක් නිසා නව AI ඇගයීමක් ලබා ගත නොහැකි විය.",
    "dashboard.aiUnknownError": "නොදන්නා AI ඉල්ලීම් දෝෂයකි.",
    "dashboard.previousRates": "පෙර අනුපාත",
    "dashboard.outlook": "දෘෂ්ටිය",
    "dashboard.confidence": "විශ්වාසය",
    "dashboard.requestSent": "ඉල්ලීම යවන ලදී",
    "dashboard.requestSentMessage":
      "ඔබගේ ආයෝජන ඉල්ලීම සාර්ථකව යවා ඇති අතර දැන් ආයෝජකයින්ට පෙනේ.",
    "dashboard.chooseInvestmentAmount": "ආයෝජන මුදල තෝරන්න",
    "dashboard.chooseInvestmentAmountText":
      "මෙම ගොවි ඉල්ලීම සඳහා ඔබ ආයෝජනය කිරීමට කැමති මුදල ඇතුළත් කරන්න.",
    "dashboard.amountInLkr": "රුපියල් මුදල",
    "dashboard.confirmInvestment": "ආයෝජනය තහවුරු කරන්න",
    "dashboard.missingDetails": "තොරතුරු අඩුයි",
    "dashboard.missingDetailsMessage":
      "ඉල්ලීම යැවීමට පෙර බෝගය, ස්ථානය, මුදල සහ සාරාංශය ඇතුළත් කරන්න.",
    "dashboard.invalidCrop": "වලංගු නොවන බෝගය",
    "dashboard.invalidCropMessage": "බෝග නාමය අක්ෂර 2කට වඩා තිබිය යුතුය.",
    "dashboard.invalidLocation": "වලංගු නොවන ස්ථානය",
    "dashboard.invalidLocationMessage": "ස්ථානය අක්ෂර 2කට වඩා තිබිය යුතුය.",
    "dashboard.invalidSummary": "වලංගු නොවන සාරාංශය",
    "dashboard.invalidSummaryMessage":
      "ආයෝජකයින්ට ඉල්ලීම තේරුම් ගැනීමට සාරාංශය අක්ෂර 10කට වඩා තිබිය යුතුය.",
    "dashboard.invalidAmount": "වලංගු නොවන මුදල",
    "dashboard.invalidAmountMessage": "අවම වශයෙන් රු. 1,000ක් ඇතුළත් කරන්න.",
    "dashboard.invalidRequestAmountMax": "මුදල රු. 10,000,000ට අඩු විය යුතුය.",
    "dashboard.invalidInvestmentAmountMax":
      "ආයෝජන මුදල රු. 1,000,000ට අඩු විය යුතුය.",
    "dashboard.unableToSubmitRequest": "ඉල්ලීම යැවිය නොහැක",
    "dashboard.unknownRequestError": "නොදන්නා ඉල්ලීම් දෝෂයකි.",
    "dashboard.investmentRecorded": "ආයෝජනය සටහන් විය",
    "dashboard.investmentRecordedMessage":
      "මෙම ඉල්ලීමට රු. {amount}ක් එක් කර ඇත.",
    "dashboard.investmentFailed": "ආයෝජනය අසාර්ථකයි",
    "dashboard.unknownInvestmentError": "නොදන්නා ආයෝජන දෝෂයකි.",
    "dashboard.deleteRequest": "ඉල්ලීම මකන්න",
    "dashboard.deleteRequestMessage":
      "මෙය ක්‍රියාකාරී දත්ත ගබඩාවෙන් සහ ආයෝජක පෝෂණයෙන් ඉවත් කරයි.",
    "dashboard.requestDeleted": "ඉල්ලීම මකා දමන ලදී",
    "dashboard.requestDeletedMessage":
      "ඉල්ලීම ඔබගේ ගිණුමෙන් සහ හවුල් දත්ත ගබඩාවෙන් ඉවත් කර ඇත.",
    "dashboard.deleteFailed": "මැකීම අසාර්ථකයි",
    "dashboard.unknownDeleteError": "නොදන්නා මකා දැමීමේ දෝෂයකි.",
    "dashboard.sessionExpired": "සැසිය කල් ඉකුත් වී ඇත",
    "dashboard.signIn": "පුරන්න",
    "profile.myProfile": "මගේ පැතිකඩ",
    "profile.roleFarmer": "ගොවියා",
    "profile.roleInvestor": "ආයෝජකයා",
    "profile.profileStrength": "පැතිකඩ ශක්තිය: {percent}%",
    "profile.profileStrengthTitle": "පැතිකඩ ශක්තිය",
    "profile.completeProfile":
      "විශ්වාසය වැඩි කිරීමට ඔබගේ පැතිකඩ සම්පූර්ණ කරන්න.",
    "profile.accountSettings": "ගිණුම් සැකසුම්",
    "profile.editPersonalDetails": "පුද්ගලික තොරතුරු සංස්කරණය කරන්න",
    "profile.securityPassword": "ආරක්ෂාව සහ මුරපදය",
    "profile.paymentMethods": "ගෙවීම් ක්‍රම",
    "profile.alertsCenter": "දැනුම්දීම් මධ්‍යස්ථානය",
    "profile.support": "සහාය",
    "profile.helpSupport": "උදව් සහ සහාය",
    "profile.termsConditions": "නියම සහ කොන්දේසි",
    "profile.logout": "පිටවන්න",
    "profile.languageTitle": "භාෂාව තෝරන්න",
    "profile.languageDescription":
      "යෙදුම් භාෂාව තෝරන්න. පෙනෙන තිර වහාම යාවත්කාලීන වේ.",
    "profile.quickUnlockTitle": "ජෛව වේගවත් අගුළු හැරීම",
    "profile.quickUnlockDescription":
      "ඔබගේ සැසිය නැවත විවෘත කිරීමට පෙර ඇඟිලි සලකුණ හෝ මුහුණු හඳුනාගැනීම භාවිතා කරන්න.",
    "profile.quickUnlockUnavailable":
      "මෙම උපාංගයේ ජෛව වේගවත් අගුළු හැරීම නොලැබේ.",
    "profile.quickUnlockEnabledTitle": "වේගවත් අගුළු හැරීම සක්‍රීයයි",
    "profile.quickUnlockEnabledMessage":
      "ඔබගේ සුරකින ලද සැසිය විවෘත වීමට පෙර ජෛව අගුළු හැරීම අවශ්‍ය වේ.",
    "profile.quickUnlockDisabledTitle": "වේගවත් අගුළු හැරීම අක්‍රියයි",
    "profile.quickUnlockDisabledMessage":
      "සුරකින ලද සැසි ජෛව පරීක්ෂාවකින් තොරව සාමාන්‍ය ලෙස විවෘත වේ.",
    "profile.quickUnlockFailedTitle": "වේගවත් අගුළු හැරීම සක්‍රීය කළ නොහැක",
    "profile.quickUnlockFailedMessage":
      "වේගවත් අගුළු හැරීම සක්‍රීය කිරීමට සාර්ථක ජෛව පරීක්ෂාවක් සම්පූර්ණ කරන්න.",
    "profile.paymentMethodsTitle": "ගෙවීම් ක්‍රම",
    "profile.paymentMethodsMessage":
      "බැංකු ගිණුම් කළමනාකරණය Settings තුළ තිබේ.",
    "profile.helpSupportTitle": "උදව් සහ සහාය",
    "profile.helpSupportMessage":
      "ගිණුම් හෝ අරමුදල් උදව් සඳහා support@agrolink.app අමතන්න.",
    "profile.termsTitle": "නියම සහ කොන්දේසි",
    "profile.termsMessage": "නීතිමය සහ පෞද්ගලිකතා තොරතුරු යෙදුම් ලේඛනවල ඇත.",
    "profile.editTitle": "පැතිකඩ සංස්කරණය",
    "profile.editTapCamera": "උඩුගත කිරීමට කැමරාව තට්ටු කරන්න",
    "profile.editPersonalInfo": "පුද්ගලික තොරතුරු",
    "profile.editPersonalInfoSub": "සත්‍යාපනය සඳහා නීතිමය තොරතුරු",
    "profile.editFirstName": "මුල් නම",
    "profile.editFirstNamePlaceholder": "උදා: කසුන්",
    "profile.editLastName": "අවසන් නම",
    "profile.editLastNamePlaceholder": "උදා: පෙරේරා",
    "profile.editDisplayName": "පෙන්වන නම",
    "profile.editDisplayNamePlaceholder": "අන් අයට පෙනෙන ලෙස",
    "profile.editNicNumber": "ජා.හැ. අංකය",
    "profile.editNicPlaceholder": "උදා: 991234567V",
    "profile.editContactDetails": "සම්බන්ධතා තොරතුරු",
    "profile.editContactDetailsSub": "ආයෝජක සන්නිවේදනය සඳහා",
    "profile.editAddress": "ලිපිනය",
    "profile.editAddressPlaceholder": "උදා: 12, මහනුවර පාර, කොළඹ",
    "profile.editPhoneNumber": "දුරකථන අංකය",
    "profile.editPhonePlaceholder": "07X XXX XXXX",
    "profile.editSkillsTitle": "දක්ෂතා සහ විශේෂඥතාව",
    "profile.editSkillsSub": "ඔබගේ ගොවිතැන් ශක්තීන්",
    "profile.editQuickAdd": "ඉක්මන් එක් කිරීම:",
    "profile.editSkillPlaceholder": "දක්ෂතාවයක් එක් කරන්න...",
    "profile.editSaveProfile": "පැතිකඩ සුරකින්න",
    "profile.editSaveSuccessTitle": "සාර්ථකයි",
    "profile.editSaveSuccessMessage": "පැතිකඩ සාර්ථකව යාවත්කාලීන විය!",
    "profile.editSaveErrorTitle": "දෝෂය",
    "profile.editSaveErrorMessage": "පැතිකඩ යාවත්කාලීන කිරීමට නොහැකි විය.",
    "profile.editFirstNameRequired": "මුල් නම අවශ්‍යයි",
    "profile.editLastNameRequired": "අවසන් නම අවශ්‍යයි",
    "profile.editDisplayNameRequired": "පෙන්වන නම අවශ්‍යයි",
    "profile.editNicRequired": "ජා.හැ. අංකය අවශ්‍යයි",
    "profile.editAddressRequired": "ලිපිනය අවශ්‍යයි",
    "profile.editPhoneInvalid": "වලංගු අංක 10ක දුරකථන අංකයක් ඇතුළත් කරන්න",
    "profile.securityTitle": "ආරක්ෂක සැකසුම්",
    "profile.securitySubtitle":
      "ඔබගේ ගිණුම ආරක්ෂිතව තබා ගැනීමට මුරපදය වෙනස් කරන්න",
    "profile.securityLastChanged": "අවසන් වරට වෙනස් කළේ: දින 30කට පෙර",
    "profile.securityUpdateCredentials": "අක්තපත්‍ර යාවත්කාලීන කරන්න",
    "profile.securityCurrentPassword": "වත්මන් මුරපදය",
    "profile.securityNewPassword": "නව මුරපදය",
    "profile.securityConfirmNewPassword": "නව මුරපදය තහවුරු කරන්න",
    "profile.securityPasswordStrength": "මුරපද ශක්තිය",
    "profile.securityWeak": "දුර්වල",
    "profile.securityFair": "මධ්‍යස්ථ",
    "profile.securityGood": "හොඳයි",
    "profile.securityStrong": "ශක්තිමත්",
    "profile.securityReqLength": "අවම වශයෙන් අක්ෂර 8ක්",
    "profile.securityReqUpper": "විශාල අකුරක් එකක් (A-Z)",
    "profile.securityReqNumber": "අංකයක් එකක් (0-9)",
    "profile.securityReqSpecial": "විශේෂ අකුරක් එකක් (!@#...)",
    "profile.securityCurrentRequired": "වත්මන් මුරපදය අවශ්‍යයි",
    "profile.securityNewRequired": "නව මුරපදය අවශ්‍යයි",
    "profile.securityRequirementsError": "මුරපදය සියලු අවශ්‍යතා සපුරා නැත",
    "profile.securityConfirmRequired": "නව මුරපදය තහවුරු කරන්න",
    "profile.securityMismatch": "මුරපද නොගැළපේ",
    "profile.securityMatch": "මුරපද ගැළපේ",
    "profile.securityAgreeTitle": "මට තේරෙනවා",
    "profile.securityAgreeText":
      "මෙම වෙනසෙන් පසු මගේ වත්මන් මුරපදය ක්‍රියා නොකරනු ඇත. ඊළඟ වර ලොග් වීමට මට නව මුරපදය භාවිතා කිරීමට සිදු වේ.",
    "profile.securityAgreeRequired":
      "ඉදිරියට යාමට පෙර මෙම වෙනස ඔබ පිළිගත යුතුය",
    "profile.securityUpdatedTitle": "මුරපදය යාවත්කාලීන විය",
    "profile.securityUpdatedMessage":
      "ඔබගේ නව මුරපදය දැන් ක්‍රියාත්මකයි. ඊළඟ ලොග් වීමේදී එය භාවිතා කරන්න.",
    "profile.securityErrorTitle": "දෝෂය",
    "profile.securityErrorMessage":
      "යම් ගැටළුවක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.",
    "profile.securityUpdatePassword": "මුරපදය යාවත්කාලීන කරන්න",
    "profile.securityCancelGoBack": "අවලංගු කර ආපසු යන්න",
    "profile.investorRoleLine": "ගොවියා · ID: 20321212",
    "profile.investorActiveCrops": "ක්‍රියාකාරී බෝග",
    "profile.investorTotalInvested": "මුළු ආයෝජනය",
    "profile.investorRating": "ශ්‍රේණිගත කිරීම",
    "profile.investorNeedsWork": "තව වැඩ අවශ්‍යයි",
    "profile.investorGettingThere": "හොඳට යනවා",
    "profile.investorLookingGreat": "ඉතා හොඳයි!",
    "profile.investorTipAddPhoto": "ඡායාරූපයක් එක් කරන්න",
    "profile.investorTipVerifyNic": "ජා.හැ. තහවුරු කරන්න",
    "profile.investorTipAddBank": "බැංකු ගිණුම එක් කරන්න",
    "profile.investorTipAddSkills": "දක්ෂතා 3ක් එක් කරන්න",
    "profile.investorTipCompleteAddress": "ලිපිනය සම්පූර්ණ කරන්න",
    "profile.investorNext": "ඊළඟ:",
    "profile.investorEditSub": "නම, ජා.හැ., ලිපිනය සහ තවත් දේ",
    "profile.investorSecuritySub": "2FA, මුරපදය, ලොග් ඉතිහාසය",
    "profile.investorPaymentSub": "බැංකු ගිණුම් එක් කරන්න හෝ කළමනාකරණය කරන්න",
    "profile.investorSupportSub":
      "නිතර අසන ප්‍රශ්න, සජීවී කතාබස්, ගැටළුවක් වාර්තා කරන්න",
    "profile.investorTermsSub": "රහස්‍යතා ප්‍රතිපත්තිය සහ නීතිමය කොන්දේසි",
    "alerts.title": "දැනුම්දීම්",
    "alerts.subtitle":
      "ගිණුම් ක්‍රියාකාරකම් සහ වෙළඳපොළ වෙනස්කම් පිළිබඳව දැනුවත්ව සිටින්න.",
    "alerts.markAllRead": "සියල්ල කියවූ ලෙස සලකුණු කරන්න",
    "alerts.emptyTitle": "දැනට දැනුම්දීම් නොමැත",
    "alerts.emptyMessage":
      "නව අරමුදල් ක්‍රියාකාරකම් සහ ගිණුම් මතක් කිරීම් මෙහි පෙනේ.",
    "alerts.retry": "නැවත උත්සාහ කරන්න",
    "alerts.offlineTitle": "ඔබ නොබැඳි තත්වයේ සිටී",
    "alerts.offlineMessage":
      "දැනුම්දීම් සහ නවතම අරමුදල් ක්‍රියාකාරකම් යාවත්කාලීන කිරීමට නැවත සම්බන්ධ වන්න.",
    "alerts.securityTitle": "ආරක්ෂක පරීක්ෂාව",
    "alerts.securityMessage":
      "මෙම උපාංගය ආරක්ෂිතව තබාගෙනම ජෛව වේගවත් අගුළු හැරීම යෙදුමට නැවත පිවිසීම වේගවත් කරයි.",
    "alerts.farmerFirstRequestTitle": "ඔබගේ පළමු ඉල්ලීම සාදන්න",
    "alerts.farmerFirstRequestMessage":
      "අරමුදල් ඉල්ලීමක් සජීවී වූ විට ආයෝජකයින් ඔබගේ ගොවිපොළ දැකීමට ආරම්භ කරයි.",
    "alerts.farmerFundingProgressTitle": "{crop} ඉල්ලීමට අරමුදල් ලැබෙමින් පවතී",
    "alerts.farmerFundingProgressMessage":
      "{goal} වලින් {raised}ක් ලැබී ඇත. නවතම ආයෝජක ක්‍රියාකාරකම් සඳහා පාලක පුවරුව විවෘත කරන්න.",
    "alerts.farmerRequestLiveTitle": "{crop} ඉල්ලීම සජීවීයි",
    "alerts.farmerRequestLiveMessage":
      "ඔබගේ ඉල්ලීම ආයෝජකයින්ට පෙනේ. සැලසුම් වෙනස් වුවහොත් සාරාංශය යාවත්කාලීන කරන්න.",
    "alerts.investorOpportunityTitle": "{crop} ආයෝජන අවස්ථාව විවෘතයි",
    "alerts.investorOpportunityMessage":
      "{farmer} මහතා/මහත්මිය {location} හි {goal}ක් සොයයි. වටය අවසන් වීමට පෙර ඉල්ලීම සමාලෝචනය කරන්න.",
    "alerts.investorQuietTitle": "වෙළඳපොළ නිහඬයි",
    "alerts.investorQuietMessage":
      "දැනට ගොවි ඉල්ලීම් සජීවී නොවේ. ටික වේලාවකින් නැවත බලන්න හෝ අදිමින් යාවත්කාලීන කරන්න.",
    "alerts.updatedNow": "දැන්ම",
    "alerts.openDashboard": "පාලක පුවරුව විවෘත කරන්න",
  },
  ta: {
    "common.appName": "AgroLink",
    "common.tagline": "வேளாண் நிதியின் எதிர்காலம்",
    "common.language": "மொழி",
    "common.english": "ஆங்கிலம்",
    "common.sinhala": "சிங்களம்",
    "common.tamil": "தமிழ்",
    "common.ok": "சரி",
    "common.cancel": "ரத்து செய்",
    "common.farmer": "விவசாயி",
    "common.investor": "முதலீட்டாளர்",
    "common.low": "குறைவு",
    "common.medium": "நடுத்தரம்",
    "common.high": "அதிகம்",
    "common.recently": "சமீபத்தில்",
    "common.recentlyUpdated": "சமீபத்தில் புதுப்பிக்கப்பட்டது",
    "common.updated": "புதுப்பிக்கப்பட்டது",
    "common.memberSince": "உறுப்பினராக உள்ள தேதி {date}",
    "common.verified": "சரிபார்க்கப்பட்டது",
    "common.fundingProgress": "நிதி முன்னேற்றம்",
    "common.raisedValue": "பெற்றது: {amount}",
    "common.goalValue": "இலக்கு: {amount}",
    "common.add": "சேர்",
    "common.save": "சேமி",
    "common.new": "புதியது",
    "common.languageShort": "TA",
    "tabs.home": "முகப்பு",
    "tabs.dashboard": "டாஷ்போர்டு",
    "tabs.profile": "சுயவிவரம்",
    "splash.initializing": "தொடக்கப்படுகிறது...",
    "splash.loading": "ஏற்றப்படுகிறது...",
    "login.welcomeBack": "மீண்டும் வரவேற்கிறோம்",
    "login.signInToManage": "உங்கள் முதலீடுகளை நிர்வகிக்க உள்நுழைக",
    "login.quickDemoAccess": "விரைவு டெமோ அணுகல்",
    "login.threeFarmerDemoAccounts": "3 விவசாயி டெமோ கணக்குகள்",
    "login.threeInvestorDemoAccounts": "3 முதலீட்டாளர் டெமோ கணக்குகள்",
    "login.demoFarmer": "டெமோ விவசாயி",
    "login.demoInvestor": "டெமோ முதலீட்டாளர்",
    "login.emailAddress": "மின்னஞ்சல் முகவரி",
    "login.emailPlaceholder": "sample@email.com",
    "login.password": "கடவுச்சொல்",
    "login.stayLoggedIn": "உள்நுழைந்தபடியே இரு",
    "login.forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?",
    "login.login": "உள்நுழை",
    "login.noAccount": "கணக்கு இல்லையா?",
    "login.signUp": "பதிவு செய்",
    "login.enterCredentials":
      "தொடர உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
    "login.signedIn": "வெற்றிகரமாக உள்நுழைந்தீர்கள்",
    "login.loggedInWith": "{source} கணக்கில் உள்நுழைந்தீர்கள்.",
    "login.backend": "பின்னணி",
    "login.demo": "டெமோ",
    "login.unableToSignIn": "இப்போது உள்நுழைய முடியவில்லை.",
    "login.quickUnlockTitle": "விரைவு திறப்பு",
    "login.quickUnlockMessage":
      "{name} ஆக உள்நுழைந்துள்ளீர்கள். உங்கள் சேமித்த அமர்வைத் திறக்க உயிர் அடையாளத்தைப் பயன்படுத்தவும்.",
    "login.quickUnlockButton": "உயிர் அடையாளத்தால் திறக்கவும்",
    "login.quickUnlockUnavailable":
      "இந்த கணக்கிற்கு உயிர் அடையாள விரைவு திறப்பு இயக்கப்பட்டுள்ளது, ஆனால் இந்த சாதனம் தற்போது உயிர் அடையாள சரிபார்ப்பை முடிக்க முடியவில்லை.",
    "login.quickUnlockFailed":
      "உயிர் அடையாள திறப்பு தோல்வியடைந்தது. நீங்கள் இன்னும் மின்னஞ்சல் மற்றும் கடவுச்சொல் மூலம் உள்நுழையலாம்.",
    "signup.createAccount": "கணக்கை உருவாக்கு",
    "signup.fullName": "முழு பெயர்",
    "signup.fullNamePlaceholder": "உங்கள் முழு பெயர்",
    "signup.email": "மின்னஞ்சல்",
    "signup.password": "கடவுச்சொல்",
    "signup.confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்து",
    "signup.farmerId": "விவசாயி அடையாள எண்",
    "signup.nic": "NIC எண்",
    "signup.verificationUploads": "சரிபார்ப்பு பதிவேற்றங்கள்",
    "signup.uploadHint":
      "கணக்கை உருவாக்கும் முன் கிராம சேவகர் கடிதத்தை பதிவேற்றவும்.",
    "signup.gramaSevakaLetter": "கிராம சேவகர் கடிதம்",
    "signup.uploadPdfOrImage": "PDF அல்லது படம் பதிவேற்று",
    "signup.remove": "நீக்கு",
    "signup.signUp": "பதிவு செய்",
    "signup.alreadyHaveAccount": "ஏற்கனவே கணக்கு உள்ளதா?",
    "signup.login": "உள்நுழை",
    "signup.missingDetailsTitle": "தகவல் குறைவு",
    "signup.missingDetailsMessage": "முதலில் தேவையான தகவல்களை நிரப்பவும்.",
    "signup.passwordMismatchTitle": "கடவுச்சொல் பொருந்தவில்லை",
    "signup.passwordMismatchMessage":
      "கடவுச்சொலும் உறுதிப்படுத்தும் கடவுச்சொலும் ஒன்றாக இருக்க வேண்டும்.",
    "signup.verificationRequiredTitle": "சரிபார்ப்பு தேவை",
    "signup.verificationRequiredMessage":
      "விவசாயிகள் விவசாயி அடையாள எண்ணை உள்ளிட்டு தேவையான ஆவணத்தை பதிவேற்ற வேண்டும்.",
    "signup.signupFailed": "பதிவு தோல்வி",
    "signup.unableToCreateAccount": "இப்போது கணக்கை உருவாக்க முடியவில்லை.",
    "signup.uploadFailed": "பதிவேற்றம் தோல்வி",
    "signup.uploadFailedMessage":
      "இப்போது கிராம சேவகர் கடிதத்தை தேர்ந்தெடுக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    "home.welcomeFarmer": "மீண்டும் வரவேற்கிறோம் விவசாயியே 🌾",
    "home.welcomeInvestor": "முதலீட்டாளர் தகவல்கள் தயாராக உள்ளன 📈",
    "home.searchFarmer": "பயிர்கள், உபகரணங்கள் தேடுங்கள்...",
    "home.searchInvestor": "விவசாயிகள், திட்டங்கள் தேடுங்கள்...",
    "home.searchHintTitle": "தேடல் குறிப்பு",
    "home.searchHintFarmer":
      "உங்கள் சொந்த முதலீட்டு கோரிக்கைகளை நிர்வகிக்க டாஷ்போர்டைப் பயன்படுத்தவும்.",
    "home.searchHintInvestor":
      "செயலில் உள்ள விவசாயி கோரிக்கைகளை மதிப்பாய்வு செய்து முதலீடு செய்ய டாஷ்போர்டைப் பயன்படுத்தவும்.",
    "home.roleBannerFarmer":
      "தனிப்பட்ட விவசாயி காட்சி: இந்த முகப்பில் உங்கள் கோரிக்கைகள் மட்டும் தோன்றும்.",
    "home.roleBannerInvestor":
      "முதலீட்டாளர் சந்தை: பல விவசாயிகளின் செயலில் உள்ள கோரிக்கைகளை நீங்கள் பார்க்கிறீர்கள்.",
    "home.lightRainExpected": "இலகு மழை எதிர்பார்க்கப்படுகிறது",
    "home.humidity": "ஈரப்பதம்",
    "home.soilTemp": "மண் வெப்பநிலை",
    "home.wind": "காற்று",
    "home.activeCrops": "செயலில் உள்ள பயிர்கள்",
    "home.investors": "முதலீட்டாளர்கள்",
    "home.fundedToday": "இன்று நிதியளிக்கப்பட்டது",
    "home.avgReturn": "சராசரி வருமானம்",
    "home.openInvestmentRequests": "திறந்த முதலீட்டு கோரிக்கைகள்",
    "home.yourActiveRequests": "உங்கள் செயலில் உள்ள கோரிக்கைகள்",
    "home.seeAll": "அனைத்தையும் காண்க",
    "home.noPersonalRequests": "இன்னும் தனிப்பட்ட கோரிக்கைகள் இல்லை",
    "home.noFarmerRequests": "இன்னும் செயலில் உள்ள விவசாயி கோரிக்கைகள் இல்லை",
    "home.noPersonalRequestsText":
      "விவசாயிகள் இங்கு தங்கள் சொந்த கோரிக்கைகளை மட்டுமே காண்பார்கள். டாஷ்போர்டில் ஒன்றை உருவாக்குங்கள்.",
    "home.noFarmerRequestsText":
      "விவசாயிகள் கோரிக்கைகளை உருவாக்கிய பிறகு முதலீட்டாளர்கள் அவற்றை இங்கே மதிப்பாய்வு செய்யலாம்.",
    "home.openDashboard": "டாஷ்போர்டைத் திற",
    "home.viewDashboard": "டாஷ்போர்டைப் பார்",
    "home.investNow": "இப்போது முதலீடு செய்",
    "home.manageRequest": "கோரிக்கையை நிர்வகி",
    "dashboard.farmerDashboard": "விவசாயி டாஷ்போர்டு",
    "dashboard.investorDashboard": "முதலீட்டாளர் டாஷ்போர்டு",
    "dashboard.farmerSubtitle":
      "உங்கள் பண்ணைக்கு ஆதரவளிக்கும் முதலீட்டாளர்களைப் பாருங்கள் மற்றும் அவர்கள் மதிப்பாய்வு செய்யக்கூடிய முதலீட்டு கோரிக்கைகளை உருவாக்குங்கள்.",
    "dashboard.investorSubtitle":
      "விவசாயி முதலீட்டு கோரிக்கைகளைப் பாருங்கள், முதலீட்டிற்கு முன் AI ஐப் பயன்படுத்துங்கள், மேலும் நேரடியாக நிதியளியுங்கள்.",
    "dashboard.roleBannerFarmer":
      "தனிப்பட்ட விவசாயி காட்சி: இங்கு உங்கள் சொந்த கோரிக்கைகள் மட்டுமே காட்டப்படும்.",
    "dashboard.roleBannerInvestor":
      "முதலீட்டாளர் சந்தை: அனைத்து செயலில் உள்ள விவசாயி கோரிக்கைகளும் இங்கே காட்டப்படும்.",
    "dashboard.activeFields": "செயலில் உள்ள புலங்கள்",
    "dashboard.pendingFunding": "நிலுவையிலான நிதி",
    "dashboard.investorsVisible": "காணப்படும் முதலீட்டாளர்கள்",
    "dashboard.liveDeals": "நேரடி ஒப்பந்தங்கள்",
    "dashboard.farmersSeekingCapital": "மூலதனம் தேடும் விவசாயிகள்",
    "dashboard.expectedReturn": "எதிர்பார்க்கப்படும் வருமானம்",
    "dashboard.investmentRequests": "முதலீட்டு கோரிக்கைகள்",
    "dashboard.farmerOpportunityFeed": "விவசாயி வாய்ப்பு பட்டியல்",
    "dashboard.farmerPanelText":
      "உங்கள் முதலீட்டு கோரிக்கைகளை சமர்ப்பித்து, முதலீட்டாளர்கள் ஏற்கனவே நிதியளித்தவற்றைப் பின்தொடர டாஷ்போர்டைப் பயன்படுத்துங்கள்.",
    "dashboard.investorPanelText":
      "இந்த நேரடி கோரிக்கைகளை மதிப்பாய்வு செய்யலாம், AI மூலம் பரிசீலிக்கலாம், மேலும் நேரடியாக நிதியளிக்கலாம்.",
    "dashboard.createInvestmentRequest": "முதலீட்டு கோரிக்கையை உருவாக்கு",
    "dashboard.createInvestmentRequestSubtitle":
      "முதலீட்டாளர்கள் மதிப்பாய்வு செய்து நிதியளிக்க ஒரு கோரிக்கையைச் சேர்க்கவும்.",
    "dashboard.crop": "பயிர்",
    "dashboard.location": "இடம்",
    "dashboard.amountNeeded": "தேவையான தொகை",
    "dashboard.requestSummaryPlaceholder":
      "இந்த முதலீடு எதற்காக பயன்படுத்தப்படும்?",
    "dashboard.submitRequest": "கோரிக்கையை சமர்ப்பி",
    "dashboard.yourLiveRequests": "உங்கள் செயலில் உள்ள கோரிக்கைகள்",
    "dashboard.requestsOpenForInvestment": "முதலீட்டிற்கு திறந்த கோரிக்கைகள்",
    "dashboard.loadingRoleData": "பாத்திரத் தகவல்கள் ஏற்றப்படுகின்றன...",
    "dashboard.noRequestsCreated": "இன்னும் கோரிக்கைகள் உருவாக்கப்படவில்லை",
    "dashboard.noInvestmentRequestsAvailable": "முதலீட்டு கோரிக்கைகள் இல்லை",
    "dashboard.noRequestsCreatedText":
      "மேலே உங்கள் சொந்த முதலீட்டு கோரிக்கையை உருவாக்குங்கள். இங்கு உங்கள் கோரிக்கைகள் மட்டுமே தோன்றும்.",
    "dashboard.noInvestmentRequestsAvailableText":
      "முதலீட்டாளர் கணக்குகள் இங்கிருந்து அனைத்து செயலில் உள்ள விவசாயி கோரிக்கைகளையும் மதிப்பாய்வு செய்து முதலீடு செய்யலாம்.",
    "dashboard.investorsBackingYou": "உங்களுக்கு ஆதரவளிக்கும் முதலீட்டாளர்கள்",
    "dashboard.avgReturn": "சராசரி வருமானம்",
    "dashboard.projects": "திட்டங்கள்",
    "dashboard.investorConnected":
      "இந்த முதலீட்டாளர் ஏற்கனவே உங்கள் பண்ணையுடன் இணைக்கப்பட்டுள்ளார்",
    "dashboard.raised": "ஏற்கனவே பெற்றது",
    "dashboard.need": "தேவை",
    "dashboard.pastRate": "முந்தைய விகிதம்",
    "dashboard.funded": "{progress}% நிதியளிக்கப்பட்டது",
    "dashboard.askAi": "AI ஐ கேள்",
    "dashboard.investNow": "இப்போது முதலீடு செய்",
    "dashboard.yourLiveInvestmentRequest":
      "இது உங்கள் செயலில் உள்ள முதலீட்டு கோரிக்கை",
    "dashboard.delete": "நீக்கு",
    "dashboard.aiInsight": "AI முதலீட்டு பார்வை",
    "dashboard.preparingAi": "AI பதில் தயாராகிறது...",
    "dashboard.aiUnavailable": "AI பார்வை கிடைக்கவில்லை",
    "dashboard.aiTryAgain":
      "பின்னணி சேவை மீண்டும் கிடைக்கும் போது மறுபடியும் முயற்சிக்கவும்.",
    "dashboard.aiNoHistoricalRate": "முன்னைய விகிதத் தரவை ஏற்ற முடியவில்லை.",
    "dashboard.aiConnectionIssue":
      "இணைப்பு சிக்கலால் புதிய AI மதிப்பீடு பெற முடியவில்லை.",
    "dashboard.aiUnknownError": "தெரியாத AI கோரிக்கை பிழை.",
    "dashboard.previousRates": "முந்தைய விகிதங்கள்",
    "dashboard.outlook": "நிலைமுன்னோக்கு",
    "dashboard.confidence": "நம்பகத்தன்மை",
    "dashboard.requestSent": "கோரிக்கை அனுப்பப்பட்டது",
    "dashboard.requestSentMessage":
      "உங்கள் முதலீட்டு கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது, இப்போது அது முதலீட்டாளர்களுக்குப் புலப்படும்.",
    "dashboard.chooseInvestmentAmount": "முதலீட்டு தொகையைத் தேர்ந்தெடுக்கவும்",
    "dashboard.chooseInvestmentAmountText":
      "இந்த விவசாயி கோரிக்கையில் நீங்கள் முதலீடு செய்ய விரும்பும் தொகையை உள்ளிடவும்.",
    "dashboard.amountInLkr": "LKR தொகை",
    "dashboard.confirmInvestment": "முதலீட்டை உறுதிப்படுத்து",
    "dashboard.missingDetails": "தகவல் குறைவு",
    "dashboard.missingDetailsMessage":
      "கோரிக்கையை சமர்ப்பிப்பதற்கு முன் பயிர், இடம், தொகை மற்றும் சுருக்கத்தை உள்ளிடவும்.",
    "dashboard.invalidCrop": "தவறான பயிர்",
    "dashboard.invalidCropMessage":
      "பயிர் பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.",
    "dashboard.invalidLocation": "தவறான இடம்",
    "dashboard.invalidLocationMessage":
      "இடம் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.",
    "dashboard.invalidSummary": "தவறான சுருக்கம்",
    "dashboard.invalidSummaryMessage":
      "முதலீட்டாளர்கள் கோரிக்கையைப் புரிந்துகொள்ள சுருக்கம் குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்.",
    "dashboard.invalidAmount": "தவறான தொகை",
    "dashboard.invalidAmountMessage": "குறைந்தது LKR 1,000 ஐ உள்ளிடவும்.",
    "dashboard.invalidRequestAmountMax":
      "தொகை LKR 10,000,000 ஐ விட குறைவாக இருக்க வேண்டும்.",
    "dashboard.invalidInvestmentAmountMax":
      "முதலீட்டு தொகை LKR 1,000,000 ஐ விட குறைவாக இருக்க வேண்டும்.",
    "dashboard.unableToSubmitRequest": "கோரிக்கையை சமர்ப்பிக்க முடியவில்லை",
    "dashboard.unknownRequestError": "தெரியாத கோரிக்கை பிழை.",
    "dashboard.investmentRecorded": "முதலீடு பதிவு செய்யப்பட்டது",
    "dashboard.investmentRecordedMessage":
      "இந்த கோரிக்கைக்கு LKR {amount} சேர்க்கப்பட்டது.",
    "dashboard.investmentFailed": "முதலீடு தோல்வி",
    "dashboard.unknownInvestmentError": "தெரியாத முதலீட்டு பிழை.",
    "dashboard.deleteRequest": "கோரிக்கையை நீக்கு",
    "dashboard.deleteRequestMessage":
      "இது செயல்பாட்டிலுள்ள தரவுத்தளத்திலும் முதலீட்டாளர் பட்டியலிலும் இருந்து நீக்கப்படும்.",
    "dashboard.requestDeleted": "கோரிக்கை நீக்கப்பட்டது",
    "dashboard.requestDeletedMessage":
      "கோரிக்கை உங்கள் கணக்கிலிருந்தும் பகிரப்பட்ட தரவுத்தளத்திலிருந்தும் நீக்கப்பட்டது.",
    "dashboard.deleteFailed": "நீக்கம் தோல்வி",
    "dashboard.unknownDeleteError": "தெரியாத நீக்க பிழை.",
    "dashboard.sessionExpired": "அமர்வு காலாவதியானது",
    "dashboard.signIn": "உள்நுழை",
    "profile.myProfile": "என் சுயவிவரம்",
    "profile.roleFarmer": "விவசாயி",
    "profile.roleInvestor": "முதலீட்டாளர்",
    "profile.profileStrength": "சுயவிவர வலிமை: {percent}%",
    "profile.profileStrengthTitle": "சுயவிவர வலிமை",
    "profile.completeProfile":
      "நம்பிக்கையை உயர்த்த உங்கள் சுயவிவரத்தை முழுமைப்படுத்துங்கள்.",
    "profile.accountSettings": "கணக்கு அமைப்புகள்",
    "profile.editPersonalDetails": "தனிப்பட்ட விவரங்களைத் திருத்து",
    "profile.securityPassword": "பாதுகாப்பு மற்றும் கடவுச்சொல்",
    "profile.paymentMethods": "கட்டண முறைகள்",
    "profile.alertsCenter": "அறிவிப்புகள் மையம்",
    "profile.support": "ஆதரவு",
    "profile.helpSupport": "உதவி & ஆதரவு",
    "profile.termsConditions": "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    "profile.logout": "வெளியேறு",
    "profile.languageTitle": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "profile.languageDescription":
      "பயன்பாட்டு மொழியைத் தேர்ந்தெடுக்கவும். காட்சியளிக்கும் திரைகள் உடனடியாகப் புதுப்பிக்கப்படும்.",
    "profile.quickUnlockTitle": "உயிர் அடையாள விரைவு திறப்பு",
    "profile.quickUnlockDescription":
      "உங்கள் அமர்வை மீண்டும் திறப்பதற்கு முன் விரலடையாளம் அல்லது முக திறப்பைப் பயன்படுத்துங்கள்.",
    "profile.quickUnlockUnavailable":
      "இந்த சாதனத்தில் உயிர் அடையாள விரைவு திறப்பு கிடைக்கவில்லை.",
    "profile.quickUnlockEnabledTitle": "விரைவு திறப்பு இயங்குகிறது",
    "profile.quickUnlockEnabledMessage":
      "உங்கள் சேமித்த அமர்வு திறக்கும் முன் உயிர் அடையாள சரிபார்ப்பு தேவைப்படும்.",
    "profile.quickUnlockDisabledTitle": "விரைவு திறப்பு முடக்கப்பட்டது",
    "profile.quickUnlockDisabledMessage":
      "சேமித்த அமர்வுகள் உயிர் அடையாள சரிபார்ப்பின்றி வழக்கம்போல் திறக்கும்.",
    "profile.quickUnlockFailedTitle": "விரைவு திறப்பை இயக்க முடியவில்லை",
    "profile.quickUnlockFailedMessage":
      "விரைவு திறப்பை இயக்க வெற்றிகரமான உயிர் அடையாள சரிபார்ப்பை முடிக்கவும்.",
    "profile.paymentMethodsTitle": "கட்டண முறைகள்",
    "profile.paymentMethodsMessage":
      "வங்கி கணக்கு மேலாண்மை Settings பகுதியில் கிடைக்கிறது.",
    "profile.helpSupportTitle": "உதவி & ஆதரவு",
    "profile.helpSupportMessage":
      "கணக்கு அல்லது நிதி உதவிக்காக support@agrolink.app ஐ தொடர்புகொள்ளுங்கள்.",
    "profile.termsTitle": "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    "profile.termsMessage":
      "சட்ட மற்றும் தனியுரிமை விவரங்கள் பயன்பாட்டு ஆவணங்களில் கிடைக்கின்றன.",
    "profile.editTitle": "சுயவிவரம் திருத்தம்",
    "profile.editTapCamera": "பதிவேற்ற கேமராவைத் தட்டவும்",
    "profile.editPersonalInfo": "தனிப்பட்ட தகவல்",
    "profile.editPersonalInfoSub": "சரிபார்ப்பிற்கான சட்ட விவரங்கள்",
    "profile.editFirstName": "முதல் பெயர்",
    "profile.editFirstNamePlaceholder": "எ.கா. கசுன்",
    "profile.editLastName": "கடைசி பெயர்",
    "profile.editLastNamePlaceholder": "எ.கா. பெரேரா",
    "profile.editDisplayName": "காட்சி பெயர்",
    "profile.editDisplayNamePlaceholder": "மற்றவர்கள் பார்க்கும் பெயர்",
    "profile.editNicNumber": "NIC எண்",
    "profile.editNicPlaceholder": "எ.கா. 991234567V",
    "profile.editContactDetails": "தொடர்பு விவரங்கள்",
    "profile.editContactDetailsSub": "முதலீட்டாளர் தொடர்புகளுக்காக",
    "profile.editAddress": "முகவரி",
    "profile.editAddressPlaceholder": "எ.கா. 12 கண்டி வீதி, கொழும்பு",
    "profile.editPhoneNumber": "தொலைபேசி எண்",
    "profile.editPhonePlaceholder": "07X XXX XXXX",
    "profile.editSkillsTitle": "திறன்கள் மற்றும் நிபுணத்துவம்",
    "profile.editSkillsSub": "உங்கள் விவசாய வலிமைகள்",
    "profile.editQuickAdd": "விரைவு சேர்க்கை:",
    "profile.editSkillPlaceholder": "ஒரு திறனைச் சேர்க்கவும்...",
    "profile.editSaveProfile": "சுயவிவரத்தைச் சேமி",
    "profile.editSaveSuccessTitle": "வெற்றி",
    "profile.editSaveSuccessMessage":
      "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    "profile.editSaveErrorTitle": "பிழை",
    "profile.editSaveErrorMessage": "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை.",
    "profile.editFirstNameRequired": "முதல் பெயர் அவசியம்",
    "profile.editLastNameRequired": "கடைசி பெயர் அவசியம்",
    "profile.editDisplayNameRequired": "காட்சி பெயர் அவசியம்",
    "profile.editNicRequired": "NIC எண் அவசியம்",
    "profile.editAddressRequired": "முகவரி அவசியம்",
    "profile.editPhoneInvalid": "சரியான 10 இலக்க எண்ணை உள்ளிடவும்",
    "profile.securityTitle": "பாதுகாப்பு அமைப்புகள்",
    "profile.securitySubtitle":
      "உங்கள் கணக்கை பாதுகாப்பாக வைத்திருக்க கடவுச்சொல்லை மாற்றுங்கள்",
    "profile.securityLastChanged": "கடைசியாக மாற்றியது: 30 நாட்களுக்கு முன்",
    "profile.securityUpdateCredentials": "அடையாள விவரங்களை புதுப்பிக்கவும்",
    "profile.securityCurrentPassword": "தற்போதைய கடவுச்சொல்",
    "profile.securityNewPassword": "புதிய கடவுச்சொல்",
    "profile.securityConfirmNewPassword":
      "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    "profile.securityPasswordStrength": "கடவுச்சொல் வலிமை",
    "profile.securityWeak": "பலவீனம்",
    "profile.securityFair": "சராசரி",
    "profile.securityGood": "நன்று",
    "profile.securityStrong": "வலிமைமிக்கது",
    "profile.securityReqLength": "குறைந்தது 8 எழுத்துகள்",
    "profile.securityReqUpper": "ஒரு பெரிய எழுத்து (A-Z)",
    "profile.securityReqNumber": "ஒரு எண் (0-9)",
    "profile.securityReqSpecial": "ஒரு சிறப்பு எழுத்து (!@#...)",
    "profile.securityCurrentRequired": "தற்போதைய கடவுச்சொல் அவசியம்",
    "profile.securityNewRequired": "புதிய கடவுச்சொல் அவசியம்",
    "profile.securityRequirementsError":
      "கடவுச்சொல் அனைத்து தேவைகளையும் பூர்த்தி செய்யவில்லை",
    "profile.securityConfirmRequired": "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    "profile.securityMismatch": "கடவுச்சொற்கள் பொருந்தவில்லை",
    "profile.securityMatch": "கடவுச்சொற்கள் பொருந்துகின்றன",
    "profile.securityAgreeTitle": "எனக்கு புரிகிறது",
    "profile.securityAgreeText":
      "இந்த மாற்றத்திற்குப் பிறகு எனது தற்போதைய கடவுச்சொல் வேலை செய்யாது. அடுத்த முறை உள்நுழைய நான் புதிய கடவுச்சொல்லைப் பயன்படுத்த வேண்டும்.",
    "profile.securityAgreeRequired":
      "தொடர்வதற்கு முன் இந்த மாற்றத்தை நீங்கள் ஒப்புக்கொள்ள வேண்டும்",
    "profile.securityUpdatedTitle": "கடவுச்சொல் புதுப்பிக்கப்பட்டது",
    "profile.securityUpdatedMessage":
      "உங்கள் புதிய கடவுச்சொல் இப்போது செயலில் உள்ளது. அடுத்த முறை உள்நுழையும் போது அதைப் பயன்படுத்தவும்.",
    "profile.securityErrorTitle": "பிழை",
    "profile.securityErrorMessage":
      "ஏதோ தவறு ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    "profile.securityUpdatePassword": "கடவுச்சொல்லை புதுப்பிக்கவும்",
    "profile.securityCancelGoBack": "ரத்து செய்து திரும்பிச் செல்லவும்",
    "profile.investorRoleLine": "விவசாயி · ID: 20321212",
    "profile.investorActiveCrops": "செயலில் உள்ள பயிர்கள்",
    "profile.investorTotalInvested": "மொத்த முதலீடு",
    "profile.investorRating": "மதிப்பீடு",
    "profile.investorNeedsWork": "இன்னும் வேலை தேவை",
    "profile.investorGettingThere": "முன்னேறிக்கொண்டிருக்கிறது",
    "profile.investorLookingGreat": "மிகச் சிறப்பு!",
    "profile.investorTipAddPhoto": "புகைப்படம் சேர்க்கவும்",
    "profile.investorTipVerifyNic": "NIC ஐ சரிபார்க்கவும்",
    "profile.investorTipAddBank": "வங்கி கணக்கு சேர்க்கவும்",
    "profile.investorTipAddSkills": "3+ திறன்களைச் சேர்க்கவும்",
    "profile.investorTipCompleteAddress": "முகவரியை முழுமையாக்கவும்",
    "profile.investorNext": "அடுத்து:",
    "profile.investorEditSub": "பெயர், NIC, முகவரி மற்றும் மேலும்",
    "profile.investorSecuritySub": "2FA, கடவுச்சொல், உள்நுழைவு வரலாறு",
    "profile.investorPaymentSub":
      "வங்கி கணக்குகளைச் சேர்க்க அல்லது நிர்வகிக்கவும்",
    "profile.investorSupportSub":
      "அடிக்கடி கேட்கப்படும் கேள்விகள், நேரடி உரையாடல், சிக்கலை அறிவிக்கவும்",
    "profile.investorTermsSub": "தனியுரிமைக் கொள்கை மற்றும் சட்ட விதிமுறைகள்",
    "alerts.title": "அறிவிப்புகள்",
    "alerts.subtitle":
      "கணக்கு செயல்பாடுகள் மற்றும் சந்தை மாற்றங்களைத் தொடர்ந்து அறிந்திருங்கள்.",
    "alerts.markAllRead": "அனைத்தையும் வாசித்ததாக குறிக்கவும்",
    "alerts.emptyTitle": "இப்போது அறிவிப்புகள் இல்லை",
    "alerts.emptyMessage":
      "புதிய நிதி செயல்பாடுகளும் கணக்கு நினைவூட்டல்களும் இங்கே தோன்றும்.",
    "alerts.retry": "மீண்டும் முயற்சி செய்",
    "alerts.offlineTitle": "நீங்கள் இணையமின்றி உள்ளீர்கள்",
    "alerts.offlineMessage":
      "அறிவிப்புகளையும் சமீபத்திய நிதி செயல்பாடுகளையும் புதுப்பிக்க மீண்டும் இணையுங்கள்.",
    "alerts.securityTitle": "பாதுகாப்பு சோதனை",
    "alerts.securityMessage":
      "இந்த சாதனத்தை பாதுகாப்பாக வைத்துக்கொண்டே உயிர் அடையாள விரைவு திறப்பு மீண்டும் நுழைவதை வேகப்படுத்தும்.",
    "alerts.farmerFirstRequestTitle": "உங்கள் முதல் கோரிக்கையை உருவாக்குங்கள்",
    "alerts.farmerFirstRequestMessage":
      "ஒரு நிதி கோரிக்கை நேரலையாகும் போது முதலீட்டாளர்கள் உங்கள் பண்ணையைப் பார்க்கத் தொடங்குவார்கள்.",
    "alerts.farmerFundingProgressTitle":
      "{crop} கோரிக்கைக்கு நிதி சேர்க்கப்படுகிறது",
    "alerts.farmerFundingProgressMessage":
      "{goal} இல் {raised} பெறப்பட்டுள்ளது. சமீபத்திய முதலீட்டாளர் செயல்பாட்டைக் காண டாஷ்போர்டைத் திறக்கவும்.",
    "alerts.farmerRequestLiveTitle": "{crop} கோரிக்கை நேரலையில் உள்ளது",
    "alerts.farmerRequestLiveMessage":
      "உங்கள் கோரிக்கை முதலீட்டாளர்களுக்குத் தெரிகிறது. திட்டம் மாறினால் சுருக்கத்தைப் புதுப்பிக்கவும்.",
    "alerts.investorOpportunityTitle": "{crop} வாய்ப்பு திறந்திருக்கும்",
    "alerts.investorOpportunityMessage":
      "{farmer} அவர்கள் {location} இல் {goal} தேடுகிறார். சுற்று முடிவதற்கு முன் கோரிக்கையை மதிப்பாய்வு செய்யவும்.",
    "alerts.investorQuietTitle": "சந்தை அமைதியாக உள்ளது",
    "alerts.investorQuietMessage":
      "இப்போது விவசாயி கோரிக்கைகள் எதுவும் நேரலையில் இல்லை. பிறகு மீண்டும் பார்க்கவும் அல்லது கீழே இழுத்து புதுப்பிக்கவும்.",
    "alerts.updatedNow": "இப்போதுதான்",
    "alerts.openDashboard": "டாஷ்போர்டைத் திறக்கவும்",
  },
};

interface LanguageContextValue {
  language: AppLanguage;
  locale: string;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(
  template: string,
  params?: Record<string, string | number>,
) {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    let active = true;

    const loadLanguage = async () => {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (
        active &&
        stored &&
        (stored === "en" || stored === "si" || stored === "ta")
      ) {
        setLanguageState(stored);
      }
    };

    loadLanguage();

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const template =
        translations[language][key] ?? translations.en[key] ?? key;
      return interpolate(template, params);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      locale: localeMap[language],
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
