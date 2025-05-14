import {
  createImage,
  fetchImages,
  removeImage,
  removeMultiImages,
  updateImage,
} from "@/lib/api/image";
import { PaginationType } from "@/lib/types/pagination";
import { ImageType } from "@/lib/types/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateImagePayload, UpdateImagePayload } from "@/lib/types/image";

export const useImage = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    removeImage(id)
      .then(() => {
        setImages((prevImages) =>
          prevImages.filter((image) => image.id !== id),
        );
        toast.success("Image deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete image");
      });
  };

  const handleMultiRemove = (ids: number[]) => {
    removeMultiImages(ids)
      .then(() => {
        setImages((prevImages) =>
          prevImages.filter((image) => !ids.includes(image.id)),
        );
        toast.success("Images deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete images");
      });
  };

  const handleEdit = (id: number, payload: UpdateImagePayload) => {
    updateImage(id, payload)
      .then(() => {
        fetchImages({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setImages(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Image updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update image");
        setOpen(false);
      });
  };

  const handleAdd = (payload: CreateImagePayload) => {
    createImage(payload)
      .then(() => {
        fetchImages({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setImages(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Image created successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to create image");
        setOpen(false);
      });
  };

  useEffect(() => {
    fetchImages({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setImages(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    images,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
    handleMultiRemove,
  };
};
