import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAllCryptos() {
  return useQuery<unknown[], Error>({
    queryKey: ["allcryptos"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );
      return data;
    },
    staleTime: 1000000,
  });
}
