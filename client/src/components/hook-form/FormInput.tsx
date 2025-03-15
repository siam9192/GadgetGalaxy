"use client";
import { Controller, FieldError, useFormContext } from "react-hook-form";

type TInputProps = {
  type?: string;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  readonly?: boolean;
};

const FormInput = ({
  type,
  name,
  label,
  placeholder,
  className,
  required,
  readonly,
}: TInputProps) => {
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
              <label className="  block text-start 0font-medium text-[1rem]" htmlFor={name}>
                {label}
              </label>
            )}
            <input
              className={
                className ||
                "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
              }
              {...field}
              value={field.value || ""}
              type={type || "text"}
              placeholder={placeholder || ""}
              id={name}
              required={required}
              readOnly={readonly}
              onKeyDown={handle_key_press}
            />
            {error && <p className=" text-red-600 mt-1">{error}</p>}
          </div>
        );
      }}
    />
  );
};

export default FormInput;
