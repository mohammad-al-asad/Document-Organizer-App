import React from "react";
import {
  Activity,
  Baby,
  BadgeCheck,
  Briefcase,
  Car,
  CheckSquare,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Languages,
  Plane,
  Shield,
  ShieldCheck,
  ShieldPlus,
  User,
  Utensils,
  Zap,
} from "lucide-react-native";

export const CATEGORIES = [
  "Passport",
  "National ID",
  "Driving License",
  "Voter ID",
  "Birth Certificate",
  "Residence Permit",
  "Work Permit",
  "Student ID",
  "Tax ID",
  "Insurance Card",
  "Vehicle Registration",
  "Visa",
  "Bank Statement",
  "Utility Bill",
  "Employee ID",
  "Health Card",
  "Ration Card",
  "Social Security Card",
  "Immigration Document",
  "Other",
];

export const CATEGORY_STYLES: Record<string, { colors: [string, string]; icon: string }> = {
  "Passport": { colors: ["#1e3a8a", "#3b82f6"], icon: "Globe" },
  "National ID": { colors: ["#312e81", "#6366f1"], icon: "User" },
  "Driving License": { colors: ["#1e1b4b", "#4338ca"], icon: "CreditCard" },
  "Voter ID": { colors: ["#1e293b", "#64748b"], icon: "CheckSquare" },
  "Birth Certificate": { colors: ["#7c2d12", "#f97316"], icon: "Baby" },
  "Residence Permit": { colors: ["#14532d", "#22c55e"], icon: "Home" },
  "Work Permit": { colors: ["#78350f", "#fbbf24"], icon: "Briefcase" },
  "Student ID": { colors: ["#4c1d95", "#8b5cf6"], icon: "GraduationCap" },
  "Tax ID": { colors: ["#164e63", "#0891b2"], icon: "DollarSign" },
  "Insurance Card": { colors: ["#701a75", "#d946ef"], icon: "ShieldCheck" },
  "Vehicle Registration": { colors: ["#064e3b", "#10b981"], icon: "Car" },
  "Visa": { colors: ["#831843", "#ec4899"], icon: "Plane" },
  "Bank Statement": { colors: ["#111827", "#4b5563"], icon: "Landmark" },
  "Utility Bill": { colors: ["#0f172a", "#334155"], icon: "Zap" },
  "Employee ID": { colors: ["#3730a3", "#4f46e5"], icon: "BadgeCheck" },
  "Health Card": { colors: ["#991b1b", "#ef4444"], icon: "Activity" },
  "Ration Card": { colors: ["#431407", "#ea580c"], icon: "Utensils" },
  "Social Security Card": { colors: ["#1e3a8a", "#2563eb"], icon: "Shield" },
  "Immigration Document": { colors: ["#065f46", "#34d399"], icon: "Languages" },
  "Other": { colors: ["#27272a", "#52525b"], icon: "FileText" },
};

export const getCategoryStyle = (category: string) => {
  if (!category) return CATEGORY_STYLES["Other"];
  
  if (CATEGORY_STYLES[category]) return CATEGORY_STYLES[category];
  
  const normalized = category.trim().toLowerCase();
  const matchedKey = Object.keys(CATEGORY_STYLES).find(
    (key) => key.toLowerCase() === normalized
  );
  
  return matchedKey ? CATEGORY_STYLES[matchedKey] : CATEGORY_STYLES["Other"];
};

export const getCategoryIcon = (category: string, size = 18, color?: string) => {
  const style = getCategoryStyle(category);
  const IconComp = ({
    Globe, User, CreditCard, CheckSquare, Baby, Home, Briefcase, GraduationCap, 
    DollarSign, ShieldCheck, Car, Plane, Landmark, Zap, BadgeCheck, Activity, 
    Utensils, Shield, Languages, FileText
  } as any)[style.icon] || FileText;

  return <IconComp color={color || style.colors[1]} size={size} />;
};
