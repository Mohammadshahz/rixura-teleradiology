// src/components/FormInput.jsx
import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputClass = `w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2
    bg-white text-gray-dark placeholder-gray-light border-gray-light
    dark:bg-black dark:text-white dark:placeholder-gray-light dark:border-gray-dark
    ${
      meta.touched && meta.error
        ? "border-red-500 focus:ring-red-400 dark:border-red-500 dark:focus:ring-red-400"
        : "focus:ring-primary dark:focus:ring-primary-light"
    }
    ${
      props.disabled
        ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
        : ""
    }
  `;

  return (
    <div className="mb-2 flex-1">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block mb-2 text-sm font-medium text-gray-dark dark:text-gray-light"
        >
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input className={inputClass} {...field} {...props} />

      <div className="min-h-[1rem] mt-1 text-xs text-red-500">
        {meta.touched && meta.error ? meta.error : ""}
      </div>
    </div>
  );
};

export default FormInput;
