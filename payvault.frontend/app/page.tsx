"use client";
import React, { useState } from "react";
import {
  Wifi,
  FileText,
  Home,
  Calendar,
} from "lucide-react";
import Charts from "../components/ui/charts";
import RecentTransactions from "@/components/ui/table/Recent_Transactions";
import axios from "axios";
import { Transaction } from "@/components/ui/table/Recent_Transactions";
import { useEffect } from "react";
import {Bill} from "../app/dashboard/bills/page"
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Metrics from "../components/ui/metrics";
import { getTypeIcon } from "@/utils/getTypeIcon";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dummy Data
const vendors = [
  "Swiggy",
  "BSNL",
  "Jio",
  "Amazon",
  "Zomato",
  "Uber",
  "Netflix",
  "Spotify",
];
const categories = [
  "Food",
  "Bills",
  "Shopping",
  "Transport",
  "Entertainment",
  "Health",
  "Education",
  "Others",
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const vendorSpendingData = {
  labels: vendors,
  datasets: [
    {
      label: "Amount Spent (₹)",
      data: [4500, 1200, 800, 6500, 3200, 1800, 799, 299],
      backgroundColor: [
        "#FF6B6B",
        "#4D96FF",
        "#6BCB77",
        "#FFD93D",
        "#FF9F45",
        "#845EC2",
        "#FF6B6B",
        "#4D96FF",
      ],
    },
  ],
};
const categorySpendingData = {
  labels: categories,
  datasets: [
    {
      label: "Amount Spent (₹)",
      data: [5500, 3200, 4800, 2100, 1500, 1200, 800, 500],
      backgroundColor: [
        "#FF6B6B",
        "#4D96FF",
        "#6BCB77",
        "#FFD93D",
        "#845EC2",
        "#FF9F45",
        "#4D96FF",
        "#6BCB77",
      ],
    },
  ],
};
const paymentStatusData = {
  labels: ["Success", "Failed", "Pending", "Refunded"],
  datasets: [
    {
      data: [85, 5, 7, 3],
      backgroundColor: ["#6BCB77", "#FF6B6B", "#FFD93D", "#4D96FF"],
    },
  ],
};

const monthlyExpenditureData = {
  labels: months,
  datasets: [
    {
      label: "Expenditure (₹)",
      data: [18000, 20000, 22000, 24000, 23000, 21000],
      backgroundColor: [
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 107, 107, 0.8)",
      ],
      borderColor: [
        "rgba(255, 107, 107, 1)",
        "rgba(255, 107, 107, 1)",
        "rgba(255, 107, 107, 1)",
        "rgba(255, 107, 107, 1)",
        "rgba(255, 107, 107, 1)",
        "rgba(255, 107, 107, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function Dashboard() {
  const [recentTransactions,setRecentTransactions] = useState<Transaction[]>([])
  const [upcomingBills,setRecentBills] = useState<Bill[]>([])

    const fetchRecentTransactions = async (): Promise<Transaction[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/payments/recent`
      );

      return response.data.map((txn: Transaction) => ({
        id: txn.id,
        category: txn.category,
        vendor: txn.vendor,
        amount: txn.amount,
        date: txn.date,
        status: txn.status,
        paymentMethod: txn.paymentMethod,
        billNumber: txn.billNumber,
      })) as Transaction[];
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      return [];
    }
  };

    const fetchRecentBills = async () => {
    try {
      const response = await axios.get<Bill[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/bills/recent?limit=5`
      );
      setRecentBills(response.data);
    } catch (error) {
      console.error("Error fetching recent bills:", error);
      toast.error("Failed to fetch recent bills");
    }
  };

    useEffect(() => {
      fetchRecentBills();
    }, []);

    useEffect(() => {
      const loadRecentTransactions = async () => {
        const transactions = await fetchRecentTransactions();
        setRecentTransactions(transactions);
      };
  
      loadRecentTransactions();
    }, []);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Welcome back! Here&#39;s your financial overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">May 2024</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}

      <Metrics />

      {/* Charts Section */}

      <Charts
        monthlyExpenditureData={monthlyExpenditureData}
        paymentStatusData={paymentStatusData}
        vendorSpendingData={vendorSpendingData}
        categorySpendingData={categorySpendingData}
      />

      {/* Bottom Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Transactions */}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <RecentTransactions recentTransactions={recentTransactions} />
          </div>
        </div>

        {/* Upcoming Bills */}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Upcoming Bills
          </h3>
          <div className="space-y-4">
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-full">{getTypeIcon(bill.category)}</div>
                  <div>
                    <p className="text-sm font-medium">{bill.category}</p>
                    <p className="text-xs text-gray-500">Due {(new Date(bill.dueDate.split("T")[0])).toLocaleDateString(
                      'en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                    )}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">₹{bill.amount}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center" href={"/upcoming-bills"}>
              View All Bills
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
