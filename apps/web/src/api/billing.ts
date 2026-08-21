import { api } from "@/lib/http-client";

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceCents: number;
  currency: string;
}

export interface Balance {
  credits: number;
}

interface ApiResponse<T> {
  data: T;
}

export const billingApi = {
  getCreditPackages: () =>
    api.get<ApiResponse<CreditPackage[]>>("/billing/packages").then((r) => r.data.data),

  getBalance: () =>
    api.get<ApiResponse<Balance>>("/billing/balance").then((r) => r.data.data),

  createCheckoutSession: (packId: string) =>
    api
      .post<ApiResponse<{ checkoutUrl: string }>>("/billing/checkout", { packId })
      .then((r) => r.data.data.checkoutUrl),
};
