import { createRole, fetchRoles, removeRole, updateRole } from "@/lib/api/role";
import { PaginationType } from "@/lib/types/pagination";
import { Role } from "@/lib/types/role";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreateRolePayload, UpdateRolePayload } from "@/lib/types/role";

export const useRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    removeRole(id)
      .then(() => {
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
        toast.success("Role deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete role");
      });
  };

  const handleEdit = (id: number, payload: UpdateRolePayload) => {
    updateRole(id, payload)
      .then(() => {
        fetchRoles({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setRoles(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Role updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update role");
        setOpen(false);
      });
  };

  const handleAdd = (payload: CreateRolePayload) => {
    createRole(payload)
      .then(() => {
        fetchRoles({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setRoles(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Role created successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Failed to create role");
        setOpen(false);
      });
  };

  useEffect(() => {
    fetchRoles({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setRoles(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    roles,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  };
};
