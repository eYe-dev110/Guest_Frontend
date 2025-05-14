import {
  createCamera,
  fetchCameras,
  removeCamera,
  updateCamera,
} from "@/lib/api/camera";
import { PaginationType } from "@/lib/types/pagination";
import { Camera } from "@/lib/types/camera";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateCameraPayload, UpdateCameraPayload } from "@/lib/types/camera";
import { useTranslations } from "next-intl";

export const useCamera = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations("toast")

  const handleRemove = (id: number) => {
    removeCamera(id)
      .then(() => {
        setCameras((prevCameras) =>
          prevCameras.filter((camera) => camera.id !== id),
        );
        toast.success(t("success"));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || t("fail"));
      });
  };

  const handleEdit = (id: number, payload: UpdateCameraPayload) => {
    updateCamera(id, payload)
      .then(() => {
        fetchCameras({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setCameras(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success(t("success"));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || t("fail"));
        setOpen(false);
      });
  };

  const handleAdd = (payload: CreateCameraPayload) => {
    createCamera(payload)
      .then(() => {
        fetchCameras({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setCameras(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success(t("success"));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || t("fail"));
        setOpen(false);
      });
  };

  useEffect(() => {
    fetchCameras({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setCameras(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    cameras,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  };
};
