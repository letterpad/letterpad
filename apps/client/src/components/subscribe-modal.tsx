'use client';

import { FC, useState } from 'react';
import { LuMailPlus } from 'react-icons/lu';
import { Modal } from 'ui/dist/index.mjs';

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
        className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm p-2 text-center"
        onClick={() => setShowModal(true)}
      >
        <LuMailPlus />
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
