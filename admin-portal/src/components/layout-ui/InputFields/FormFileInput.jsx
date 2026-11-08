// import React from "react";
// import { useField, useFormikContext } from "formik";

// const FormFileInput = ({ name, accept = "image/*", className }) => {
//   const [, meta] = useField(name);
//   const { setFieldValue } = useFormikContext();

//   return (
//     <div className={`flex flex-col gap-1 mb-2  ${className}`}>
//       <input
//         id={name}
//         name={name}
//         type="file"
//         accept={accept}
//         onChange={(event) => {
//           const file = event.currentTarget.files[0];
//           setFieldValue(name, file);
//         }}
//         className="px-3 py-2 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-1 file:rounded file:cursor-pointer border-2 rounded-md focus:outline-none focus:ring-2
//     bg-white text-gray-dark placeholder-gray-light border-gray-light
//     dark:bg-black dark:text-white dark:placeholder-gray-light dark:border-gray-dark"
//       />
//       {meta.touched && meta.error && (
//         <div className="text-sm text-red-500">{meta.error}</div>
//       )}
//     </div>
//   );
// };

// export default FormFileInput;
import React from "react";
import { useField, useFormikContext } from "formik";

const FormFileInput = ({ name, accept = "image/*", className }) => {
  const [, meta] = useField(name);
  const { setFieldValue, values } = useFormikContext();

  const value = values?.[name]; // ✅ safe access
  let previewUrl = null;

  if (typeof value === "string") {
    previewUrl = value;
  } else if (value instanceof File) {
    previewUrl = URL.createObjectURL(value);
  }

  return (
    <div className={`flex flex-col gap-1 mb-2 ${className}`}>
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.currentTarget.files[0];
          setFieldValue(name, file);
        }}
        className="px-3 py-2 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-1 file:rounded file:cursor-pointer border-2 rounded-md focus:outline-none focus:ring-2
        bg-white text-gray-dark placeholder-gray-light border-gray-light
        dark:bg-black dark:text-white dark:placeholder-gray-light dark:border-gray-dark"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 w-40 h-auto border rounded shadow"
        />
      )}

      {meta.touched && meta.error && (
        <div className="text-sm text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default FormFileInput;
