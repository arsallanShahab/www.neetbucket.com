import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IN",
  }).format(price);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercentage(num: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatTime(time: string) {
  return new Date(time).toLocaleTimeString();
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

export function excerpt(text: string, length = 100) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

//check if the image link starts with // if yes then add https: to it
export function convertToHttpsLink(link: string) {
  return link.startsWith("//") ? "https:" + link : link;
}

export function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

//generate receipt for razorpay
export function generateReceipt() {
  return `receipt-${Date.now()}`;
}

const receipt = generateReceipt(); // receipt-1634567890123w

const isServer = typeof window === "undefined";

export function getLocalStorageItem(key: string) {
  if (isServer) return null;
  return localStorage.getItem(key);
}

export const handleDownload = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.click();
};

// const handleDownload = (url, name) => async () => {
//   const link = document.createElement("a");
//   link.href = url;
//   console.log(link, "link");
//   link.download = `${name}-full.pdf`;
//   link.target = "_blank";
//   link.click();
// };
