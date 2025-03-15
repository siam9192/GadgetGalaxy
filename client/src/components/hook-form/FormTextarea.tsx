"use client";
import { Controller, useFormContext } from "react-hook-form";

type TFormTextAreaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
};

const FormTextArea = ({ name, label, placeholder, className }: TFormTextAreaProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message?.toString();

  return (
    <Controller
      name={name}
      render={({ field }) => {
        return (
          <div>
            {label && (
              <label className="  block text-start 0font-medium text-[1rem]" htmlFor={name}>
                {label}
              </label>
            )}
            <textarea
              className={
                className ||
                "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary h-52 resize-none"
              }
              {...field}
              value={field.value || ""}
              placeholder={placeholder || ""}
              id={name}
            />
            {error && <p className=" text-red-600 mt-1">{error}</p>}
          </div>
        );
      }}
    />
  );
};

export default FormTextArea;
