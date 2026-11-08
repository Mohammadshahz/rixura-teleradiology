// src/components/FormInput.jsx
import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
    meta.touched && meta.error
      ? "border-red-500 focus:ring-red-400"
      : "border-gray-300 focus:ring-gray-400"
  }`;

  return (
    <div className="mb-2 flex-1">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input type="text" className={inputClass} {...field} {...props} />

      {/* {meta.touched && meta.error && (
        <div
          id={`${props.id || props.name}-error`}
          className="mt-1 text-sm text-red-500"
        >
          {meta.error}
        </div>
      )} */}
      <div className="min-h-[1rem] mt-1 text-xs text-red-500">
        {meta.touched && meta.error ? meta.error : ""}
      </div>
    </div>
  );
};

export default FormInput;
