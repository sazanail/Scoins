"use client";

import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

import { BiCategory } from "react-icons/bi";
import { useAllCategories } from "../hooks/useAllCategories";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useExchanges } from "../hooks/useAllExchanges";
import { Exchange } from "../data/exchanges";
import { IoStorefrontOutline } from "react-icons/io5";

type Category = { name: string }; // Define type for category

// Type guard to check if an object is a Category
function isCategory(category: unknown): category is Category {
  return (
    typeof category === "object" &&
    category !== null &&
    "name" in category &&
    typeof (category as Category).name === "string"
  );
}

export function MarketHighlights() {
  const {
    data: allCategoriesData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useAllCategories();

  const {
    data: allExchanges,
    isLoading: isExchangesLoading,
    isError: isExchangesError,
  } = useExchanges();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [totalPairs, setTotalPairs] = useState<number | null>(null);

  //This use effect fetch the all categories data
  useEffect(() => {
    if (allCategoriesData) {
      const formattedData = allCategoriesData
        .slice(0, 3)
        .map((category: unknown) => {
          if (isCategory(category)) {
            return { name: category.name };
          }

          return null;
        })
        .filter((item): item is Category => item !== null);
      setCategories(formattedData);
    }
  }, [allCategoriesData]);
  // This useEffect fetches the exchanges data
  useEffect(() => {
    if (allExchanges && Array.isArray(allExchanges)) {
      const totalPairs = (allExchanges as Exchange[]).reduce(
        (sum: number, exchange) => sum + exchange.trade_volume_24h_btc,
        0
      );

      setTotalPairs(totalPairs); // Save total pairs in state
    }
  }, [allExchanges]);

  console.log(totalPairs);

  return (
    <div>
      <Card className="p-6 py-7 space-y-6 shadow-none border-none mt-5">
        <h2 className="text-xl font-semibold">Market Highlights</h2>

        {/* Show Error if categories data Fails to Load */}
        {isCategoryError ? (
          <div className="text-center text-sm text-red-500">
            Failed to load categories. Please try again later.
          </div>
        ) : categories !== null && !isCategoryLoading ? (
          // Render Categories if Available
          <div className="space-y-3">
            <CryptoCategories categories={categories} />
          </div>
        ) : (
          // Show Skeleton while Loading
          <div className="text-center text-sm text-muted-foreground">
            <Skeleton className="w-full h-28 rounded-md" />
          </div>
        )}

        {/* Show Error if exchanges data Fails to Load */}
        {isExchangesError ? (
          <div className="text-center text-sm text-red-500">
            Failed to load exchanges data. Please try again later.
          </div>
        ) : allExchanges !== null && !isExchangesLoading ? (
          // Render Categories if Available
          <div className="space-y-3">
            <MarketPaires totalPairs={totalPairs} />
          </div>
        ) : (
          // Show Skeleton while Loading
          <div className="text-center text-sm text-muted-foreground">
            <Skeleton className="w-full h-11 rounded-md" />
          </div>
        )}
      </Card>
    </div>
  );
}

function MarketPaires({ totalPairs }: { totalPairs: number | null }) {
  const formattedNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  return (
    <Card className="p-3 flex items-center justify-between shadow-none border-none">
      <div className="flex items-center gap-2 w-[85%]">
        <div className="bg-primary/15 size-8 flex items-center justify-center text-primary rounded-md ">
          <IoStorefrontOutline />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Market Pairs
        </p>
      </div>
      <p className="text-lg font-bold text-primary">
        {formattedNumber(totalPairs || 0)}
      </p>
    </Card>
  );
}

function CryptoCategories({ categories }: { categories: Category[] }) {
  return (
    <Card className="p-3 flex items-center justify-between shadow-none border-none">
      <div className="flex items-center gap-2 w-[85%]">
        <div className="bg-primary/15 size-8 flex items-center justify-center text-primary rounded-md">
          <BiCategory />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Top Categories
        </p>
      </div>

      <div className="text-lg font-medium flex flex-wrap">
        {categories.map((category, index) => (
          <span
            key={index}
            className="text-xs bg-primary/10 p-1 m-1 text-primary rounded-md px-2"
          >
            {category.name}
          </span>
        ))}
      </div>
    </Card>
  );
}
