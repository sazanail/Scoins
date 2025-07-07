"use client";

import { Card } from "@/components/ui/card";
import { IoMdArrowDropdown } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllCryptos } from "../hooks/useAllCryptos";
import { useEffect, useState } from "react";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";

export type PriceCardsData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: string;
  changeDirection: string;
  icon: React.ReactNode;
  bgColor: string;
};

export function PriceCards() {
  const { data: cryptocurrencies, isLoading } = useAllCryptos();
  const [threeTopCurrencies, setThreeTopCurrencies] = useState<
    PriceCardsData[]
  >([]);

  useEffect(() => {
    if (cryptocurrencies) {
      try {
        // Validate the structure at runtime
        const formatData: PriceCardsData[] = (cryptocurrencies as unknown[])
          .slice(0, 3)
          .map((coin) => {
            if (
              typeof coin === "object" &&
              coin !== null &&
              "id" in coin &&
              "symbol" in coin &&
              "current_price" in coin &&
              "name" in coin &&
              "price_change_percentage_24h" in coin
            ) {
              return {
                id: coin.id as string,
                symbol: coin.symbol as string,
                price: coin.current_price as number,
                name: coin.name as string,
                change: `${(coin.price_change_percentage_24h as number).toFixed(
                  2
                )}%`,
                changeDirection:
                  (coin.price_change_percentage_24h as number) >= 0
                    ? "up"
                    : "down",
                icon:
                  coin.id === "bitcoin" ? (
                    <BsCurrencyBitcoin className="text-orange-600 text-xl" />
                  ) : coin.id === "ethereum" ? (
                    <FaEthereum className="text-blue-600 text-xl" />
                  ) : (
                    <SiTether className="text-gray-600 text-xl" />
                  ),
                bgColor:
                  coin.id === "bitcoin"
                    ? "bg-orange-100"
                    : coin.id === "ethereum"
                    ? "bg-blue-100"
                    : "bg-gray-100",
              };
            } else {
              throw new Error("Invalid API response structure.");
            }
          });

        setThreeTopCurrencies(formatData);
      } catch (error) {
        console.error("Error processing data:", error);
      }
    }
  }, [cryptocurrencies]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 px-5 pt-5 gap-4">
        {"123".split("").map((_, key) => (
          <Skeleton key={key} className="h-[85px]  rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3 px-5 pt-5">
      {threeTopCurrencies?.map((crypto: PriceCardsData, index: number) => (
        <Card
          key={index}
          className="shadow-none border-none flex justify-between items-end p-4"
        >
          <div className="flex gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center ${crypto.bgColor} rounded-lg`}
            >
              {crypto.icon}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {crypto.name}
              </p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(crypto.price)}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 ${
              crypto.changeDirection === "up"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {crypto.changeDirection === "down" ? (
              <IoMdArrowDropdown className="text-2xl" />
            ) : (
              <IoMdArrowDropdown className="text-2xl rotate-180" />
            )}
            <span className="text-sm text-primary">{crypto.change}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
