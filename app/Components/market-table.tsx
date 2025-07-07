import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAllCryptos } from "../hooks/useAllCryptos";

import { allCryptosSchema, allCryptosType } from "../data/allCryptos";

import Image from "next/image";
import CryptoTableDialog from "./crypto-dialog/crypto-dialog";

interface TopCurrencies {
  name: string;
  price: string;
  change: string;
  volume: string;
  marketRank: number;
  isPositive: boolean;
  icon: string;
}

export function MarketTable() {
  const { data: allCoinsData, isLoading, isError } = useAllCryptos();

  const [topFiveCurrencies, setTopFiveCurrencies] = useState<TopCurrencies[]>(
    []
  );

  const [allCoins, setAllCoins] = useState<allCryptosType>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        if (allCoinsData) {
          const validateSchema = allCryptosSchema.parse(allCoinsData);

          const mappedData: TopCurrencies[] = validateSchema
            .slice(0, 5)
            .map((coin) => ({
              name: coin.name,
              price: `$${coin.current_price.toLocaleString()}`,
              change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
              volume: `$${coin.total_volume.toLocaleString()}`,
              marketRank: coin.market_cap_rank,
              isPositive: coin.price_change_percentage_24h >= 0,
              icon: coin.image,
            }));
          // Update state with the parsed data
          setAllCoins(validateSchema); // Matches `allCryptosType` directly
          setTopFiveCurrencies(mappedData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    fetchMarketData();
  }, [allCoinsData]);

  return (
    <Card className="space-y-4 p-6 mx-5 shadow-none border-none">
      <div className="flex items-center justify-between mb-9">
        <div>
          <h2 className="text-xl font-medium">Market Value</h2>
          <p className="text-xs text-slate-600">5 Top Cryptocurrencies</p>
        </div>
        {/* crypto dialog */}
        <CryptoTableDialog allCoins={allCoins} />
      </div>
      <Table>
        <TableHeader className=" border-none">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Assets Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Rank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && <div className="text-red-500">Failed to fetch data</div>}
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-9 w-full mb-2" />
                ))}
              </TableCell>
            </TableRow>
          ) : (
            topFiveCurrencies.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="flex items-center gap-2">
                  <div className="  size-7 rounded-md flex items-center justify-center text-primary font-bold">
                    {item && (
                      <Image
                        src={item.icon}
                        alt={`${item.icon}`}
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell
                  className={
                    item.isPositive
                      ? "text-green-500 font-medium"
                      : "text-red-500"
                  }
                >
                  {item.change}
                </TableCell>
                <TableCell className="text-slate-500 font-mono">
                  {item.volume}
                </TableCell>
                <TableCell className="text-center">{item.marketRank}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
