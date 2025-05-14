import {
  createUser,
  fetchUsers,
  removeUser,
  updateUser,
} from "@/lib/api/users";
import { PaginationType } from "@/lib/types/pagination";
import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateUserPayload, UpdateUserPayload } from "@/lib/types/user";

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    removeUser(id)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete user");
      });
  };

  const handleEdit = (id: number, payload: UpdateUserPayload) => {
    updateUser(payload, id)
      .then(() => {
        fetchUsers({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setUsers(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("User updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update user");
        setOpen(false);
      });
  };

  const handleAdd = (payload: CreateUserPayload) => {
    createUser(payload)
      .then(() => {
        fetchUsers({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setUsers(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("User created successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Failed to create user");
        setOpen(false);
      });
  };

  useEffect(() => {
    fetchUsers({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setUsers(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    users,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  };
};
