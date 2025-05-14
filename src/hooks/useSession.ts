import {
  fetchSessions,
  removeMultiSessions,
  removeSession,
} from "@/lib/api/session";
import { PaginationType } from "@/lib/types/pagination";
import { Session } from "@/lib/types/session";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
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
    removeSession(id)
      .then(() => {
        setSessions((prev) => prev.filter((session) => session.id !== id));
        toast.success("Session deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete session");
      });
  };

  const handleMultiRemove = (ids: number[]) => {
    removeMultiSessions(ids)
      .then(() => {
        setSessions((prevSessions) =>
          prevSessions.filter((session) => !ids.includes(session.id)),
        );
        toast.success("Sessions deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete sessions");
      });
  };

  useEffect(() => {
    fetchSessions({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      const { data, meta } = res.data;
      setSessions(data);
      setPagination(meta);
    });
  }, [
    pagination.current_page,
    pagination.page_size,
    searchText,
    startDate,
    endDate,
  ]);

  return {
    open,
    searchText,
    sessions,
    pagination,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleMultiRemove,
  };
};
