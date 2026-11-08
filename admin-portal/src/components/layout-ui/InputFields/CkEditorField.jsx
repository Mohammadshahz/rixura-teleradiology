// // src/components/layout-ui/InputFields/CKEditorField.jsx
// import React from "react";
// import { useField } from "formik";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const CKEditorField = ({ label, ...props }) => {
//   const [field, meta, helpers] = useField(props);
//   const { setValue, setTouched } = helpers;

//   return (
//     <div className="mb-4 w-full">
//       <div
//         className={`
//           rounded-md
//           overflow-hidden
//           bg-white dark:bg-black
//           border border-gray-300 dark:border-gray-700
//           shadow-sm focus-within:ring-2 focus-within:ring-primary
//         `}
//       >
//         <CKEditor
//           editor={ClassicEditor}
//           data={field.value}
//           onChange={(_, editor) => {
//             const data = editor.getData();
//             setValue(data);
//           }}
//           onBlur={() => setTouched(true)}
//           config={{
//             toolbar: {
//               items: [
//                 "heading",
//                 "|",
//                 "bold",
//                 "italic",
//                 "underline",
//                 "link",
//                 "bulletedList",
//                 "numberedList",
//                 "|",
//                 "blockQuote",
//                 "undo",
//                 "redo",
//               ],
//               shouldNotGroupWhenFull: true,
//             },
//           }}
//         />
//       </div>

//       {meta.touched && meta.error && (
//         <div className="mt-1 text-xs text-red-500">{meta.error}</div>
//       )}
//     </div>
//   );
// };

// export default CKEditorField;
import React, { useEffect } from "react";
import { useField } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useThemeContext } from "../../../context/ThemeContext"; // Adjust path if needed

const CKEditorField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue, setTouched } = helpers;
  const { theme } = useThemeContext();

  useEffect(() => {
    const styleId = "ckeditor-theme-style";
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    // Apply dynamic styles based on theme
    if (theme === "dark") {
      style.innerHTML = `
        .ck.ck-editor__editable {
          background-color: #2c2c2c !important;
          color: #ffffff !important;
          border-color: #444 !important;
        }
        .ck-sticky-panel__content{
          border-color: #444 !important;
        }
        .ck.ck-toolbar {
          background-color: #2c2c2c !important;
          border-color: #444 !important;
        }
        .ck.ck-button .ck-button__label,
        .ck.ck-button .ck-button__icon {
          color: #ffffff !important;
        }
        .ck-button:hover {
          background-color: #444 !important;
        }
        .ck-button {
          background-color: #444 !important;
        }
        .ck-list__item{
          background-color: #444 !important;
          border-color: #444 !important;'
          color: #ffffff !important;
        }
        .ck-heading-dropdown{
        background-color: #444 !important;
          border-color: #444 !important;'
          color: #ffffff !important;
        }
      `;
    } else {
      style.innerHTML = `
        .ck.ck-editor__editable {
          background-color: #ffffff !important;
          color: #2c2c2c !important;
        }
        .ck.ck-toolbar {
          background-color: #ffffff !important;
          border-color: #ddd !important;
        }
        .ck.ck-button .ck-button__label,
        .ck.ck-button .ck-button__icon {
          color: #2c2c2c !important;
        }
      `;
    }

    // Cleanup on unmount
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, [theme]);

  return (
    <div className="mb-4 w-full">
      <div
        className={`
          rounded-md
          overflow-hidden
          ${
            theme === "dark"
              ? "bg-[#2c2c2c] border-gray-700"
              : "bg-white border-gray-400"
          }
          border
          shadow-sm focus-within:ring-2 focus-within:ring-primary
        `}
      >
        <CKEditor
          editor={ClassicEditor}
          data={field.value}
          onChange={(_, editor) => {
            const data = editor.getData();
            setValue(data);
          }}
          onBlur={() => setTouched(true)}
          config={{
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "blockQuote",
                "undo",
                "redo",
              ],
              shouldNotGroupWhenFull: true,
            },
          }}
        />
      </div>

      {meta.touched && meta.error && (
        <div className="mt-1 text-xs text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default CKEditorField;
