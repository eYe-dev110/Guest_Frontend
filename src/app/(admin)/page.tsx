"use client";

import { CustomerMetrics } from "@/components/dashboard/CustomerMetrics";
import React, { useEffect, useState } from "react";
import CustomerMetricChart from "@/components/dashboard/CustomerMetricChart";
import { CustomerStatistic } from "@/lib/types/customerStatistic";
import {
  fetchCustomerCountOfMonthByRole,
  fetchCustomerCountOfTodayByRole,
  fetchCustomerDailyCountByRole,
} from "@/lib/api/customer";
import { RoleName } from "@/lib/types/role";
import DatePicker from "@/components/form/date-picker";
import ComponentCard from "@/components/common/ComponentCard";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const roles: RoleName[] = ["client", "user", "employeer"];

export default function Dashboard() {
  const [statsByToday, setStatsByToday] = useState<CustomerStatistic[]>([]);
  const [statsByMonth, setStatsByMonth] = useState<CustomerStatistic[]>([]);
  const [statsByDaily, setStatsByDaily] = useState<
    {
      date: string;
      counts: CustomerStatistic[];
    }[]
  >([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const t = useTranslations("dashboard")

  useEffect(() => {
    fetchCustomerCountOfTodayByRole().then((res) => {
      setStatsByToday(res.data);
    });
    fetchCustomerCountOfMonthByRole().then((res) => {
      setStatsByMonth(res.data);
    });
    fetchCustomerDailyCountByRole().then((res) => {
      setStatsByDaily(res.data);
    });
  }, []);

  useEffect(() => {
    fetchCustomerDailyCountByRole({
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      setStatsByDaily(res.data);
    });
  }, [startDate, endDate]);

  useEffect(() => {
    const firstDay = dayjs().startOf("month").format("YYYY-MM-DD");
    const lastDay = dayjs().endOf("month").format("YYYY-MM-DD");
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-6">
        <CustomerMetrics
          title={t("today_analysis")}
          key={"today"}
          metrics={statsByToday}
          className="col-span-4"
        />
      </div>
      <div className="col-span-6">
        <CustomerMetrics
          title={t("month_analysis")}
          key={"Month"}
          metrics={statsByMonth}
          className="col-span-4"
        />
      </div>
      <div className="col-span-12 flex flex-col">
        <ComponentCard title={t("customer_metrics")}>
          <div className="flex gap-4 flex-row">
            <DatePicker
              id="start_date"
              mode="single"
              defaultDate={startDate}
              onChange={(_, currentDateString) => {
                setStartDate(currentDateString);
              }}
              placeholder="Start Date"
            />
            <DatePicker
              id="end_date"
              mode="single"
              defaultDate={endDate}
              onChange={(_, currentDateString) => {
                setEndDate(currentDateString);
              }}
              placeholder="End Date"
            />
          </div>

          <CustomerMetricChart
            categories={statsByDaily.map((item) =>
              dayjs(item.date).format("DD"),
            )}
            data={roles.map((role) => ({
              name: t(`${role}`) as RoleName,
              data: statsByDaily.map(
                (dailyItem) =>
                  dailyItem.counts.find((countItem) => countItem.role === role)
                    ?.count || 0,
              ),
            }))}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
