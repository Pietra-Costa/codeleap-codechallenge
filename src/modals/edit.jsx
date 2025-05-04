import React, { useState } from "react";

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    onSave(title, content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#777777CC] bg-opacity-80  flex items-center justify-center z-50">
      <div className="bg-white sm:m-4 m-2 p-4 sm:p-6 rounded-xl w-full sm:w-[660px] max-w-[660px]">
        <h2 className="text-[22px] font-bold mb-6">Edit Item</h2>
        <label className="font-normal text-base ">Title</label>
        <input
          className="w-full border border-[#777777] mt-2 mb-6 p-2 rounded-lg"
          placeholder="Hello World"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label className="font-normal text-base mb-2">Content</label>
        <textarea
          className="w-full border border-[#777777] mt-2 mb-6 p-2 rounded-lg"
          value={content}
          placeholder="Content Here"
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            className="border border-black rounded-lg font-bold text-base h-8 w-[120px] px-8"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg font-bold text-base h-8 w-[120px] px-8 ${
              !title || !content
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#47B960] text-white  "
            }`}
            disabled={!title || !content}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
