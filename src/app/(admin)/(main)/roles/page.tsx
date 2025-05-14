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
import dayjs from "dayjs";
import { useRole } from "@/hooks/useRole";
import { useConfirm } from "@/hooks/useConfirm";
import { RoleName } from "@/lib/types/role";

const headers = ["No", "Name", "UpdatedAt", ""];

export default function RoleManagement() {
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [name, setName] = useState<RoleName>("user");

  const { showConfirm, ConfirmModal } = useConfirm();
  const {
    open,
    roles,
    pagination,
    searchText,
    setOpen,
    setSearchText,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  } = useRole();

  const reset = () => {
    setName("user");
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentRoleId(id);
    const role = roles.find((role) => role.id === id);
    if (role) {
      setName(role.name);
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
      if (!currentRoleId) return;
      handleEdit(currentRoleId, {
        name,
      });
    } else {
      handleAdd({
        name,
      });
    }
  };

  return (
    <ComponentCard title="Role Management">
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
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {role.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {role.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {dayjs(role.updated_at).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(role.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => {
                            showConfirm({
                              title:
                                "Are you sure you want to delete this role?",
                              positiveText: "Delete",
                              positiveAction: () => handleRemove(role.id),
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
          {editMode ? "Edit Role" : "Add Role"}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value as RoleName)}
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
