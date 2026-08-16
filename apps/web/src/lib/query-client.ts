import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function getErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err?.response?.data?.message ?? err?.message ?? "Something went wrong";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        const status = (error as { response?: { status: number } })?.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    },
  },
});
