"use client";
import { Controller, FieldError, useFormContext } from "react-hook-form";

type TInputProps = {
  type?: string;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  options: IOption[];
  defaultValue: string;
  required?: boolean;
  readonly?: boolean;
};

interface IOption {
  name: string;
  value: string;
}

const FormSelect = ({ type, name, label, options, className, required }: TInputProps) => {
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
            <select
              className={
                className ||
                "w-full mt-1 px-2 py-3 rounded-lg border  dark:bg-dark_color focus:outline-none focus:border-spacing-2    font-medium outline-primary-color outline-2"
              }
              {...field}
              value={field.value || ""}
              id={name}
              required={required}
            >
              {options.map((option, index) => (
                <option value={option.value} key={"option" + (index + 1)}>
                  {option.name}
                </option>
              ))}
            </select>
            {error && <p className=" text-red-600 mt-1">{error}</p>}
          </div>
        );
      }}
    />
  );
};

export default FormSelect;
