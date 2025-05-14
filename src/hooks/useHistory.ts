import {
  fetchHistories,
  removeHistory,
  removeMultiHistories,
} from "@/lib/api/history";
import { PaginationType } from "@/lib/types/pagination";
import { History } from "@/lib/types/history";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useHistory = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    removeHistory(id)
      .then(() => {
        setHistories((prevHistories) =>
          prevHistories.filter((history) => history.id !== id),
        );
        toast.success("History deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete history");
      });
  };

  const handleMuitiRemove = (ids: number[]) => {
    removeMultiHistories(ids)
      .then(() => {
        setHistories((prevHistories) =>
          prevHistories.filter((history) => !ids.includes(history.id)),
        );
        toast.success("Histories deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete histories");
      });
  };

  useEffect(() => {
    fetchHistories({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      const { data, meta } = res.data;
      setHistories(data);
      setPagination(meta);
    });
  }, [
    endDate,
    pagination.current_page,
    pagination.page_size,
    searchText,
    startDate,
  ]);

  return {
    open,
    searchText,
    histories,
    pagination,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleMuitiRemove,
  };
};
