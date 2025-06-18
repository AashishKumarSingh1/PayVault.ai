import axios from "axios";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "verified"
  | "completed"
  | "failed";

export type PaymentData = {
  paymentId: string;
  categoryName: string;
  vendorName: string;
  amount: number;
  dueDate: string;
  billNumber: string;
  paymentMethod: string;
  currentStatus?: PaymentStatus;
  orderId?: string;
};

type EncryptedPayment = string;

type BackendPaymentStatusResponse = {
  status: PaymentStatus;
  orderId?: string;
};

export const storeOfflinePayment = async (
  paymentData: PaymentData
): Promise<void> => {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not defined");
    }

    const rawData = localStorage.getItem("pendingPayments");

    const pendingPayments: EncryptedPayment[] = rawData
      ? JSON.parse(rawData)
      : [];

    const updatedPayments: EncryptedPayment[] = [];
    let paymentAlreadyExists = false;

    for (const encrypted of pendingPayments) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        const existingData: PaymentData & { timestamp: number } =
          JSON.parse(decrypted);

        if (existingData.paymentId === paymentData.paymentId) {
          try {
            const response = await axios.get<BackendPaymentStatusResponse>(
              `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/payments/status/${paymentData.paymentId}`
            );
            const { status, orderId } = response.data;
 
            if (
              ["verified", "completed", "failed"].includes(
                paymentData.currentStatus || ""
              )
            ) {
              const filteredPayments = pendingPayments.filter((encrypted) => {
                const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                try {
                  const parsed = JSON.parse(decrypted);
                  return parsed.paymentId !== paymentData.paymentId;
                } catch {
                  return true;
                }
              });
              localStorage.setItem(
                "pendingPayments",
                JSON.stringify(filteredPayments)
              );
              return;
            }

            paymentData.currentStatus = status;
            paymentData.orderId = orderId;
          } catch (err) {
            console.warn("Backend status fetch failed:", err);
          }

          const updatedEncrypted = CryptoJS.AES.encrypt(
            JSON.stringify({ ...paymentData, timestamp: Date.now() }),
            ENCRYPTION_KEY
          ).toString();

          updatedPayments.push(updatedEncrypted);
          paymentAlreadyExists = true;
        } else {
          updatedPayments.push(encrypted);
        }
      } catch (err) {
        console.warn("Decryption failed for one entry:", err);
        updatedPayments.push(encrypted);
      }
    }

    if (!paymentAlreadyExists) {
      const newEncrypted = CryptoJS.AES.encrypt(
        JSON.stringify({ ...paymentData, timestamp: Date.now() }),
        ENCRYPTION_KEY
      ).toString();

      updatedPayments.push(newEncrypted);
    }

    localStorage.setItem("pendingPayments", JSON.stringify(updatedPayments));
  } catch (error) {
    console.error("Error storing/updating offline payment:", error);
  }
};
