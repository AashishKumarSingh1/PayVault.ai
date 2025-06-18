import { Request, Response, NextFunction } from "express";
import Payment from "../models/Payment";
import { connectDb } from "../utils/connectDb";
import Bill from "../models/Bill";
import BillCategory from "../models/BillCategory";
import Vendor from "../models/Vendor";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

class PaymentController {
  static async getRecentPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      connectDb();
      const limit = parseInt(req.query.limit as string) || 7;

      const payments = await Payment.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "bills",
            localField: "bill",
            foreignField: "_id",
            as: "bill",
          },
        },
        { $unwind: "$bill" },
        {
          $lookup: {
            from: "billcategories",
            localField: "bill.category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "vendors",
            localField: "bill.vendor",
            foreignField: "_id",
            as: "vendor",
          },
        },
        { $unwind: "$vendor" },
        {
          $project: {
            id: { $toString: "$_id" },
            category: "$category.name",
            vendor: "$vendor.name",
            amount: "$paidAmount",
            status: "$status",
            date: {
              $dateToString: { format: "%d %b %Y", date: "$paidDate" },
            },
            paymentMethod: "$method",
            billNumber:"$bill.billNumber"
          },
        },
      ]);

      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching recent payments:", error);
      res.status(500).json({ message: "Failed to fetch recent payments" });
    }
  }

  static async initiate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        paymentId: billId,
        categoryName,
        vendorName,
        amount,
        dueDate,
        billNumber,
      } = req.body;


      if (!amount || !billNumber || isNaN(amount)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid data provided" });
      }

      await connectDb();

      const options = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `receipt_${billNumber}_billId:_${billId}${Date.now()}`,
        payment_capture: 1,
      };

      let bill = await Bill.findOne({ billNumber: billNumber });
      console.log(billNumber, "is bill number", bill);
      if (!bill) {
        let category = await BillCategory.findOneAndUpdate(
          { name: categoryName },
          {},
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        let vendor = await Vendor.findOneAndUpdate(
          { name: vendorName },
          {},
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        bill = await Bill.create({
          category: category._id,
          vendor: vendor._id,
          amount,
          dueDate,
          billNumber,
          status: "pending",
        });
      } else {
        bill.status = "pending";
        await bill.save();
      }

      const order = await razorpay.orders.create(options);

      let payment = await Payment.findOne({ bill: bill._id });

      if (!payment) {
        payment = await Payment.create({
          bill: bill._id,
          paymentNumber: order.id,
          method: "razorpay",
          paidAmount: amount,
          paidDate: new Date(),
          status: "initiated",
        });
      } else {
        payment.paymentNumber = order.id;
        payment.paidDate = new Date();
        payment.method = "razorpay";
        await payment.save();
      }

      res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error("An error occurred: ", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  static async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentData,
      } = req.body;

      const { paymentId: billId, billNumber } = paymentData || {};

      await connectDb();

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
        return;
      }

      const bill = await Bill.findOne({ billNumber });

      if (!bill) {
        res.status(404).json({
          success: false,
          message: "Bill not found",
        });
        return;
      }

      bill.status = "paid";
      await bill.save();

      const payment = await Payment.findOne({ bill: bill._id });
      if (payment) {
        payment.status = "completed";
        await payment.save();
      }

      res.status(200).json({
        success: true,
        message: "Payment verified and updated successfully",
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Payment verification failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  static async sendCurrStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.query.id as string;

      if (!id) {
        res.status(400).json({ success: false, message: "Missing payment ID" });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid payment ID" });
        return;
      }

      const payment = await Payment.findById(id);

      if (!payment) {
        res.status(404).json({ success: false, message: "Payment not found" });
        return;
      }

      res.status(200).json({
        success: true,
        status: payment.status,
        orderId: payment.paymentNumber,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async add_new(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await connectDb();

      const {
        amount,
        billNumber,
        categoryName,
        dueDate,
        paymentId,
        paymentMethod,
        vendorName,
      } = req.body;

      let bill = await Bill.findOne({ billNumber });

      if (!bill) {
        let category = await BillCategory.findOne({ name: categoryName });
        if (!category) {
          category = await BillCategory.create({ name: categoryName });
        }

        let vendor = await Vendor.findOne({ name: vendorName });
        if (!vendor) {
          vendor = await Vendor.create({ name: vendorName });
        }

        bill = await Bill.create({
          category: category._id,
          vendor: vendor._id,
          amount,
          dueDate,
          billNumber,
          status: "pending",
        });
      }

      const payment = await Payment.create({
        bill: bill._id,
        paymentNumber: uuidv4(),
        method: paymentMethod,
        paidAmount: amount,
        paidDate: new Date(),
        status: "success",
      });

      bill.status = "paid";
      await bill.save();

      res.status(201).json({
        message: "Payment successfully recorded",
        payment,
        bill,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default PaymentController;
