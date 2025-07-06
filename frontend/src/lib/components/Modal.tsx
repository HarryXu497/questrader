import React, { useEffect, useRef } from "react";

export default function Modal({
  open,
  children,
  ...otherProps
}: React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
> & {
  open: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (open) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [ref, open]);

  return (
    <dialog ref={ref} className="p-4 rounded-[20px] m-auto border-1 border-accent backdrop:bg-black/30">
      {children}
    </dialog>
  );
}
