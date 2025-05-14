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
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import dayjs from "dayjs";
import { useConfirm } from "@/hooks/useConfirm";
import { useUser } from "@/hooks/useUser";

const headers = ["No", "Name", "Role", "LastVisitAt", ""];

export default function UserManagement() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [roleId, setRoleId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConf, setPasswordConf] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const { showConfirm, ConfirmModal } = useConfirm();

  const {
    open,
    users,
    pagination,
    searchText,
    setOpen,
    setSearchText,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  } = useUser();

  const reset = () => {
    setRoleId("");
    setUserName("");
    setPassword("");
    setPasswordConf("");
    setIsActive(true);
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentUserId(id);
    const user = users.find((user) => user.id === id);
    if (user) {
      setRoleId(user.role.id);
      setUserName(user.user_name);
      setRoleId(user.role.id);
      setIsActive(user.is_active);
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
      if (!currentUserId) return;
      handleEdit(currentUserId, {
        role_id: Number(roleId),
        user_name: userName,
        password,
        passwordconf: passwordConf,
        is_active: isActive,
      });
    } else {
      handleAdd({
        role_id: Number(roleId),
        user_name: userName,
        password,
        passwordconf: passwordConf,
        is_active: isActive,
      });
    }
  };

  return (
    <ComponentCard title="User Management">
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
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.user_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.role.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {dayjs(user.updated_at).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(user.id)}
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
                              positiveAction: () => handleRemove(user.id),
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
          {editMode ? "Edit User" : "Create User"}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Role</Label>
            <Select
              defaultValue={roleId ?? ""}
              onChange={(value) => setRoleId(value)}
              options={[
                { value: "1", label: "Admin" },
                { value: "2", label: "User" },
              ]}
              placeholder="Select Role"
            />
          </div>
          <div className="col-span-1">
            <Label>Active</Label>
            <div className="flex items-center w-full flex-1">
              <Switch
                label=""
                checked={isActive}
                onChange={(checked) => setIsActive(checked)}
              />
            </div>
          </div>

          <div className="col-span-2">
            <Label>Username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
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
