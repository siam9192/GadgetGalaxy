import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  label: string;
  value: string;
  defaultChecked?: boolean;
}

function FormCheckbox({ name, label, value, defaultChecked }: IProps) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={defaultChecked ? value : ""}
      render={({ field }) => (
        <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
          <input
            type="radio"
            name={name}
            value={field.value || value}
            className="size-5 accent-info"
            defaultChecked={defaultChecked}
          />
          <label htmlFor="gender-male">{label}</label>
        </div>
      )}
    />
  );
}

export default FormCheckbox;
