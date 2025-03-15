"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IconType } from "react-icons";

type TInputProps = {
  type?: string;
  name: string;
  label?: string;
  placeholder?: string;
  icon: IconType;
  required?: boolean;
  className?: string;
};

const FormInputWithIcon = (props: TInputProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  const { type, name, placeholder } = props;

  const error = errors[name]?.message?.toString();

  return (
    <Controller
      name={name}
      render={({ field }) => {
        return (
          <div>
            <div
              className={`flex items-center gap-2 pl-4 px-1 bg-gray-100 dark:bg-dark-light  rounded-md `}
            >
              <span className="text-2xl font-medium dark:text-white">{<props.icon />}</span>
              <input
                {...field}
                value={field.value || ""}
                id={name}
                type={type || "text"}
                placeholder={placeholder || ""}
                className="w-full   border-none outline-none bg-transparent placeholder:font-medium pl-2 py-4 dark:text-white"
              />
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        );
      }}
    />
  );
};

export default FormInputWithIcon;
