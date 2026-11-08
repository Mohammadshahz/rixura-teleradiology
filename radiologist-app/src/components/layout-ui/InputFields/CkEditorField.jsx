// src/components/layout-ui/InputFields/CKEditorField.jsx
import React from "react";
import { useField } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue, setTouched } = helpers;

  return (
    <div className="mb-4 w-full flex-1 ckeditor-wrapper">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block mb-2 text-sm font-medium text-gray-dark dark:text-gray-light"
        >
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={`
          rounded-md 
          overflow-hidden 
          bg-white dark:bg-black 
          border border-gray-300 dark:border-gray-700 
          text-black dark:text-black
          dark:invert
        `}
      >
        <CKEditor
          className=""
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
                 'bold', 'italic', 'underline', 'link', 'bulletedList',
                 'numberedList', '|',
                'blockQuote', 
                'undo', 'redo'
              ],
              shouldNotGroupWhenFull: true
            }
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
