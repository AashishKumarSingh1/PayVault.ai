"use client";
import React from "react";
import { getStatusIcon } from "@/utils/getStatusIcon";
import { getTypeIcon } from "@/utils/getTypeIcon";
export type Transaction = {
  id: string;
  category: string;
  vendor: string;
  amount: string;
  status: "Success" | "Failed" | "Pending" | "Refunded" | string;
  paymentType?: string;
  date: string;
  paymentMethod:string;
  billNumber:string;
};

type Props = {
  recentTransactions: Transaction[];
};


const RecentTransactions: React.FC<Props> = ({ recentTransactions }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bill Number
          </th>
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
           Payment Date
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {recentTransactions.map((txn) => (
          <tr key={txn.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {txn.billNumber}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {getTypeIcon(txn.category)}
                <span className="text-sm font-medium">{txn.category}</span>
              </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {txn.vendor}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
              ₹{txn.amount}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              <span className="flex items-center gap-1">
                {getStatusIcon(txn.status)}
                {txn.status === "initiated"
                  ? "Processing via PayVault Offline engine"
                  : txn.status === "verfied"
                  ? "Processing"
                  : txn.status}
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
