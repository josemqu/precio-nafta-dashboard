"use client";

import { useQuery } from "@tanstack/react-query";
import { Station } from "@/lib/api-client";
import { apiClient } from "@/lib/api-client";

interface StationsFilters {
  province?: string;
  town?: string;
  flag?: string;
  flag_id?: number;
  product?: string;
  product_id?: number;
  hour_type_id?: number;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 12;

export function useStations(filters: StationsFilters = {}) {
  const queryKey = ["stations", { ...filters, page: filters.page || 1 }];

  const fetchStations = async (): Promise<PaginatedResponse<Station>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    // Add pagination parameters
    const page = filters.page || 1;
    const limit = filters.limit || DEFAULT_PAGE_SIZE;

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `/stations${queryString ? `?${queryString}` : ""}`;

    try {
      console.log("Fetching stations from:", url);
      const allStations = await apiClient<Station[]>(
        url,
        {
          method: "GET",
        },
        true
      ); // true indica que requiere autenticación

      console.log("API Response:", allStations);

      // Apply client-side pagination
      const page = filters.page || 1;
      const pageSize = filters.limit || DEFAULT_PAGE_SIZE;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedStations = allStations.slice(startIndex, endIndex);

      const result = {
        data: paginatedStations,
        total: allStations.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(allStations.length / pageSize),
      };

      console.log("Pagination info:", {
        totalStations: allStations.length,
        page,
        pageSize,
        startIndex,
        endIndex,
        totalPages: result.totalPages,
        stationsInPage: paginatedStations.length,
      });

      return result;
    } catch (error) {
      console.error("Error fetching stations:", error);
      throw error;
    }
  };

  return useQuery<PaginatedResponse<Station>, Error>({
    queryKey,
    queryFn: fetchStations,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
