import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import Image from 'next/image';

export function PhotoUploadDialog({
  isOpen,
  closeModal,
  title,
  onSave,
  hasPhoto,
}: {
  isOpen: boolean;
  closeModal: Function;
  title: string;
  onSave: (file: File | null) => Promise<void>;
  hasPhoto: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setError('');
    }
  }, [isOpen]);
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const choose = (next?: File) => {
    if (!next) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(next.type)) {
      setError('Choose a JPG, PNG, GIF, or WebP image.');
      return;
    }
    if (next.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }
    setError('');
    setFile(next);
  };
  const save = async (next: File | null) => {
    setBusy(true);
    setError('');
    try {
      await onSave(next);
      closeModal();
    } catch {
      setError('The photo couldn’t be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => {
        if (!busy) closeModal();
      }}
    >
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-muted text-sm">A little glimpse of the good times ahead.</p>
        {preview && (
          <div className="overflow-hidden rounded-xl">
            <Image
              src={preview}
              alt="Selected photo preview"
              width={600}
              height={400}
              unoptimized
              className="max-h-64 w-full object-cover"
            />
          </div>
        )}
        <label
          className="border-ink/30 bg-butter/40 block rounded-xl border border-dashed p-5 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            choose(e.dataTransfer.files[0]);
          }}
        >
          <span className="mb-3 block text-sm font-semibold">Choose a photo or drop it here</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="file:bg-lemon block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2 file:font-semibold"
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <span className="text-muted mt-3 block text-xs">
            JPG, PNG, GIF, or WebP. Up to 10 MB.
          </span>
        </label>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="modal-action">
          {hasPhoto && (
            <button
              type="button"
              className="btn btn-ghost text-error mr-auto"
              disabled={busy}
              onClick={() => void save(null)}
            >
              Remove photo
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy}
            onClick={() => closeModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            disabled={!file || busy}
            onClick={() => void save(file)}
          >
            {busy ? 'Saving…' : 'Save photo'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
