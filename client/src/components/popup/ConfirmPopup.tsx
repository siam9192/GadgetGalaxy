import React, { ReactNode, useEffect, useState } from "react";

interface IProps {
  children: ReactNode;
  onConfirm: () => void | any;
  onCancel?: () => void | any;
  heading?: string;
  description?: string;
}
const ConfirmPopup = ({ children, onConfirm, onCancel, heading, description }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handelCancel = async () => {
    setIsOpen(false);
    onCancel && (await onCancel());
  };
  const handelConfirm = async () => {
    setIsOpen(false);
    onConfirm && (await onConfirm());
  };
  return (
    <>
      <div onClick={() => setIsOpen(true)} className="size-fit">
        {children}
      </div>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className=" bg-gray-900/50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:w-1/3 w-10/12 bg-white min-h-60 p-5 overflow-y-auto no-scrollbar rounded-xl"
          >
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/businessman-making-warning-announcement-illustration-download-in-svg-png-gif-file-formats--word-logo-work-megaphone-media-advertisement-business-pack-illustrations-7207837.png?f=webp"
              alt=""
              className="w-1/2 mx-auto"
            />
            <h1 className="text-xl text-black font-medium text-center">
              {heading || "Are you sure?"}
            </h1>
            <p className="mt-2 text-center text-sm text-gray-700">
              {description ||
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam aspernatur consectetur labore molestias"}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handelCancel} className="px-6 py-3 bg-info text-white">
                Cancel
              </button>
              <button onClick={handelConfirm} className="px-6 py-3 bg-green-600 text-white">
                Yes Iam!
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ConfirmPopup;
