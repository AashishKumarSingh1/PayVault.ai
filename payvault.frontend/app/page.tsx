"use client";
import React, { useState } from "react";
import {
  FileText,
  Calendar,
} from "lucide-react";
import Charts from "../components/ui/charts";
import RecentTransactions from "@/components/ui/table/Recent_Transactions";
import axios from "axios";
import { Transaction } from "@/components/ui/table/Recent_Transactions";
import { useEffect } from "react";
import {Bill} from "../app/dashboard/bills/page"
import toast from "react-hot-toast";
import { useDashboardData } from "@/utils/useDashboardData";
import { createPaymentStatusChartData, createVendorSpendingChartData } from "@/utils/getChartConstructor";
import { createCategorySpendingChartData } from "@/utils/getChartConstructor";
import { LoaderCircle } from "lucide-react";
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
import { createMonthlyExpenditureChartData } from "@/utils/getChartConstructor";

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

export default function Dashboard() {
  const [recentTransactions,setRecentTransactions] = useState<Transaction[]>([])
  const [upcomingBills,setRecentBills] = useState<Bill[]>([])
  const { dashboardData, loading} = useDashboardData();
  
  const monthlyExpenditureData = createMonthlyExpenditureChartData(dashboardData?.monthlyExpenditure ?? [])
  const vendorSpendingData = createVendorSpendingChartData(dashboardData?.vendorWithCount ?? [])
  const categorySpendingData = createCategorySpendingChartData(dashboardData?.categoryWithCount?? [])
  const paymentStatusData = createPaymentStatusChartData(dashboardData?.paymentStatusCount ?? [])

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

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
            <LoaderCircle className="animate-spin h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm font-medium">Loading Dashboard data...</p>
          </div>
        );
      }

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
            <span className="text-sm text-gray-600">{new Date().toLocaleString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}</span>
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
                    <p className="text-sm font-medium">Bill Number : {bill.billNumber}</p>
                    <p className="text-sm font-light">Category : {bill.category}</p>
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
