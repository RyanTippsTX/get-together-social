import { updateHostAvatar } from '../lib/storage';
import { Modal } from './Modal';
import { useProfile } from '../lib/profile';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useAppLoading } from '../lib/appLoading';
import Image from 'next/image';

const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];

export function ModalAvatarForm({ isOpen, closeModal }: { isOpen: boolean; closeModal: Function }) {
  const { profile, setProfileStale } = useProfile();
  const { appLoading, setAppLoading } = useAppLoading();
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // clear previous avatarFile anytime the modal is opened
  useEffect(() => {
    if (isOpen) {
      setAvatarFile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // wipe current state on any avatarFile change (initial, change, deletion)
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
    // then, if there's a avatarFile, generate the previewURL state
    if (avatarFile) {
      // create the previewURL
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewURL(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarFile]);

  const handleChange = (avatarFile: any) => {
    setAvatarFile(avatarFile);
  };

  // if (avatarFile) console.log(avatarFile);

  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      <div className="card-body ">
        <h2 className="card-title">Upload a New Image</h2>
        <p></p>

        {previewURL && (
          <div className="avatar placeholder flex place-content-center pb-2">
            <div className="w-40 rounded-full">
              <figure className="relative h-full w-full">
                <Image
                  src={previewURL}
                  // force new line
                  alt="avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </figure>
            </div>
          </div>
        )}

        <FileUploader
          // Docs: https://www.npmjs.com/package/react-drag-drop-files
          handleChange={handleChange}
          name="avatarFile"
          multiple={false}
          types={fileTypes}
        >
          <div className="col-span-full">
            {/* <label className="block text-sm font-medium text-gray-700">Cover Photo</label> */}
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </FileUploader>

        {/* <p className="mt-2 text-sm text-gray-500">
          We reccommend using your full name, or whatever nickname you go by. 🥸
        </p> */}

        {/* action buttons */}
        <div className="modal-action">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // console.log('clicked button');
              closeModal();
            }}
            className="btn btn-ghost"
          >
            Cancel
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // console.log('clicked button');
              // console.log('file is:', avatarFile);
              closeModal();
              setAppLoading(true);
              (async () => {
                await updateHostAvatar({ host_id: profile?.host_id, avatarFile });
                setAppLoading(false);
                setProfileStale(true);
              })();
            }}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
