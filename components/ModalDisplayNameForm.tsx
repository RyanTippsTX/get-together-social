import { Modal } from './Modal';

export function ModalDisplayNameForm({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: Function;
}) {
  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      <p>edit your display name !!</p>
    </Modal>
  );
}
