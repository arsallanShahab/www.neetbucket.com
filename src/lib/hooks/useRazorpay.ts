// add razorpay to window object

declare global {
  interface Window {
    Razorpay: any;
  }
}

// useRazorpay.ts
import { useState } from "react";
import { loadScript } from "../utils";

// Define the options for the Razorpay checkout form
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRazorpay = async () => {
    setLoading(true);
    try {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    } catch (err) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const open = (options: RazorpayOptions) => {
    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { loading, error, loadRazorpay, open };
};
