import {
  createConstant,
  fetchConstants,
  removeConstant,
  updateConstant,
} from "@/lib/api/constant";
import { PaginationType } from "@/lib/types/pagination";
import { Constant } from "@/lib/types/constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CreateConstantPayload,
  UpdateConstantPayload,
} from "@/lib/types/constant";
import { useTranslations } from "next-intl";

export const useConstant = () => {
  const [constants, setConstants] = useState<Constant[]>([]);
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
    removeConstant(id)
      .then(() => {
        setConstants((prev) => prev.filter((constant) => constant.id !== id));
        toast.success(t("success"));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || t("fail"));
      });
  };

  const handleEdit = (id: number, payload: UpdateConstantPayload) => {
    updateConstant(id, payload)
      .then(() => {
        fetchConstants({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setConstants(data);
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

  const handleAdd = (payload: CreateConstantPayload) => {
    createConstant(payload)
      .then(() => {
        fetchConstants({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setConstants(data);
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
    fetchConstants({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setConstants(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    constants,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  };
};
