"use client";
import { useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadRazorpayScript } from "./loadRazorpayScript";
import { storeOfflinePayment } from "./storeOfflinePayment";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const useOfflinePayments = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const processPendingPayments = useCallback(async () => {
    try {
      const pendingPayments: string[] = JSON.parse(
        localStorage.getItem("pendingPayments") || "[]"
      );

      if (pendingPayments.length > 0 && isOnline) {
        const processingToast = toast.loading(
          "Processing pending offline payments...",
          { id: "processing" }
        );

        let successCount = 0;
        let failedCount = 0;

        for (const encryptedPayment of pendingPayments) {
          try {
            const bytes = CryptoJS.AES.decrypt(
              encryptedPayment,
              ENCRYPTION_KEY
            );
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            const paymentData = JSON.parse(decrypted);

            const orderResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/payments/initiate`,
              paymentData
            );

            if (
              orderResponse.status === 200 &&
              orderResponse.data?.orderId &&
              paymentData.currentStatus == "initiated"
            ) {
              await new Promise<void>((resolve) => {
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
                          orderId: orderResponse.data.orderId,
                          currentStatus: "verified",
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
                  resolve();
                });
              });
            }
            if (paymentData.currentStatus == "verified") {
              successCount++;
              const updatedPayments = pendingPayments.filter(
                (p) => p !== encryptedPayment
              );
              localStorage.setItem(
                "pendingPayments",
                JSON.stringify(updatedPayments)
              );
            }
          } catch (err) {
            console.error("Error processing individual payment:", err);
            failedCount++;
          }
        }

        toast.dismiss(processingToast);

        if (successCount > 0) {
          toast.success(
            `${successCount} offline payment(s) processed successfully.`
          );
        }
        if (failedCount > 0) {
          toast.error(
            `${failedCount} payment(s) failed. Check console for details.`
          );
        }
      }
    } catch (error) {
      console.error("Error processing all pending payments:", error);
      toast.error("Error processing pending payments. Check console.");
    }
  }, [isOnline]);

  useEffect(() => {
    const handleInitialStatus = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);
      if (onlineStatus) {
        processPendingPayments();
      } else {
        toast.error("You are currently offline");
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online! Handling pending payments...");
      processPendingPayments();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are now offline");
    };

    handleInitialStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [processPendingPayments]);

  return { isOnline };
};
