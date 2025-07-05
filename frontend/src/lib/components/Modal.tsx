import React, { useEffect, useRef } from "react";

export default function Modal({
  open,
  children,
}: {
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

  return <dialog ref={ref} className="p-4 rounded-[20px] m-auto">{children}</dialog>;
}
