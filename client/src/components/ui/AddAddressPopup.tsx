"use client";
import React, { ReactNode, useEffect, useState } from "react";

interface IProps {
  onAdd: (values: any) => void;
  children: ReactNode;
}

const AddAddressPopup = ({ onAdd, children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const [district, setDistrict] = useState("");
  const [zone, setZone] = useState("");
  const [line, setLine] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handelSubmit = () => {
    const newErrors: Record<string, string> = {};
    setErrors({});
    if (!district.trim()) {
      newErrors.district = "District is required";
    }

    if (!zone.trim()) {
      newErrors.zone = "Zone is required";
    }

    if (!line.trim()) {
      newErrors.line = "Line is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return;
    }
    const values = {
      district,
      zone,
      line,
    };
    onAdd(values);
    setDistrict("");
    setZone("");
    setLine("");
    setIsOpen(false);
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
            className="lg:w-1/3 w-10/12 bg-white min-h-60 p-5 overflow-y-auto no-scrollbar"
          >
            <h1 className="text-xl font-medium">Add New Address</h1>
            <div className="mt-2 space-y-2">
              <div>
                <div>
                  <label
                    className="  block text-start 0font-medium text-[1rem]"
                    htmlFor="phoneNumber"
                  >
                    District*
                  </label>

                  <input
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                    }
                    onChange={(e) => setDistrict(e.target.value)}
                    type="text"
                  />
                </div>
                {errors.district && <p className="text-info font-medium mt-1">{errors.district}</p>}
              </div>
              <div>
                <div>
                  <label
                    className="  block text-start 0font-medium text-[1rem]"
                    htmlFor="phoneNumber"
                  >
                    Zone*
                  </label>

                  <input
                    onChange={(e) => setZone(e.target.value)}
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                    }
                    type="text"
                    name="phoneNumber"
                  />
                </div>
                {errors.line && <p className="text-info font-medium mt-1">{errors.line}</p>}
              </div>
              <div>
                <div>
                  <label
                    className="  block text-start 0font-medium text-[1rem]"
                    htmlFor="phoneNumber"
                  >
                    Line*
                  </label>

                  <input
                    onChange={(e) => setLine(e.target.value)}
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                    }
                    type="text"
                    name="phoneNumber"
                  />
                </div>
                {errors.line && <p className="text-info font-medium mt-1">{errors.line}</p>}
              </div>
              <button
                type="button"
                onClick={handelSubmit}
                className="text-primary font-medium mt-3 float-right"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddAddressPopup;
