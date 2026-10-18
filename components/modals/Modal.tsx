import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icons';

export function Modal({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean;
  closeModal: Function;
  children?: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const onClose = useRef(closeModal);
  onClose.current = closeModal;
  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const activeElement = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      activeElement?.focus();
    };
  }, [isOpen]);
  if (!isOpen || typeof document === 'undefined') return null;
  return createPortal(
    <dialog
      ref={dialog}
      aria-label="Event and account dialog"
      className="border-ink/15 bg-cream text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border p-0 shadow-xl"
      onCancel={(e) => {
        e.preventDefault();
        onClose.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose.current();
        }
      }}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="btn btn-ghost btn-square absolute right-2 top-2 z-10"
        onClick={() => closeModal()}
      >
        <Icon name="close" />
      </button>
      <div className="pt-6">{children}</div>
    </dialog>,
    document.body
  );
}
