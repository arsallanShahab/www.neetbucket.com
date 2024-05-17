import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface GetState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseGetOptions {
  showToast?: boolean;
  headers?: Record<string, string>;
}

const cache = new Map<string, Map<string, any>>();

function useGet<T>({
  showToast = true,
  headers = {},
}: UseGetOptions = {}): GetState<T> & {
  getData: (
    url: string,
    tag?: string,
    messages?: {
      loading?: string;
      success?: string;
      failure?: string;
    },
  ) => Promise<void>;
  invalidateCache: (tag: string) => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const getData = async (
    url: string,
    tag: string = "default",
    messages: {
      loading?: string;
      success?: string;
      failure?: string;
    } = {},
  ) => {
    setLoading(true);
    let loading_toast: string | undefined;
    let tagCache = cache.get(tag);
    if (tagCache && tagCache.has(url)) {
      setData(tagCache.get(url));
      setLoading(false);
    } else {
      if (showToast) {
        loading_toast = toast.loading(messages?.loading || "Loading...");
      }
      try {
        const response: AxiosResponse<T> = await axios.get<T>(url, { headers });
        setData(response.data);
        if (!tagCache) {
          tagCache = new Map<string, any>();
          cache.set(tag, tagCache);
        }
        tagCache.set(url, response.data);
        if (showToast) {
          toast.success(messages?.success || "Data loaded successfully");
        }
      } catch (error) {
        const err = error as AxiosError & {
          response: { data: { message: string } };
        };
        setError(new Error(err?.response?.data?.message));
        if (showToast) {
          toast.error(
            messages.failure ||
              err?.response?.data?.message ||
              "An error occurred",
          );
        }
      } finally {
        setLoading(false);
        if (showToast && loading_toast) {
          toast.dismiss(loading_toast);
        }
      }
    }
  };

  const invalidateCache = (tag: string, showToast: boolean = true) => {
    cache.delete(tag);
    if (showToast) {
      toast.success("Cache invalidated successfully");
    }
  };

  return { data, error, loading, getData, invalidateCache };
}

export default useGet;
