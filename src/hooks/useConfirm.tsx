"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  title: string;
  positiveText?: string;
  negativeText?: string;
  positiveAction?: () => void;
  negativeAction?: () => void;
}

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [props, setProps] = useState<ConfirmModalProps | null>(null);
  const t = useTranslations("dialog")

  const showConfirm = useCallback((options: ConfirmModalProps) => {
    setProps(options);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    props?.negativeAction?.();
  };

  const handleConfirm = () => {
    setIsOpen(false);
    props?.positiveAction?.();
  };

  const ConfirmModal = props ? (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        {props.title}
      </h4>
      <div className="flex items-center justify-end w-full gap-3 mt-8">
        <Button size="sm" variant="outline" onClick={handleClose}>
          {props.negativeText || t("cancel")}
        </Button>
        <Button size="sm" onClick={handleConfirm}>
          {props.positiveText || t("confirm")}
        </Button>
      </div>
    </Modal>
  ) : null;

  return {
    showConfirm,
    ConfirmModal,
  };
};
