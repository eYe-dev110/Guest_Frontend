"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination from "@/components/tables/Pagination";
import ComponentCard from "@/components/common/ComponentCard";
import { TrashBinIcon } from "@/icons";
import dayjs from "dayjs";
import { useHistory } from "@/hooks/useHistory";
import { useConfirm } from "@/hooks/useConfirm";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { useTranslations } from "next-intl";

export default function HistoryManagement() {
  const t = useTranslations("HistoryManagement");

  const { showConfirm, ConfirmModal } = useConfirm();
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selecetedIds, setSelectedIds] = useState<number[]>([]);

  const {
    histories,
    pagination,
    searchText,
    setStartDate,
    setEndDate,
    setSearchText,
    setPagination,
    handleRemove,
    handleMuitiRemove,
  } = useHistory();

  useEffect(() => setSelectedIds([]), [multiSelect]);

  const headers = [
    t("table.selected"),
    t("table.no"),
    t("table.customerId"),
    t("table.cameraId"),
    t("table.seenAt"),
    "", // For actions (trash icon)
  ];

  return (
    <ComponentCard title={t("title")}>
      <div className="w-full grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Input
            placeholder={t("searchPlaceholder")}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <DatePicker
            id="start_date"
            placeholder={t("startDate")}
            mode="single"
            onChange={(_, currentDateString) => {
              setStartDate(currentDateString);
            }}
          />
        </div>
        <div className="col-span-1">
          <DatePicker
            id="end_date"
            placeholder={t("endDate")}
            mode="single"
            onChange={(_, currentDateString) => {
              setEndDate(currentDateString);
            }}
          />
        </div>
        <div className="col-span-1 flex flex-row gap-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMultiSelect((prevState) => !prevState)}
          >
            {multiSelect ? t("deselect") : t("select")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleMuitiRemove(selecetedIds)}
            disabled={selecetedIds.length === 0}
          >
            {t("delete")}
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {headers.map((header, index) => {
                    if (!multiSelect && index === 0) return null;
                    return (
                      <TableCell
                        key={index}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {header}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {histories.map((history) => (
                  <TableRow key={history.id}>
                    {multiSelect && (
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Checkbox
                          checked={selecetedIds.includes(history.id)}
                          onChange={() => {
                            if (selecetedIds.includes(history.id))
                              setSelectedIds([
                                ...selecetedIds.filter((id) => id !== history.id),
                              ]);
                            else setSelectedIds([...selecetedIds, history.id]);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {history.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {history.customer.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {history.camera.title + " " + history.camera.sub_title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {dayjs(history.seen_at).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div
                        className="w-fit h-fit cursor-pointer"
                        onClick={() => {
                          showConfirm({
                            title: t("deleteConfirm"),
                            positiveText: t("delete"),
                            positiveAction: () => handleRemove(history.id),
                          });
                        }}
                      >
                        <TrashBinIcon />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse">
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={(page) => {
            setPagination({ ...pagination, current_page: page });
          }}
        />
      </div>
      {ConfirmModal}
    </ComponentCard>
  );
}