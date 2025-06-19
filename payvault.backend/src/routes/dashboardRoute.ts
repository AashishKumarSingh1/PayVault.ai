import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";

const router = Router();

router.get("/categoryWithCount",DashboardController.categoryWithBillCount);
router.get("/vendorWithCount",DashboardController.VendorWithBillCount);
router.get("/monthlyExpenditure",DashboardController.monthlyExpenditure)
router.get("/monthlyBill",DashboardController.monthlyBillPayments)
router.get("/paymentStatusCount",DashboardController.paymentStatusCounts)
router.get("/overview",DashboardController.overview)
export default router;