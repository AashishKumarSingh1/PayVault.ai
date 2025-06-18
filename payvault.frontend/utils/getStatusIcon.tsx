import React from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "pending":
    case "initiated":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};
