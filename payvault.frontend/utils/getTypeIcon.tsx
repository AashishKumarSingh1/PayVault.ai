import React from "react";
import {
  Wifi,
  Smartphone,
  Home,
  Film,
  Utensils,
  ShoppingBag,
  Bus,
  CreditCard,
} from "lucide-react";

export const getTypeIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "electricity":
      return <Wifi className="w-4 h-4 text-yellow-500" />;
    case "internet":
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    case "rent":
      return <Home className="w-4 h-4 text-red-500" />;
    case "water":
      return <Wifi className="w-4 h-4 text-blue-300" />;
    case "subscription":
      return <Film className="w-4 h-4 text-purple-500" />;
    case "food":
      return <Utensils className="w-4 h-4 text-orange-500" />;
    case "shopping":
      return <ShoppingBag className="w-4 h-4 text-indigo-500" />;
    case "transport":
      return <Bus className="w-4 h-4 text-green-500" />;
    default:
      return <CreditCard className="w-4 h-4 text-gray-500" />;
  }
};
