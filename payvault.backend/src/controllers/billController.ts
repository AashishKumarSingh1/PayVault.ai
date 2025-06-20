import { Request, Response, NextFunction } from "express";
import Bill from "../models/Bill";
import {connectDb} from "../utils/connectDb";
import BillCategory from "../models/BillCategory";
import Vendor from "../models/Vendor";

class BillController {
  static async getRecentBills(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        connectDb();
      const limit = parseInt(req.query.limit as string) || 5;

      const bills = await Bill.aggregate([
        {$match: {
            status: { $in: ["pending", "overdue"] }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "billcategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "vendors",
            localField: "vendor",
            foreignField: "_id",
            as: "vendor",
          },
        },
        { $unwind: "$vendor" },
        {
          $project: {
            id: { $toString: "$_id" },
            billNumber: { $ifNull: ["$billNumber", "-"] },
            category: "$category.name",
            vendor: "$vendor.name",
            amount: 1,
            dueDate: 1,
            status: "$status",
          },
        },
      ]);

      res.status(200).json(bills);
      
    } catch (error) {
      console.error("Error fetching recent bills:", error);
      res.status(500).json({ message: "Failed to fetch recent bills" });
    }
  }

static async add_new(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      connectDb();

      const { billNumber, category, vendor, amount, dueDate, status } = req.body;

      if (!billNumber || !category || !vendor || !amount || !dueDate || !status) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      let categoryDoc = await BillCategory.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = new BillCategory({ name: category });
        await categoryDoc.save();
      }

      let vendorDoc = await Vendor.findOne({ name: vendor });
      if (!vendorDoc) {
        vendorDoc = new Vendor({ name: vendor });
        await vendorDoc.save();
      }

      let existingBill = await Bill.findOne({ billNumber });
      if (existingBill) {
        res.status(400).json({ message: "Bill with this number already exists" });
        return;
      }

      const newBill = new Bill({
        billNumber,
        category: categoryDoc._id,
        vendor: vendorDoc._id,
        amount,
        dueDate,
        status,
      });

      await newBill.save();

      res.status(201).json({
        message: "New bill added successfully",
        bill: {
          id: newBill._id,
          billNumber: newBill.billNumber,
          category: categoryDoc.name,
          vendor: vendorDoc.name,
          amount: newBill.amount,
          dueDate: newBill.dueDate,
          status: newBill.status,
        },
      });
    } catch (error) {
      console.error("Error adding new bill:", error);
      res.status(500).json({ message: "Failed to add new bill" });
    }
  }
}

export default BillController;
