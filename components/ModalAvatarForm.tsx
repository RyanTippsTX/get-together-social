import { updateHostAvatar } from '../lib/storage';
import { Modal } from './Modal';
import { useProfile } from '../lib/profile';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useAppLoading } from '../lib/appLoading';

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
          <div className="w-40">
            {/* eslint-disable @next/next/no-img-element */}
            <img src={previewURL} alt="avatar" />
          </div>
        )}
        <FileUploader
          // Docs: https://www.npmjs.com/package/react-drag-drop-files
          handleChange={handleChange}
          name="avatarFile"
          multiple={false}
          types={fileTypes}
        />

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
