"use client";
import React from "react";
import {
  Utensils,
  Wifi,
  ShoppingBag,
  FileText,
  Home,
  Calendar,
  Smartphone,
  Music,
  Film,
  Car,
} from "lucide-react";
import Charts from "../components/ui/charts";
import RecentTransactions from "@/components/ui/table/Recent_Transactions";

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

const recentTransactions = [
  {
    id: 1,
    type: "Food",
    vendor: "Swiggy",
    amount: "₹450",
    status: "Success",
    paymentType: "UPI",
    date: "12 May 2024",
    icon: <Utensils className="w-4 h-4" />,
  },
  {
    id: 2,
    type: "Bills",
    vendor: "BSNL",
    amount: "₹799",
    status: "Pending",
    paymentType: "Auto-Debit",
    date: "10 May 2024",
    icon: <Wifi className="w-4 h-4" />,
  },
  {
    id: 3,
    type: "Subscription",
    vendor: "Jio",
    amount: "₹299",
    status: "Success",
    paymentType: "Card",
    date: "8 May 2024",
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: 4,
    type: "Shopping",
    vendor: "Amazon",
    amount: "₹1,299",
    status: "Failed",
    paymentType: "Net Banking",
    date: "5 May 2024",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    id: 5,
    type: "Transport",
    vendor: "Uber",
    amount: "₹320",
    status: "Success",
    paymentType: "Wallet",
    date: "3 May 2024",
    icon: <Car className="w-4 h-4" />,
  },
  {
    id: 6,
    type: "Entertainment",
    vendor: "Netflix",
    amount: "₹799",
    status: "Success",
    paymentType: "Card",
    date: "1 May 2024",
    icon: <Film className="w-4 h-4" />,
  },
  {
    id: 7,
    type: "Entertainment",
    vendor: "Spotify",
    amount: "₹299",
    status: "Refunded",
    paymentType: "UPI",
    date: "28 Apr 2024",
    icon: <Music className="w-4 h-4" />,
  },
];

const upcomingBills = [
  {
    id: 1,
    name: "Electricity Bill",
    dueDate: "15 May 2024",
    amount: "₹1,200",
    icon: <Wifi className="w-4 h-4" />,
  },
  {
    id: 2,
    name: "Rent Payment",
    dueDate: "20 May 2024",
    amount: "₹15,000",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 3,
    name: "Internet Bill",
    dueDate: "25 May 2024",
    amount: "₹899",
    icon: <Wifi className="w-4 h-4" />,
  },
];

export default function Dashboard() {
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
                  <div className="p-2 bg-red-50 rounded-full">{bill.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{bill.name}</p>
                    <p className="text-xs text-gray-500">Due {bill.dueDate}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{bill.amount}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
              View All Bills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
