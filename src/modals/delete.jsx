import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#777777CC] bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-xl w-[90%] sm:w-[660px] max-w-[660px] h-auto sm:h-[146px] p-6">
        <h2 className="text-[22px] font-bold mb-[40px] sm:text-left">
          Are you sure you want to delete this item?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            className="border border-[#999999] h-[32px] rounded-lg px-6 sm:px-8 text-base font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="border border-[#FF5151] h-[32px] bg-[#FF5151] rounded-lg text-white px-6 sm:px-8 text-base font-bold"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
