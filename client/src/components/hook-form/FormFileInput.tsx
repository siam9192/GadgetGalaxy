"use client";
import { Controller, FieldError, useFormContext } from "react-hook-form";

type TInputProps = {
  name: string;
  label?: string;
  accept: string;
  className?: string;
  required?: boolean;
};

const FormFileInput = ({ name, label, accept }: TInputProps) => {
  const {
    formState: { errors },
  } = useFormContext();

  let error: string | undefined;

  if (name.includes(".")) {
    const keys = name.split(".");

    let value: any = errors; // Ensure 'errors' is the source object
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]; // Traverse nested properties
      } else {
        value = undefined; // Avoid invalid access
        break;
      }
    }

    if (typeof value === "object" && value.message) {
      error = value.message; // Assign value if it's a string
    }
  } else {
    const errorObj = errors[name]; //Assign value
    error =
      typeof errorObj === "object" && errorObj.message ? (errorObj.message as string) : undefined; //Assign error base on value type
  }

  const handle_key_press = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
    }
  };

  return (
    <Controller
      name={name}
      render={({ field }) => {
        return (
          <div>
            {label && (
              <label className="  block text-start 0font-medium text-[1zrem]" htmlFor={name}>
                {label}
              </label>
            )}
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files;
                if (file) field.onChange(file);
              }}
              accept={accept}
            />
            {error && <p className=" text-red-600 mt-1">{error}</p>}
          </div>
        );
      }}
    />
  );
};

export default FormFileInput;
