"use client";
import React from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRightLeft,
} from "lucide-react";

type Transaction = {
  id: number;
  type: string;
  vendor: string;
  amount: string;
  status: "Success" | "Failed" | "Pending" | "Refunded" | string;
  paymentType: string;
  date: string;
  icon: React.ReactNode;
};

type Props = {
  recentTransactions: Transaction[];
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Success":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "Failed":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "Pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "Refunded":
      return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

const RecentTransactions: React.FC<Props> = ({ recentTransactions }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vendor
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {recentTransactions.map((txn) => (
          <tr key={txn.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {txn.icon}
                <span className="text-sm font-medium">{txn.type}</span>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {txn.vendor}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
              {txn.amount}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              <span className="flex items-center gap-1">
                {getStatusIcon(txn.status)}
                {txn.status}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {txn.date}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentTransactions;
