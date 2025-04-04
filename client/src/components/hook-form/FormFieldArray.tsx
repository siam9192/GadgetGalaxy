import { useFieldArray, useForm } from "react-hook-form";

function FormFieldArray() {
  const { control, register } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "test", // unique name for your Field Array
  });

  // return (
  //   {fields.map((field, index) => (
  //     <input
  //       key={field.id} // important to include key with field's id
  //       {...register(`test.${index}.value`)}
  //     />
  //   ))}
  // );
}

export default FormFieldArray;
