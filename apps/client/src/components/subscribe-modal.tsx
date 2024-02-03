'use client';

import { FC, useState } from 'react';
import { Modal } from 'ui';
import { Subscribe } from './subscribe';

interface Props {
  settings?: any;
}

export const SubscribeModal: FC<Props> = ({ settings }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        type="button"
        className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
        onClick={() => setShowModal(true)}
      >
        Subscribe
      </button>

      <Modal
        toggle={() => setShowModal(false)}
        show={showModal}
        header={`Subscribe to ${settings?.site_title}`}
        className="bg-white dark:bg-gray-700"
        footer={[]}
      >
        <Subscribe />
      </Modal>
    </>
  );
};
