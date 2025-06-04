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
import { PencilIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";
import { useConfirm } from "@/hooks/useConfirm";
import { useImage } from "@/hooks/useImage";
import Select from "@/components/form/Select";
import { useCustomer } from "@/hooks/useCustomer";
import Checkbox from "@/components/form/input/Checkbox";
import { useTranslations } from "next-intl";

export default function ImageManagement() {
  const t = useTranslations("ImageManagement");

  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [customerId, setCustomerId] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const { showConfirm, ConfirmModal } = useConfirm();

  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selecetedIds, setSelectedIds] = useState<number[]>([]);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    open,
    images,
    pagination,
    searchText,
    setOpen,
    setSearchText,
    setPagination,
    handleRemove,
    handleMultiRemove,
    handleEdit,
    handleAdd,
  } = useImage();
  const { customers } = useCustomer();

  const reset = () => {
    setCustomerId("");
    setUrl("");
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentImageId(id);
    const image = images.find((image) => image.id === id);
    if (image) {
      setCustomerId(image.customer?.id?.toString() ?? "");
      setUrl(image.url);
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
      customer_id: customerId ? Number(customerId) : undefined,
      url,
    };
    if (editMode) {
      if (!currentImageId) return;
      handleEdit(currentImageId, payload);
    } else {
      handleAdd(payload);
    }
  };

  useEffect(() => setSelectedIds([]), [multiSelect]);

  const headers = [
    t("table.no"),
    t("table.image"),
    t("table.customer"),
    "",
  ];

  return (
    <ComponentCard title={t("title")}>
      <div className="w-full grid grid-cols-3">
        <div className="col-span-1 flex flex-row gap-8 items-center">
          <Input
            placeholder={t("searchPlaceholder")}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1 flex flex-row gap-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMultiSelect((prev) => !prev)}
          >
            {multiSelect ? t("deselect") : t("select")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleMultiRemove(selecetedIds)}
            disabled={selecetedIds.length === 0}
          >
            {t("delete")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddOpen} disabled>
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
                {images.map((image, index) => (
                  <TableRow key={image.id}>
                    {multiSelect && (
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Checkbox
                          checked={selecetedIds.includes(image.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(image.id)
                                ? prev.filter((id) => id !== image.id)
                                : [...prev, image.id]
                            )
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div
                        className="cursor-pointer w-fit h-fit"
                        onDoubleClick={() => {
                          setPreviewUrl(image.url);
                          setPreviewOpen(true);
                        }}
                      >
                        <Image
                          src={image.url}
                          alt="Image"
                          width={50}
                          height={50}
                          className="rounded-lg w-[50px] h-[50px]"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{image.customer?.name ?? ""}</TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-6">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleEditOpen(image.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            showConfirm({
                              title: t("deleteConfirm"),
                              positiveText: t("delete"),
                              positiveAction: () => handleRemove(image.id),
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

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h4 className="mb-6 text-lg font-medium">{editMode ? t("edit") : t("add")}</h4>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>{t("customer")}</Label>
            <Select
              placeholder={t("selectCustomer")}
              options={customers.map((c) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              defaultValue={customerId}
              onChange={setCustomerId}
            />
          </div>
          <div className="col-span-2">
            <Label>{t("imageUrl")}</Label>
            <Input
              type="text"
              placeholder={t("imageUrlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("close")}
          </Button>
          <Button onClick={handleClick}>{t("saveChanges")}</Button>
        </div>
      </Modal>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)}>
        <h4 className="mb-6 text-lg font-medium">{t("preview")}</h4>
        <Image
          alt="preview"
          src={previewUrl}
          width={400}
          height={400}
          className="w-full max-w-[504px] h-[504px]"
        />
      </Modal>
    </ComponentCard>
  );
}
