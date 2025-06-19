import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BarChart4, Shield, ShoppingBag, PieChart } from "lucide-react";

export type monthlyExpenditureDataType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
    };

export type paymentStatusDataType = {  
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
};

export type vendorSpendingDataType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
};

export type categorySpendingDataType = {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
};
type ChartsProps = {
  monthlyExpenditureData: monthlyExpenditureDataType;
  paymentStatusData: paymentStatusDataType;
  vendorSpendingData: vendorSpendingDataType;
  categorySpendingData: categorySpendingDataType;
};

function Charts({
  monthlyExpenditureData,
  paymentStatusData,
  vendorSpendingData,
  categorySpendingData,
}: ChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-blue-600" />
            Monthly Expenditure
          </h3>
          <div className="h-64">
            <Bar data={monthlyExpenditureData} />
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Payment Status Distribution
          </h3>
          <div className="h-64">
            <Pie data={paymentStatusData} />
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Vendor-wise Spending */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            Vendor-wise Spending
          </h3>
          <div className="h-64">
            <Bar data={vendorSpendingData} />
          </div>
        </div>

        {/* Category-wise Spending */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Category-wise Spending
          </h3>
          <div className="h-64">
            <Pie data={categorySpendingData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Charts;
