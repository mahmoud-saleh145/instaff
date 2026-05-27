"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, description, children, size="md", footer }: {
  open: boolean; onClose: () => void; title?: string; description?: string;
  children: React.ReactNode; size?: "sm"|"md"|"lg"|"xl"; footer?: React.ReactNode;
}) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!open) return null;
  const w = { sm:"max-w-sm", md:"max-w-md", lg:"max-w-lg", xl:"max-w-2xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}/>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${w} animate-slide-up`}>
        {(title||description) && (
          <div className="flex items-start justify-between p-6 pb-0">
            <div>{title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}</div>
            <button onClick={onClose} className="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X size={18}/></button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 pb-6 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel="Confirm", cancelLabel="Cancel", variant="danger", loading=false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string;
  confirmLabel?: string; cancelLabel?: string; variant?: "danger"|"primary"; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${variant==="danger"?"bg-red-100":"bg-purple-100"}`}>
          <span className="text-2xl">{variant==="danger"?"🗑️":"✓"}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="btn btn-secondary flex-1">{cancelLabel}</button>
          <button onClick={onConfirm} disabled={loading} className={`btn flex-1 text-white ${variant==="danger"?"bg-red-500 hover:bg-red-600":"btn-primary"}`}>
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
