import { Modal } from './Modal';
import { useState, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';

export function ModalAvatarForm({ isOpen, closeModal }: { isOpen: boolean; closeModal: Function }) {
  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      <p>edit your avatar !!</p>
      {/* <AvatarForm {...{ closeModal }} /> */}
    </Modal>
  );
}
