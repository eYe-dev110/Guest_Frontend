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
import Input from "@/components/form/input/InputField";
import dayjs from "dayjs";
import { useConfirm } from "@/hooks/useConfirm";
import { useSession } from "@/hooks/useSession";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";

const headers = ["No", "CustomerName", "Name", "UpdatedAt", ""];

export default function SessionManagement() {
  const { showConfirm, ConfirmModal } = useConfirm();
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selecetedIds, setSelectedIds] = useState<number[]>([]);

  const {
    sessions,
    setStartDate,
    setEndDate,
    pagination,
    searchText,
    setSearchText,
    setPagination,
    handleRemove,
    handleMultiRemove,
  } = useSession();

  useEffect(() => setSelectedIds([]), [multiSelect]);

  return (
    <ComponentCard title="Session Management">
      <div className="w-full grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Input
            placeholder="search..."
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <DatePicker
            id="start_date"
            mode="single"
            onChange={(_, currentDateString) => {
              setStartDate(currentDateString);
            }}
          />
        </div>
        <div className="col-span-1">
          <DatePicker
            id="end_date"
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
            {multiSelect ? "Deselect" : "Select"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleMultiRemove(selecetedIds)}
            disabled={selecetedIds.length === 0}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {headers.map((header, index) => {
                    if (!multiSelect && header == "Selected") return;
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

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {sessions.map((session, index) => (
                  <TableRow key={session.id}>
                    {multiSelect && (
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Checkbox
                          checked={selecetedIds.includes(session.id)}
                          onChange={() => {
                            if (selecetedIds.includes(session.id))
                              setSelectedIds([
                                ...selecetedIds.filter(
                                  (id) => id != session.id,
                                ),
                              ]);
                            else setSelectedIds([...selecetedIds, session.id]);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {session.customer.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {session.day_session}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {dayjs(session.session_date).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => {
                            showConfirm({
                              title:
                                "Are you sure you want to delete this user?",
                              positiveText: "Delete",
                              positiveAction: () => handleRemove(session.id),
                            });
                          }}
                        >
                          <TrashBinIcon />
                        </div>
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
