import { Router } from "express";
import PaymentController from "../controllers/paymentController";
const router = Router();

router.get("/recent",PaymentController.getRecentPayments);
router.get("/add_new", PaymentController.add_new);
router.post("/initiate",PaymentController.initiate);
router.post("/verify",PaymentController.verify);
router.post("status/:id",PaymentController.sendCurrStatus);

export default router;