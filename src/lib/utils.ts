import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case "critical": return "priority-critical";
    case "high":     return "priority-high";
    case "elevated":
    case "medium":   return "priority-medium";
    case "low":      return "priority-low";
    default:         return "badge-muted";
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":   return "badge-success";
    case "pending":
    case "submitted":  return "badge-info";
    case "under review":
    case "draft":      return "badge-muted";
    case "rejected":
    case "restricted": return "badge-danger";
    case "resolved":
    case "closed":     return "badge-success";
    default:           return "badge-muted";
  }
}
