"use client";

import { Card } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useGlobalMarket } from "../hooks/useGlobalMarket";
import { marketGlobalSchema } from "../data/marketGlobalSchema";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

type GlobalData = {
  activeCryptos: number;
  totalMarketCap: number;
  totalVolume: number;
  bitCoinDominance: number;
  marketCapChange: number;
};

export function CryptoOverview() {
  const [globalData, setGlobalData] = useState<GlobalData>();
  const { data: globalMarketData, isLoading } = useGlobalMarket();

  useEffect(() => {
    // Only process data when loading is complete and data exists
    if (!isLoading && globalMarketData) {
      try {
        // Directly access the data property
        const parsedData = marketGlobalSchema.parse(globalMarketData);

        if (!parsedData?.data) {
          console.error("Parsed data is empty");
          return;
        }

        const {
          total_market_cap = {},
          total_volume = {},
          active_cryptocurrencies = 0,
          market_cap_percentage = {},
          market_cap_change_percentage_24h_usd = 0,
        } = parsedData.data;

        // Use reduce to sum up the values
        const totalMarketCapSum = Object.values(total_market_cap).reduce(
          (sum, value) => sum + value,
          0
        );

        const totalVolumeSum = Object.values(total_volume).reduce(
          (sum, value) => sum + value,
          0
        );

        const bitCoinDominance = market_cap_percentage.btc
          ? parseFloat(market_cap_percentage.btc.toFixed(2))
          : 0;

        const formattedData: GlobalData = {
          activeCryptos: active_cryptocurrencies,
          totalMarketCap: totalMarketCapSum,
          totalVolume: totalVolumeSum,
          bitCoinDominance,
          marketCapChange: market_cap_change_percentage_24h_usd,
        };

        setGlobalData(formattedData);
      } catch (error) {
        console.error("Error parsing market data:", error);

        // If it's a ZodError, log more details
        if (error instanceof z.ZodError) {
          console.error(
            "Zod Error Details:",
            JSON.stringify(error.errors, null, 2)
          );
        }
      }
    }
  }, [globalMarketData, isLoading]); // Add isLoading to dependency array
  const formattedNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  return (
    <div>
      <Card className="p-7 space-y-6 rounded-lg shadow-none border-none">
        <h2 className="text-xl font-semibold mb-5">Market Overview</h2>

        {/* Top Metrics Section */}
        <div className="grid gap-4 sm:grid-cols-2 pb-4   pt-3">
          {globalData ? (
            <>
              <Card className="p-2 py-8 flex flex-col items-center gap-2  justify-center shadow-none">
                <span className="text-sm bg-primary/10 p-[6px] px-7 rounded-md text-primary">
                  {globalData.marketCapChange.toFixed(2)}%
                </span>

                <p className="text-2xl font-bold">
                  ${formattedNumber(globalData.totalMarketCap)}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Market Cap
                </p>
              </Card>

              <Card className="p-4 flex flex-col gap-[8px] items-center justify-center shadow-none">
                <span className="text-sm bg-primary/10 p-[6px] px-7 rounded-md text-primary">
                  -
                </span>
                <p className="text-2xl font-bold ">
                  ${formattedNumber(globalData.totalVolume)}
                </p>

                <p className="text-xs font-medium text-muted-foreground">
                  24h Volume
                </p>
              </Card>

              <Card className="p-4 flex flex-col gap-2 items-center justify-center shadow-none py">
                <p className="text-2xl font-bold  ">
                  {formattedNumber(globalData.activeCryptos)}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Cryptocurrencies
                </p>
              </Card>

              <Card className="p-4 flex flex-col gap-2 items-center justify-center shadow-none">
                <p className="text-2xl font-bold">
                  {globalData.bitCoinDominance}%
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  Bitcoin Dominance
                </p>
              </Card>
            </>
          ) : (
            <div className="col-span-2 text-center">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-36 " />
                <Skeleton className="h-36 " />
                <Skeleton className="h-24 " />
                <Skeleton className="h-24 " />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
