import React from "react";
import {
  Wallet,
  CreditCard,
  DollarSign,
  HardDriveDownload,
  Receipt,
} from "lucide-react";

export const getPaymentMethodIcon = (method: string) => {
  switch (method?.toLowerCase()) {
    case "upi":
      return <Wallet className="w-4 h-4 text-blue-500" />;
    case "card":
      return <CreditCard className="w-4 h-4 text-purple-500" />;
    case "wallet":
      return <DollarSign className="w-4 h-4 text-green-500" />;
    case "net banking":
      return <HardDriveDownload className="w-4 h-4 text-indigo-500" />;
    default:
      return <Receipt className="w-4 h-4 text-gray-500" />;
  }
};
