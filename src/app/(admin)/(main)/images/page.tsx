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
import { useCamera } from "@/hooks/useCamera";
import { useImage } from "@/hooks/useImage";
import Select from "@/components/form/Select";
import { useCustomer } from "@/hooks/useCustomer";
import { useHistory } from "@/hooks/useHistory";
import Checkbox from "@/components/form/input/Checkbox";

const headers = [
  "No",
  "Customer",
  "Camera",
  "History",
  "ImageType",
  "Image",
  "",
];

export default function ImageManagement() {
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [customerId, setCustomerId] = useState<string>("");
  const [cameraId, setCameraId] = useState<string>("");
  const [historyId, setHistoryId] = useState<string>("");
  const [imageType, setImageType] = useState<"camera" | "face" | null>(null);
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
  const { cameras } = useCamera();
  const { histories } = useHistory();

  const reset = () => {
    setCustomerId("");
    setCameraId("");
    setHistoryId("");
    setImageType(null);
    setUrl("");
  };

  const handleEditOpen = (id: number) => {
    reset();
    setEditMode(true);
    setCurrentImageId(id);
    const image = images.find((image) => image.id === id);
    if (image) {
      setCustomerId(image.customer ? image.customer.id.toString() : "");
      setCameraId(image.camera ? image.camera.id.toString() : "");
      setHistoryId(image.history?.id?.toString() || "");
      setImageType(image.image_type);
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
    if (editMode) {
      if (!currentImageId) return;
      handleEdit(currentImageId, {
        customer_id: customerId ? Number(customerId) : undefined,
        camera_id: cameraId ? Number(cameraId) : undefined,
        history_id: historyId ? Number(historyId) : undefined,
        image_type: imageType,
        url: url,
      });
    } else {
      handleAdd({
        customer_id: customerId ? Number(customerId) : undefined,
        camera_id: cameraId ? Number(cameraId) : undefined,
        history_id: historyId ? Number(historyId) : undefined,
        image_type: imageType,
        url,
      });
    }
  };

  useEffect(() => setSelectedIds([]), [multiSelect]);

  return (
    <ComponentCard title="Image Management">
      <div className="w-full grid grid-cols-3">
        <div className="col-span-1 flex flex-row gap-8 items-center">
          <Input
            placeholder="search..."
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
          <Button variant="primary" size="sm" onClick={handleAddOpen} disabled>
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
                {images.map((image, index) => (
                  <TableRow key={image.id}>
                    {multiSelect && (
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Checkbox
                          checked={selecetedIds.includes(image.id)}
                          onChange={() => {
                            if (selecetedIds.includes(image.id))
                              setSelectedIds([
                                ...selecetedIds.filter((id) => id != image.id),
                              ]);
                            else setSelectedIds([...selecetedIds, image.id]);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {image.customer ? image.customer.name : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {image.camera
                        ? image.camera.title + "" + image.camera.sub_title
                        : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {image.history ? image.history.id : ""}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {image.image_type}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-row gap-6">
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => handleEditOpen(image.id)}
                        >
                          <PencilIcon />
                        </div>
                        <div
                          className="w-fit h-fit cursor-pointer"
                          onClick={() => {
                            showConfirm({
                              title:
                                "Are you sure you want to delete this image?",
                              positiveText: "Delete",
                              positiveAction: () => handleRemove(image.id),
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
          {editMode ? "Edit Image" : "Add Image"}
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-2">
            <Label>Customer</Label>
            <Select
              placeholder="Select Customer"
              options={customers.map((customer) => ({
                value: customer.id.toString(),
                label: customer.name,
              }))}
              defaultValue={customerId}
              onChange={(value) => setCustomerId(value)}
            />
          </div>
          <div className="col-span-2">
            <Label>Camera</Label>
            <Select
              placeholder="Select Camera"
              options={cameras.map((camera) => ({
                value: camera.id.toString(),
                label: camera.title + camera.sub_title,
              }))}
              defaultValue={customerId}
              onChange={(value) => setCustomerId(value)}
            />
          </div>
          <div className="col-span-2">
            <Label>History</Label>
            <Select
              placeholder="Select History"
              options={histories.map((history) => ({
                value: history.id.toString(),
                label: history.id.toString(),
              }))}
              defaultValue={customerId}
              onChange={(value) => setHistoryId(value)}
            />
          </div>
          <div className="col-span-2">
            <Label>ImageType</Label>
            <Select
              placeholder="Select Image Type"
              options={[
                { value: "camera", label: "camera" },
                { value: "face", label: "face" },
              ]}
              defaultValue={customerId}
              onChange={(value) => setCustomerId(value)}
            />
          </div>
          <div className="col-span-2">
            <Label>ImageUrl</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Preview
        </h4>
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
