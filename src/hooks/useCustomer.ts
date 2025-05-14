import {
  createCustomer,
  fetchCustomers,
  removeCustomer,
  updateCustomer,
} from "@/lib/api/customer";
import { PaginationType } from "@/lib/types/pagination";
import { Customer } from "@/lib/types/customer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/lib/types/customer";

export const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    total: 1,
    current_page: 1,
    page_size: 2,
    total_pages: 1,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleRemove = (id: number) => {
    removeCustomer(id)
      .then(() => {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        toast.success("Customer deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete customer");
      });
  };

  const handleEdit = (id: number, payload: UpdateCustomerPayload) => {
    updateCustomer(id, payload)
      .then(() => {
        fetchCustomers({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setCustomers(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Customer updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update customer");
        setOpen(false);
      });
  };

  const handleAdd = (payload: CreateCustomerPayload) => {
    createCustomer(payload)
      .then(() => {
        fetchCustomers({
          current_page: pagination.current_page,
          page_size: pagination.page_size,
        }).then((res) => {
          const { data, meta } = res.data;
          setCustomers(data);
          setPagination(meta);
        });
        setOpen(false);
        toast.success("Customer created successfully");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to create customer",
        );
        setOpen(false);
      });
  };

  useEffect(() => {
    fetchCustomers({
      filter: searchText,
      current_page: pagination.current_page,
      page_size: pagination.page_size,
    }).then((res) => {
      const { data, meta } = res.data;
      setCustomers(data);
      setPagination(meta);
    });
  }, [pagination.current_page, pagination.page_size, searchText]);

  return {
    open,
    searchText,
    customers,
    pagination,
    setSearchText,
    setOpen,
    setPagination,
    handleRemove,
    handleEdit,
    handleAdd,
  };
};
