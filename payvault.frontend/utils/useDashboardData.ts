import { useEffect, useState } from "react";
import axios from "axios";

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  billCount: number;
}

export interface VendorSpending {
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  billCount: number;
}

export interface MonthlyExpenditure {
  year: number;
  month: number;
  totalExpenditure: number;
  paymentCount: number;
}

export interface MonthlyBillPayment {
  year: number;
  month: number;
  paidBillsCount: number;
}


export interface PaymentStatusCount {
  status: "failed" | "initiated" | "pending" | "verified" | "completed" | "processing";
  count: number;
}

interface OverviewData {
  categories: number;
  vendors: number;
  bills: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
  };
  payments: {
    total: number;
    successful: number;
    pending: number;
  };
}

export interface DashboardData {
  categoryWithCount: CategorySpending[];
  vendorWithCount: VendorSpending[];
  monthlyExpenditure: MonthlyExpenditure[];
  monthlyBillPayments: MonthlyBillPayment[];
  paymentStatusCount: PaymentStatusCount[];
  overview: OverviewData;
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoryRes,
          vendorRes,
          expenditureRes,
          billRes,
          paymentStatusRes,
          overviewRes,
        ] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/categoryWithCount`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/vendorWithCount`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/monthlyExpenditure`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/monthlyBill`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/paymentStatusCount`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/dashboard/overview`),
        ]);

        setDashboardData({
          categoryWithCount: categoryRes.data,
          vendorWithCount: vendorRes.data,
          monthlyExpenditure: expenditureRes.data,
          monthlyBillPayments: billRes.data,
          paymentStatusCount: paymentStatusRes.data,
          overview: overviewRes.data,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardData, loading, error };
}

