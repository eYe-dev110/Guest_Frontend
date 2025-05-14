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
import { useConfirm } from "@/hooks/useConfirm";
import { useCamera } from "@/hooks/useCamera";

const headers = ["No", "Title", "SubTitle", "FloorNum", "FloorSubNum", ""];

export default function CameraManagement() {
  const [currentCameraId, setCurrentCameraId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [floorNum, setFloorNum] = useState<number>(0);
  const [floorSubNum, setFloorSubNum] = useState<number>(0);

  const { showConfirm, ConfirmModal } = useConfirm();

  const {
    open,
    cameras,
    pagination,
    searchText,
    setOpen,
    setSearchText,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  } = useCamera();

  const reset = () => {
    setTitle("");
    setSubTitle("");
    setFloorNum(0);
    setFloorSubNum(0);
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentCameraId(id);
    const camera = cameras.find((camera) => camera.id === id);
    if (camera) {
      setTitle(camera.title);
      setSubTitle(camera.sub_title);
      setFloorNum(camera.floor_num);
      setFloorSubNum(camera.floor_sub_num);
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
      if (!currentCameraId) return;
      handleEdit(currentCameraId, {
        title,
        sub_title: subTitle,
        floor_num: floorNum,
        floor_sub_num: floorSubNum,
      });
    } else {
      handleAdd({
        title,
        sub_title: subTitle,
        floor_num: floorNum,
        floor_sub_num: floorSubNum,
      });
    }
  };

  return (
    <ComponentCard title="Camera Management">
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
                {cameras.map((camera) => (
                  <TableRow key={camera.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {camera.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {camera.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {camera.sub_title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {camera.floor_num}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {camera.floor_sub_num}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(camera.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => {
                            showConfirm({
                              title:
                                "Are you sure you want to delete this camera?",
                              positiveText: "Delete",
                              positiveAction: () => handleRemove(camera.id),
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
          {editMode ? "Edit Camera" : "Add Camera"}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>SubTitle</Label>
            <Input
              type="text"
              placeholder="Enter your sub_title"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>FloorNum</Label>
            <Input
              type="number"
              placeholder="Enter your floor_num"
              value={floorNum ?? undefined}
              onChange={(e) => setFloorNum(Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <Label>FloorSubNum</Label>
            <Input
              type="number"
              placeholder="Enter your floor_sub_num"
              value={floorSubNum ?? undefined}
              onChange={(e) => setFloorSubNum(Number(e.target.value))}
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
