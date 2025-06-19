import React from "react";
import {  Wifi, Shield, PieChart } from "lucide-react";
import { useDashboardData } from "@/utils/useDashboardData";
import { LoaderCircle } from "lucide-react";

function Metrics() {

  const { dashboardData, loading, error } = useDashboardData();
  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600">
            <LoaderCircle className="animate-spin h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm font-medium">Loading Dashboard data...</p>
          </div>
        );
      }

  if (error || !dashboardData) {
    return (
      <div className="text-sm text-red-500">
        Failed to load metrics: {error?.message || "Unknown error"}
      </div>
    );
  }

  const overview = dashboardData.overview;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Total Transactions */}
      {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="text-2xl font-bold mt-1">{overview.payments.total}</h2>
            <p className="text-xs text-gray-500 mt-1">All-time records</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div> */}

      {/* Offline Transactions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="text-2xl font-bold mt-1">{overview.payments.total}</h2>
            <p className="text-xs flex items-center gap-1 mt-1">
              <span className="text-yellow-500">{overview.payments.pending} pending sync</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-500">{overview.payments.successful} Successfull Payment</span>
              {/* <span className="text-gray-400">•</span> */}
              {/* <span className="text-green-500">{overview.payments.successful}</span> */}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Wifi className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Bill Status</p>
            <div className="flex gap-4 mt-2">
              <div>
                <p className="text-xs text-gray-500">Success</p>
                <p className="text-lg font-bold text-green-600">{overview.bills.paid}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-red-600">{overview.bills.pending}</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Vendors Handled</p>
            <h2 className="text-2xl font-bold mt-1">{overview.vendors}</h2>
            <p className="text-xs text-gray-500 mt-1">
              Vendors Handled
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <PieChart className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Categories */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Payment Categories</p>
            <h2 className="text-2xl font-bold mt-1">{overview.categories}</h2>
            <p className="text-xs text-gray-500 mt-1">
              Custom categories available
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <PieChart className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
