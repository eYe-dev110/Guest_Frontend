"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination from "@/components/tables/Pagination";
import ComponentCard from "@/components/common/ComponentCard";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useCustomer } from "@/hooks/useCustomer";
import { useConfirm } from "@/hooks/useConfirm";
import Select from "@/components/form/Select";

const headers = ["No", "Role", "Name", "Detail", "LastVisitAt", ""];

const roleOptions = [
  { value: "user", label: "user" },
  { value: "client", label: "client" },
  { value: "employeer", label: "employeer" },
];

export default function CustomerManagement() {
  const [currentCustomerId, setCurrentCustomerId] = useState<number | null>(
    null,
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  const [role, setRole] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [detailInfo, setDetailInfo] = useState<string>("");

  const { showConfirm, ConfirmModal } = useConfirm();

  const {
    open,
    customers,
    pagination,
    searchText,
    setOpen,
    setSearchText,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  } = useCustomer();

  const reset = () => {
    setRole("");
    setName("");
    setDetailInfo("");
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentCustomerId(id);
    const customer = customers.find((customer) => customer.id === id);
    if (customer) {
      setRole(customer.role);
      setName(customer.name);
      setDetailInfo(customer.detail_info);
    }
    setOpen(true);
  };

  const handleAddOpen = () => {
    reset();
    setEditMode(false);
    setOpen(true);
  };

  const handleClick = () => {
    if (editMode) {
      if (!currentCustomerId) return;
      handleEdit(currentCustomerId, {
        role: role,
        name,
        detail_info: detailInfo,
      });
    } else {
      handleAdd({
        role: role,
        name,
        detail_info: detailInfo,
      });
    }
  };

  return (
    <ComponentCard title="Customer Management">
      <div className="w-full grid grid-cols-2">
        <div className="col-span-1 flex flex-row gap-8 items-center">
          <Input
            placeholder="search..."
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button variant="primary" size="sm" onClick={handleAddOpen}>
            Create
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
                  {headers.map((header, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {customer.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {customer.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {customer.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {customer.detail_info}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {customer.last_seen_at}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(customer.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => {
                            showConfirm({
                              title:
                                "Are you sure you want to delete this user?",
                              positiveText: "Delete",
                              positiveAction: () => handleRemove(customer.id),
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
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Edit Customer
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>Role</Label>
            <Select
              options={roleOptions}
              defaultValue={role}
              onChange={(role) => setRole(role)}
            />
          </div>
          <div className="col-span-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>Detail</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={detailInfo}
              onChange={(e) => setDetailInfo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button size="sm" onClick={handleClick}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </ComponentCard>
  );
}
