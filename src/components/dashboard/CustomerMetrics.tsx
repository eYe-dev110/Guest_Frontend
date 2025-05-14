"use client";

import React from "react";
import { GroupIcon } from "@/icons";
import { CustomerStatistic } from "@/lib/types/customerStatistic";

interface CustomerMetricsProps {
  title: string;
  metrics: CustomerStatistic[];
  className?: string;
}
export const CustomerMetrics: React.FC<CustomerMetricsProps> = ({
  title,
  metrics,
  className,
}) => {
  return (
    <div className={className}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span>{title}</span>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {"user"}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.find((metric) => metric.role == "user")
                ? metrics.find((metric) => metric.role == "user")?.count
                : 0}
            </h4>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {"client"}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.find((metric) => metric.role == "client")
                ? metrics.find((metric) => metric.role == "client")?.count
                : 0}
            </h4>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {"employeer"}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.find((metric) => metric.role == "employeer")
                ? metrics.find((metric) => metric.role == "employeer")?.count
                : 0}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
