import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;
  const isDisabled = props.disabled;

  const inputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
    ${
      isDisabled
        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600"
        : "bg-white text-gray-dark placeholder-gray-light border-gray-light dark:bg-black dark:text-white dark:placeholder-gray-light dark:border-gray-300"
    }
    ${
      isError
        ? "border-red-500 focus:ring-red-400 dark:border-red-500 dark:focus:ring-red-400"
        : !isDisabled && "focus:ring-primary dark:focus:ring-primary-light"
    }`;

  const InputComponent = props.as === "textarea" ? "textarea" : "input";

  return (
    <div className="mb-2 flex-1">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className={`block mb-2 text-sm font-medium ${
            isDisabled
              ? "text-gray-400 dark:text-gray-400"
              : "text-gray-dark dark:text-gray-light"
          }`}
        >
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <InputComponent className={inputClass} {...field} {...props} />
      {isError ? (
        <div className="min-h-[1rem] mt-1 text-xs text-red-500">
          {meta.error}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default FormInput;
