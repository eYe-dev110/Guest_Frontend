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
import { useTranslations } from "next-intl";

export default function CameraManagement() {
  const t = useTranslations("CameraManagement");

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
    const payload = {
      title,
      sub_title: subTitle,
      floor_num: floorNum,
      floor_sub_num: floorSubNum,
    };
    if (editMode) {
      if (!currentCameraId) return;
      handleEdit(currentCameraId, payload);
    } else {
      handleAdd(payload);
    }
  };

  const headers = [
    t("table.no"),
    t("table.title"),
    t("table.subTitle"),
    t("table.floorNum"),
    t("table.floorSubNum"),
    ""
  ];

  return (
    <ComponentCard title={t("title")}>
      <div className="w-full grid grid-cols-2">
        <div className="col-span-1 flex flex-row gap-8 items-center">
          <Input
            placeholder={t("searchPlaceholder")}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button variant="primary" size="sm" onClick={handleAddOpen}>
            {t("create")}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
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

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {cameras.map((camera) => (
                  <TableRow key={camera.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {camera.id}
                    </TableCell>
                    <TableCell className="px-4 py-3">{camera.title}</TableCell>
                    <TableCell className="px-4 py-3">{camera.sub_title}</TableCell>
                    <TableCell className="px-4 py-3">{camera.floor_num}</TableCell>
                    <TableCell className="px-4 py-3">{camera.floor_sub_num}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(camera.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() =>
                            showConfirm({
                              title: t("deleteConfirm"),
                              positiveText: t("delete"),
                              positiveAction: () => handleRemove(camera.id),
                            })
                          }
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
          onPageChange={(page) =>
            setPagination({ ...pagination, current_page: page })
          }
        />
      </div>

      {ConfirmModal}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          {editMode ? t("edit") : t("add")}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>{t("titleLabel")}</Label>
            <Input
              type="text"
              placeholder={t("titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>{t("subTitleLabel")}</Label>
            <Input
              type="text"
              placeholder={t("subTitlePlaceholder")}
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>{t("floorNumLabel")}</Label>
            <Input
              type="number"
              placeholder={t("floorNumPlaceholder")}
              value={floorNum ?? undefined}
              onChange={(e) => setFloorNum(Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <Label>{t("floorSubNumLabel")}</Label>
            <Input
              type="number"
              placeholder={t("floorSubNumPlaceholder")}
              value={floorSubNum ?? undefined}
              onChange={(e) => setFloorSubNum(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            {t("close")}
          </Button>
          <Button size="sm" onClick={handleClick}>
            {t("saveChanges")}
          </Button>
        </div>
      </Modal>
    </ComponentCard>
  );
}