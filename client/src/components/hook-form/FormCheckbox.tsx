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
        <div className="w-fit flex flex-row-reverse items-center gap-2">
          <label htmlFor={name} className="font-medium">
            {label}
          </label>
          <input
            type="checkbox"
            className="w-5 h-5 accent-primary_color"
            {...field}
            value={value}
            checked={field.value === value}
            onChange={(e) => {
              field.onChange(e.target.checked ? value : "");
            }}
          />
          {errors[name] && (
            <span className="text-red-500 text-sm">{errors[name].message as string}</span>
          )}
        </div>
      )}
    />
  );
}

export default FormCheckbox;
