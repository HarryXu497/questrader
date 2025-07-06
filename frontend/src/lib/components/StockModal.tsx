import React from "react";
import Modal from "./Modal";

export default function StockModal({
  open,
  onCancel,
  onAction,
  title,
  content,
}: {
  open: boolean;
  onCancel: () => void;
  onAction: () => void;
  title: () => React.ReactNode;
  content: () => React.ReactNode;
}) {
  return (
    <Modal open={open}>
      <div className="flex flex-col gap-2 p-4">
        <h1 className="font-bold text-4xl">{title()}</h1>
        <div className="text-xl">{content()}</div>
        <div className="flex flex-row justify-between gap-2">
          <button
            onClick={onCancel}
            className="flex flex-row justify-center align-center grow rounded-[20px] px-7 py-3 border-1 border-accent "
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            className="bg-primary-400 border-primary-400 flex flex-row justify-center align-center grow rounded-[20px] border-1 bg-accent border-accent text-white px-7 py-3"
          >
            Place Order
          </button>
        </div>
      </div>
    </Modal>
  );
}
