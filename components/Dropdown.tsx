import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icons';

export function Dropdown({
  label,
  trigger,
  children,
}: {
  label: string;
  trigger?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const click = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', click);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', click);
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <div
      className="relative"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className="btn btn-ghost btn-square"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {trigger || <Icon name="more" />}
      </button>
      {open && (
        <div
          id={id}
          className="menu-panel"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button, a')) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
