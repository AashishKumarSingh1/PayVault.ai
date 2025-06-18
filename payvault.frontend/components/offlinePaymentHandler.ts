"use client";
import { useOfflinePayments } from "@/utils/offlinePaymentHandler";

export const OfflinePaymentHandler = () => {
  useOfflinePayments();
  return null;
};
