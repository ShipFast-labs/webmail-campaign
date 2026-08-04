import axios from "axios";

export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error?.message ?? "Something went wrong. Try again.";
  }
  return "Something went wrong. Try again.";
}
