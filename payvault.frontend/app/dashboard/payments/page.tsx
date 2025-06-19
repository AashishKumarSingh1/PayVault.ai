"use client";
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}
import React, { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Clock,
  Plus,
  CreditCard,
  DollarSign,
  Calendar,
  FileInput,
  FileUp,
  ArrowRight,
  HardDriveDownload,
  Receipt,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getTypeIcon } from "@/utils/getTypeIcon";
import { getStatusIcon } from "@/utils/getStatusIcon";
import { getPaymentMethodIcon } from "@/utils/getPaymentMethodIcon";
import { loadRazorpayScript } from "@/utils/loadRazorpayScript";
import { storeOfflinePayment } from "@/utils/storeOfflinePayment";
import { useOfflinePayments } from "@/utils/offlinePaymentHandler";
import Link from "next/link";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

type UpcomingBill = {
  _id: string;
  category: string;
  vendor: string;
  amount: number;
  dueDate: string;
  billNumber: string;
  // status?: 'paid' | 'unpaid';
};

type PaymentMethod = "manual" | "upload";

type Transaction = {
  id: string;
  category: string;
  vendor: string;
  amount: number;
  status: string;
  date: string;
  paymentMethod: string;
  billNumber: string;
};

const PaymentComponent = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("manual");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);

  const [formData, setFormData] = useState({
    type: "",
    vendor: "",
    amount: "",
    dueDate: "",
    billNumber: "",
    paymentMethod: "razorpay",
    _id: "",
  });
  const [showRecentTransactions, setShowRecentTransactions] = useState(true);

  const { isOnline } = useOfflinePayments();

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

  const fetchUpcomingBills = async (): Promise<UpcomingBill[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/bills/recent`
      );

      return response.data.map((bill: UpcomingBill) => ({
        id: bill._id,
        category: bill.category,
        vendor: bill.vendor,
        amount: bill.amount,
        billNumber: bill.billNumber,
        dueDate: new Date(bill.dueDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));
    } catch (error) {
      console.error("Error fetching upcoming bills:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadUpcomingBills = async () => {
      const bills = await fetchUpcomingBills();
      setUpcomingBills(bills);
    };

    loadUpcomingBills();
  }, []);

  useEffect(() => {
    const loadRecentTransactions = async () => {
      const transactions = await fetchRecentTransactions();
      setRecentTransactions(transactions);
    };

    loadRecentTransactions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBillPayment = (bill: UpcomingBill) => {
    const parsedDate = new Date(bill.dueDate);
    const formattedDate = parsedDate.toISOString().split("T")[0];
    const updatedFormData = {
      _id: bill._id,
      amount: bill.amount.toString(),
      dueDate: formattedDate,
      billNumber: bill.billNumber,
      type: bill.category,
      vendor: bill.vendor,
      paymentMethod: "",
    };

    setFormData(updatedFormData);
  };

  async function handleClickPayment() {
    try {
      if (
        !formData.type ||
        !formData.vendor ||
        !formData.amount ||
        !formData.dueDate ||
        !formData.billNumber
      ) {
        toast.error(
          "Please fill in all fields before proceeding with payment."
        );
        return;
      }

      const paymentData = {
        paymentId: formData._id || "",
        categoryName: formData.type,
        vendorName: formData.vendor,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        billNumber: formData.billNumber,
        paymentMethod: formData.paymentMethod,
        currentStatus: "initiated" as
          | "initiated"
          | "pending"
          | "verified"
          | "completed"
          | "failed", // initiated, pending, verified ,completed, failed
        orderId: "",
      };

      storeOfflinePayment(paymentData);

      if (isOnline) {
        const orderResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/payments/initiate`,
          paymentData
        );

        if (orderResponse.status == 200) {
          loadRazorpayScript(() => {
            const rzp = new window.Razorpay({
              key: process.env.NEXT_PUBLIC_Key_Id || "",
              amount: orderResponse.data.amount,
              currency: orderResponse.data.currency,
              order_id: orderResponse.data.orderId,
              name: "PayVault.ai",
              description: `Payment for ${paymentData.billNumber}`,
              handler: async (response: RazorpayResponse) => {
                try {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/payments/verify`,
                    {
                      ...response,
                      paymentData,
                    }
                  );
                  toast.success("Payment Successful!");
                  storeOfflinePayment({
                    ...paymentData,
                    orderId: orderResponse.data.order_id,
                    currentStatus: "verified" as
                      | "initiated"
                      | "pending"
                      | "verified"
                      | "completed"
                      | "failed",
                  });
                } catch (error) {
                  console.error("Payment verification failed:", error);
                  toast.error("Payment verification failed");
                }
              },
              prefill: {
                name: paymentData.vendorName,
              },
              theme: {
                color: "#3399cc",
              },
            });
            rzp.open();
          });
        } else {
          toast.error(
            "Payment have been stored Successfully, Network Error Occured , once Online Payment will be Handled Automatically!"
          );
        }
        fetchRecentTransactions();
        fetchUpcomingBills();
      } else {
        toast.success(
          `Your Payment with billNumber ${paymentData.billNumber} have been stored and will automatically proceed once you will come online!`
        );
      }
    } catch (error) {
      console.error("Error handling payment click:", error);
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        toast.error((error as { data: { message: string } }).data.message);
      } else {
        toast.error(
          "An error occurred while processing the payment. PayVault will handle this payment Automatically!"
        );
      }
    }
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Pay Securely Using PayVault.ai&#39;s Safe Offline Payment System
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Payment Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="hidden border-b border-gray-200">
                <button
                  className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "upload"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("upload")}
                >
                  <FileUp className="w-5 h-5" />
                  Upload Document
                </button>
                <button
                  className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === "manual"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setPaymentMethod("manual")}
                >
                  <Plus className="w-5 h-5" />
                  Manual Entry
                </button>
              </div>

              {/* Document Upload Section */}
              {paymentMethod === "upload" && (
                <div className="p-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors hover:border-blue-400">
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Drag & drop your bill here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      or browse files (PDF, JPG, PNG, CSV, Excel)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <FileInput className="w-4 h-4" />
                      Select File
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB •{" "}
                              {selectedFile.type || "Unknown type"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert("Processing file...")}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <HardDriveDownload className="w-4 h-4" />
                          Process
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Entry Section */}
              {paymentMethod === "manual" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        Category
                      </label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                      />
                      {/* <option value="">Select Type</option>
                        <option value="Food">Food</option>
                        <option value="Bills">Bills</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Subscription">Subscription</option>
                        <option value="Rent">Rent</option>
                      </select> */}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-500" />
                        Bill Number
                      </label>
                      <input
                        type="text"
                        name="billNumber"
                        value={formData.billNumber || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter bill number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-500" />
                        Vendor
                      </label>
                      <input
                        type="text"
                        name="vendor"
                        value={formData.vendor}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Vendor name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        Total Payable Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleClickPayment}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm hover:shadow-md"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </button>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setShowRecentTransactions(!showRecentTransactions)
                }
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-500" />
                  <h2 className="font-medium">Recent Transactions</h2>
                </div>
                {/* {showRecentTransactions ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )} */}
                <Link className="hover:underline" href={"/past-transactions"}>
                  View all
                </Link>
              </button>

              {showRecentTransactions && (
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bill Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vendor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount Paid
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentTransactions.slice(0, 7).map((txn) => (
                          <tr
                            key={txn.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {txn?.billNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(txn.category)}
                                <span className="text-sm font-medium">
                                  {txn.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {txn.vendor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              ₹{txn.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(txn.paymentMethod)}
                                <span className="text-sm text-gray-500">
                                  {txn.paymentMethod}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(txn.status)}
                                <span className="text-sm capitalize">
                                  {txn.status === "initiated"
                                    ? "Processing via PayVault.ai engine."
                                    : txn.status === "verfied"
                                    ? "Processing"
                                    : txn.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {txn.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Upcoming Bills */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h2 className="font-medium flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  Upcoming Bills
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingBills.map((bill: UpcomingBill, index: number) => (
                  <div
                    key={bill._id ?? bill.billNumber ?? index}
                    className="p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(bill.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{bill.vendor}</h3>
                          <span className="font-medium">
                            ₹{bill.amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{bill.category}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Due{" "}
                            {new Date(bill.dueDate).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBillPayment(bill)}
                      className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Pay Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
