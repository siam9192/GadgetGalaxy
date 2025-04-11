"use client";
import React, { ReactNode, useEffect, useState } from "react";

interface IProps {
  onSave: (values: any) => void;
  defaultValues: Record<string, string>;
  children: ReactNode;
}

const EditAddressPopup = ({ defaultValues, onSave, children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const [district, setDistrict] = useState(defaultValues.district);
  const [zone, setZone] = useState(defaultValues.zone);
  const [line, setLine] = useState(defaultValues.line);
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
    onSave(values);
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="size-fit ">
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
            <h1 className="text-xl font-medium text-black">Edit Address</h1>
            <div className="mt-2 space-y-2">
              <div>
                <div>
                  <label className="  block text-start 0font-medium text-[1rem] text-black">
                    District*
                  </label>

                  <input
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary text-black "
                    }
                    defaultValue={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    type="text"
                  />
                </div>
                {errors.district && <p className="text-info font-medium mt-1">{errors.district}</p>}
              </div>
              <div>
                <div>
                  <label className="  block text-start 0font-medium text-[1rem] text-black">
                    Zone*
                  </label>

                  <input
                    onChange={(e) => setZone(e.target.value)}
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary text-black"
                    }
                    defaultValue={zone}
                    type="text"
                  />
                </div>
                {errors.line && <p className="text-info font-medium mt-1">{errors.line}</p>}
              </div>
              <div>
                <div>
                  <label className="  block text-start 0font-medium text-[1rem] text-black">
                    Line*
                  </label>

                  <input
                    onChange={(e) => setLine(e.target.value)}
                    defaultValue={line}
                    className={
                      "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary text-black"
                    }
                    type="text"
                  />
                </div>
                {errors.line && <p className="text-info font-medium mt-1">{errors.line}</p>}
              </div>
              <button onClick={handelSubmit} className="text-primary font-medium mt-3 float-right">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EditAddressPopup;
