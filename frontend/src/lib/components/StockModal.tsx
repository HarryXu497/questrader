import React from "react";
import Modal from "./Modal";

export default function StockModal({
  open,
  onCancel,
  onAction,
  title,
  content,
}: {
  open: boolean,
  onCancel: () => void,
  onAction: () => void;
  title: () => React.ReactNode
  content: () => React.ReactNode;
}) {
  return (
    <Modal open={open}>
        <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">{title()}</h1>
            <p className="text-xl">{content()}</p>
            <div className="flex flex-row justify-between gap-2">
                <button onClick={onCancel} className="flex flex-row justify-center align-center grow rounded-[20px] border-1 border-primary-400">
                    Cancel
                </button>
                <button onClick={onAction} className="bg-primary-400 border-1 border-primary-400 flex flex-row justify-center align-center grow rounded-[20px]">
                    Place Order
                </button>
            </div>
        </div>
    </Modal>
  );
}
