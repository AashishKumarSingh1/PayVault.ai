import { generateColor } from "./generateRandomColors";
import { monthlyExpenditureDataType } from "@/components/ui/charts";
import { MonthlyExpenditure } from "./useDashboardData";
import { VendorSpending } from "./useDashboardData";
import { vendorSpendingDataType } from "@/components/ui/charts";
import { CategorySpending } from "./useDashboardData";
import { categorySpendingDataType } from "@/components/ui/charts";
import { paymentStatusDataType } from "@/components/ui/charts";
import { PaymentStatusCount } from "./useDashboardData";

export const createMonthlyExpenditureChartData = (
  apiData: MonthlyExpenditure[]
): monthlyExpenditureDataType => {
  const labels = apiData.map((entry) => {
    const date = new Date(entry.year, entry.month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  });

  const data = apiData.map((entry) => entry.totalExpenditure);
  const backgroundColors = apiData.map(() => generateColor(0.8));

  return {
    labels,
    datasets: [
      {
        label: "Expenditure (₹)",
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
};

export const createVendorSpendingChartData = (
  apiData: VendorSpending[]
): vendorSpendingDataType => {
  const labels = apiData.map((vendor) => vendor.vendorName);
  const data = apiData.map((vendor) => vendor.totalAmount);
  const backgroundColors = apiData.map(() => generateColor(0.8));

  return {
    labels,
    datasets: [
      {
        label: "Amount Spent (₹)",
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
};

export const createCategorySpendingChartData = (
  apiData: CategorySpending[]
): categorySpendingDataType => {
  const labels = apiData.map((cat) => cat.categoryName);
  const data = apiData.map((cat) => cat.totalAmount);
  const backgroundColors = apiData.map(() => generateColor(0.8));

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
};

export const createPaymentStatusChartData = (
  apiData: PaymentStatusCount[]
): paymentStatusDataType => {
  const labels = apiData.map((item) => item.status.charAt(0).toUpperCase() + item.status.slice(1));
  const data = apiData.map((item) => item.count);
  const backgroundColors = apiData.map(() => generateColor());

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
};