"use client";
import React, { useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Upload,
  Edit,
  ChevronDown,
  FileText,
  Clock,
  Utensils,
  ShoppingBag,
  Wifi,
  Droplets,
  Zap,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

type Bill = {
  id: string;
  billNumber?: string;
  category: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status?: "pending" | "paid" | "overdue";
  source?: "sms" | "email" | "upload" | "manual";
};

type ExtractedBill = Omit<Bill, "id" | "status"> & {
  id?: string;
  selected?: boolean;
};

const BillSyncComponent = () => {
  const [activeTab, setActiveTab] = useState<"sync" | "manual">("sync");
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [manualBill, setManualBill] = useState({
    category: "",
    vendor: "",
    amount: "",
    dueDate: "",
    billNumber: "",
  });
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [extractedBills, setExtractedBills] = useState<ExtractedBill[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [file, setFile] = useState<File | null>(null);

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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !manualBill.category ||
      !manualBill.vendor ||
      !manualBill.amount ||
      !manualBill.dueDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const newBill: Bill = {
      id: Math.random().toString(36).substring(2, 8),
      billNumber:
        manualBill.billNumber ||
        `BILL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      category: manualBill.category,
      vendor: manualBill.vendor,
      amount: parseFloat(manualBill.amount),
      dueDate: manualBill.dueDate,
      status: "pending",
      source: "manual",
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/bills/add_new`,
        newBill
      )
      .then(() => {
        toast.success("Bill added successfully!");
        setManualBill({
          category: "",
          vendor: "",
          amount: "",
          dueDate: "",
          billNumber: "",
        });
        console.log("Added bill:", newBill);
        setRecentBills((prev) => [newBill, ...prev.slice(0, 4)]);
      })
      .catch((error) => {
        console.error("Error adding bill:", error);
        const message = error?.response?.data?.message || "Failed to add bill";
        toast.error(message);
      });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFile = e.target.files[0];
    // setFile(selectedFile);

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("files", selectedFile);

    try {
      setIsUploading(true);
      toast.loading("Extracting bill details...");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_GENAI}/image-reader`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();

      if (response.data && response.data.success) {
        const extracted = response.data.data;

        const cleanedBill = {
          category: extracted.category?.trim() || "",
          vendor: extracted.vendor?.trim() || "",
          amount: extracted.amount?.toString().trim() || "",
          dueDate: extracted.due_date || "",
          billNumber: extracted.bill_number?.trim() || "",
        };

        setExtractedBills([cleanedBill]);
        setActiveTab("manual");
        setManualBill(cleanedBill);
        toast.success("Bill details extracted successfully!");
        console.log(response.data, "extracted:", cleanedBill);
      } else {
        toast.error("No bill data found in the document");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to extract bill details");
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGmailSync = () => {
    setShowGmailModal(true);
    setExtractedBills([
      {
        billNumber: "GMAIL-001",
        category: "Internet",
        vendor: "Jio Fiber",
        amount: 899,
        dueDate: "2025-06-10",
        source: "email",
        selected: true,
      },
      {
        billNumber: "GMAIL-002",
        category: "Electricity",
        vendor: "Adani Electricity",
        amount: 1850,
        dueDate: "2025-06-15",
        source: "email",
        selected: true,
      },
      {
        billNumber: "GMAIL-003",
        category: "Water",
        vendor: "SMC Water",
        amount: 420,
        dueDate: "2025-06-18",
        source: "email",
        selected: true,
      },
    ]);
  };

  // const handleGmailSubmit = () => {
  //   const selectedBills = extractedBills
  //     .filter((bill) => bill.selected)
  //     .map((bill) => ({
  //       ...bill,
  //       id: Math.random().toString(36).substring(2, 8),
  //       status: "pending" as const,
  //     }));

  //   if (selectedBills.length === 0) {
  //     toast.error("Please select at least one bill");
  //     return;
  //   }

  //   setRecentBills((prev) => [
  //     ...(selectedBills as Bill[]),
  //     ...prev.slice(0, 5 - selectedBills.length),
  //   ]);
  //   setShowGmailModal(false);
  //   toast.success(`${selectedBills.length} bill(s) added successfully!`);
  //   console.log("Added bills from Gmail:", selectedBills);
  // };

  const toggleBillSelection = (index: number) => {
    const updatedBills = [...extractedBills];
    updatedBills[index].selected = !updatedBills[index].selected;
    setExtractedBills(updatedBills);
  };

  const toggleSelectAll = () => {
    const allSelected = extractedBills.every((bill) => bill.selected);
    setExtractedBills(
      extractedBills.map((bill) => ({
        ...bill,
        selected: !allSelected,
      }))
    );
  };

  const getTypeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "food":
        return <Utensils className="w-4 h-4" />;
      case "shopping":
        return <ShoppingBag className="w-4 h-4" />;
      case "internet":
        return <Wifi className="w-4 h-4" />;
      case "water":
        return <Droplets className="w-4 h-4" />;
      case "electricity":
        return <Zap className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "overdue":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Overdue
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const handleSync = (source: "email" | "upload" | "sms") => {
    switch (source) {
      case "email":
        handleGmailSync();
        break;
      case "upload":
        document.getElementById("bill-upload")?.click();
        break;
      case "sms":
        toast.error("Coming soon - stay tuned!");
        break;
      default:
        toast.error("Unknown sync source");
    }
  };

  return (
    <div className="mx-auto max-w-7xl bg-white rounded-lg shadow-md overflow-hidden">
      {showGmailModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md  bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Extracted Bills from Gmail
                </h3>
                <button
                  onClick={() => setShowGmailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {extractedBills.filter((b) => b.selected).length} of{" "}
                  {extractedBills.length} selected
                </p>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {extractedBills.every((b) => b.selected)
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="space-y-3">
                {extractedBills.map((bill, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      bill.selected
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!bill.selected}
                        onChange={() => toggleBillSelection(index)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {bill.vendor}
                        </p>
                        <div className="flex gap-2 text-sm text-gray-600">
                          <span>{bill.category}</span>
                          <span>•</span>
                          <span>₹{bill.amount.toFixed(2)}</span>
                          <span>•</span>
                          <span>
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </span>
                          {bill.billNumber && (
                            <>
                              <span>•</span>
                              <span>Bill Number: {bill.billNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowGmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleGmailSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-blue-700"
                >
                  Stay Tuned Updating Soon!!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        id="bill-upload"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isUploading}
      />

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Bill Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add new bills via sync or manual entry
        </p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "sync"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("sync")}
        >
          <Upload className="w-4 h-4" />
          Sync Bill
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "manual"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          <Edit className="w-4 h-4" />
          Enter Manually
        </button>
      </div>

      <div className="p-6">
        {activeTab === "sync" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleSync("upload")}
              disabled={isUploading}
              className={`flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Upload Bill</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {isUploading
                  ? "Processing..."
                  : "Upload PDF or image to extract details"}
              </p>
            </button>

            <button
              onClick={() => handleSync("email")}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Sync from Email</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Connect your email to import bills
              </p>
            </button>

            <button
              onClick={() => handleSync("sms")}
              className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Sync from SMS</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Extract bill details from text messages
              </p>
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bill-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="bill-type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Food, Electricity"
                  value={manualBill.category}
                  onChange={(e) =>
                    setManualBill({ ...manualBill, category: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="vendor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vendor
                </label>
                <input
                  type="text"
                  id="vendor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Swiggy, Airtel"
                  value={manualBill.vendor}
                  onChange={(e) =>
                    setManualBill({ ...manualBill, vendor: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={manualBill.amount}
                  onChange={(e) =>
                    setManualBill({ ...manualBill, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="due-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="due-date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={manualBill.dueDate}
                  onChange={(e) =>
                    setManualBill({ ...manualBill, dueDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bill-number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bill Number (Optional)
              </label>
              <input
                type="text"
                id="bill-number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. INV-2024-001"
                value={manualBill.billNumber}
                onChange={(e) =>
                  setManualBill({ ...manualBill, billNumber: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Bill
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="border-t border-gray-200 px-6 pb-6">
        <div className="flex items-center justify-between mb-4 pt-6">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Recent Bills
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th> */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bill Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center"
                >
                  Due Date
                  <ChevronDown className="w-4 h-4 ml-1" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.id}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.billNumber || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                    {getTypeIcon(bill.category)}
                    {bill.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    ₹{bill.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(bill.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillSyncComponent;
