import { Request, Response, NextFunction } from "express";
import Bill from "../models/Bill";
import Payment from "../models/Payment";
import BillCategory from "../models/BillCategory";
import Vendor from "../models/Vendor";

export class DashboardController {
  static async categoryWithBillCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const spending = await Bill.aggregate([
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            billCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "billcategories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            categoryName: "$categoryDetails.name",
            totalAmount: 1,
            billCount: 1,
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ]);

      res.status(200).json(spending);
    } catch (error) {
      console.error(
        "Error during sending category spending with bill count:",
        error
      );
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async VendorWithBillCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const spending = await Bill.aggregate([
        {
          $group: {
            _id: "$vendor",
            totalAmount: { $sum: "$amount" },
            billCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "vendors",
            localField: "_id",
            foreignField: "_id",
            as: "vendorDetails",
          },
        },
        {
          $unwind: "$vendorDetails",
        },
        {
          $project: {
            _id: 0,
            vendorId: "$_id",
            vendorName: "$vendorDetails.name",
            totalAmount: 1,
            billCount: 1,
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ]);

      res.status(200).json(spending);
    } catch (error) {
      console.error(
        "Error during sending vendor spending with bill count:",
        error
      );
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async monthlyBillPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await Bill.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            paidBillsCount: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            paidBillsCount: 1,
            _id: 0,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching monthly bill payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async monthlyExpenditure(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await Payment.aggregate([
        {
          $match: {
            status: { $in: ["verified", "completed"] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$paidDate" },
              month: { $month: "$paidDate" },
            },
            totalExpenditure: { $sum: "$paidAmount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            totalExpenditure: 1,
            paymentCount: "$count",
            _id: 0,
          },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching monthly expenditure:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async paymentStatusCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await Payment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: "$_id",
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { status: 1 },
        },
      ]);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching payment status counts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async overview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const [
        totalCategories,
        totalVendors,
        totalBills,
        pendingBills,
        paidBills,
        overdueBills,
        totalPayments,
        successfulPayments,
        pendingPayments,
      ] = await Promise.all([
        BillCategory.countDocuments(),
        Vendor.countDocuments(),
        Bill.countDocuments(),
        Bill.countDocuments({ status: "pending" }),
        Bill.countDocuments({ status: "paid" }),
        Bill.countDocuments({ status: "overdue" }),
        Payment.countDocuments(),
        Payment.countDocuments({ status: { $in: ["verified", "completed"] } }),
        Payment.countDocuments({
          status: { $in: ["pending", "initiated", "processing"] },
        }),
      ]);

      res.status(200).json({
        categories: totalCategories,
        vendors: totalVendors,
        bills: {
          total: totalBills,
          pending: pendingBills,
          paid: paidBills,
          overdue: overdueBills,
        },
        payments: {
          total: totalPayments,
          successful: successfulPayments,
          pending: pendingPayments,
        },
      });
    } catch (error) {
      console.error("Error generating overview data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
