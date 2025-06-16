"use client";
import React, { useState, useRef } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  CreditCard,
  Utensils,
  ShoppingBag,
  Bus,
  Wifi,
  Smartphone,
  Film,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Dummy data
const allTransactions = [
  {
    id: 1,
    type: "Food",
    vendor: "Swiggy",
    amount: "₹450",
    status: "Success",
    date: "12 May 2024",
    paymentMethod: "UPI",
    timestamp: new Date(2024, 4, 12).getTime(),
  },
  {
    id: 2,
    type: "Bills",
    vendor: "BSNL",
    amount: "₹799",
    status: "Pending",
    date: "10 May 2024",
    paymentMethod: "Auto-Debit",
    timestamp: new Date(2024, 4, 10).getTime(),
  },
  {
    id: 3,
    type: "Subscription",
    vendor: "Jio",
    amount: "₹299",
    status: "Success",
    date: "8 May 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 4, 8).getTime(),
  },
  {
    id: 4,
    type: "Shopping",
    vendor: "Amazon",
    amount: "₹1,299",
    status: "Failed",
    date: "5 May 2024",
    paymentMethod: "Net Banking",
    timestamp: new Date(2024, 4, 5).getTime(),
  },
  {
    id: 5,
    type: "Transport",
    vendor: "Uber",
    amount: "₹320",
    status: "Success",
    date: "3 May 2024",
    paymentMethod: "Wallet",
    timestamp: new Date(2024, 4, 3).getTime(),
  },
  {
    id: 6,
    type: "Entertainment",
    vendor: "Netflix",
    amount: "₹799",
    status: "Success",
    date: "1 May 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 4, 1).getTime(),
  },
  {
    id: 7,
    type: "Entertainment",
    vendor: "Spotify",
    amount: "₹299",
    status: "Pending",
    date: "28 Apr 2024",
    paymentMethod: "UPI",
    timestamp: new Date(2024, 3, 28).getTime(),
  },
  {
    id: 8,
    type: "Food",
    vendor: "Zomato",
    amount: "₹550",
    status: "Success",
    date: "27 Apr 2024",
    paymentMethod: "UPI",
    timestamp: new Date(2024, 3, 27).getTime(),
  },
  {
    id: 9,
    type: "Bills",
    vendor: "Electricity",
    amount: "₹1,200",
    status: "Success",
    date: "25 Apr 2024",
    paymentMethod: "Auto-Debit",
    timestamp: new Date(2024, 3, 25).getTime(),
  },
  {
    id: 10,
    type: "Shopping",
    vendor: "Flipkart",
    amount: "₹2,499",
    status: "Success",
    date: "22 Apr 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 3, 22).getTime(),
  },
  {
    id: 11,
    type: "Transport",
    vendor: "Ola",
    amount: "₹280",
    status: "Failed",
    date: "20 Apr 2024",
    paymentMethod: "Wallet",
    timestamp: new Date(2024, 3, 20).getTime(),
  },
  {
    id: 12,
    type: "Subscription",
    vendor: "Prime",
    amount: "₹1,499",
    status: "Success",
    date: "18 Apr 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 3, 18).getTime(),
  },
  {
    id: 13,
    type: "Bills",
    vendor: "Internet",
    amount: "₹899",
    status: "Pending",
    date: "15 Apr 2024",
    paymentMethod: "Auto-Debit",
    timestamp: new Date(2024, 3, 15).getTime(),
  },
  {
    id: 14,
    type: "Food",
    vendor: "Dunzo",
    amount: "₹650",
    status: "Success",
    date: "12 Apr 2024",
    paymentMethod: "UPI",
    timestamp: new Date(2024, 3, 12).getTime(),
  },
  {
    id: 15,
    type: "Shopping",
    vendor: "Myntra",
    amount: "₹1,799",
    status: "Success",
    date: "10 Apr 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 3, 10).getTime(),
  },
  {
    id: 16,
    type: "Transport",
    vendor: "Rapido",
    amount: "₹150",
    status: "Success",
    date: "8 Apr 2024",
    paymentMethod: "Wallet",
    timestamp: new Date(2024, 3, 8).getTime(),
  },
  {
    id: 17,
    type: "Subscription",
    vendor: "Hotstar",
    amount: "₹499",
    status: "Failed",
    date: "5 Apr 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 3, 5).getTime(),
  },
  {
    id: 18,
    type: "Bills",
    vendor: "Water",
    amount: "₹350",
    status: "Success",
    date: "3 Apr 2024",
    paymentMethod: "Auto-Debit",
    timestamp: new Date(2024, 3, 3).getTime(),
  },
  {
    id: 19,
    type: "Food",
    vendor: "Pizza Hut",
    amount: "₹899",
    status: "Success",
    date: "1 Apr 2024",
    paymentMethod: "UPI",
    timestamp: new Date(2024, 3, 1).getTime(),
  },
  {
    id: 20,
    type: "Entertainment",
    vendor: "BookMyShow",
    amount: "₹600",
    status: "Success",
    date: "29 Mar 2024",
    paymentMethod: "Card",
    timestamp: new Date(2024, 2, 29).getTime(),
  },
];

const allTypes = [...new Set(allTransactions.map((txn) => txn.type))];
const allStatuses = [...new Set(allTransactions.map((txn) => txn.status))];

const RecentTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const tableRef = useRef<HTMLTableElement>(null);
  const itemsPerPage = 15;

  const filteredTransactions = allTransactions
    .filter((txn) => {
      const typeMatch = selectedType === "All" || txn.type === selectedType;
      const statusMatch =
        selectedStatus === "All" || txn.status === selectedStatus;
      return typeMatch && statusMatch;
    })
    .sort((a, b) => {
      return dateSort === "desc"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Food":
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case "Bills":
        return <Wifi className="w-4 h-4 text-blue-500" />;
      case "Shopping":
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case "Transport":
        return <Bus className="w-4 h-4 text-green-500" />;
      case "Entertainment":
        return <Film className="w-4 h-4 text-pink-500" />;
      case "Subscription":
        return <Smartphone className="w-4 h-4 text-teal-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
    }
  };
  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Transaction Report - PayVault.ai", 14, 22);

    doc.setFontSize(10);
    let filtersText = "All Transactions";
    if (selectedType !== "All" || selectedStatus !== "All") {
      filtersText = `Filters: ${
        selectedType !== "All" ? `Type: ${selectedType}` : ""
      }${selectedType !== "All" && selectedStatus !== "All" ? ", " : ""}${
        selectedStatus !== "All" ? `Status: ${selectedStatus}` : ""
      }`;
    }
    doc.text(filtersText, 14, 30);

    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    const headers = [
      ["ID", "Type", "Vendor", "Amount", "Status", "Payment Method", "Date"],
    ];
    const data = filteredTransactions.map((txn) => [
      txn.id.toString(),
      txn.type,
      txn.vendor,
      txn.amount,
      txn.status,
      txn.paymentMethod,
      txn.date,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(
      `PayVault_Transactions_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  const toggleDateSort = () => {
    setDateSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          Recent Transactions
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Types</option>
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-100"
          >
            <Download className="w-4 h-4" />
            Export to PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={toggleDateSort}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                  {dateSort === "asc" ? "↑" : "↓"}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(txn.type)}
                    <span className="text-sm font-medium">{txn.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {txn.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(txn.status)}
                    <span className="text-sm">{txn.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} transactions
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`p-1 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
