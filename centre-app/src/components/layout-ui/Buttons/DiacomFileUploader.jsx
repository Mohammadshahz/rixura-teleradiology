import React from "react";

const DicomFileUploader = ({ value = [], onChange, error, touched }) => {
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.currentTarget.files);
    const fileInput = event.currentTarget;

    if (newFiles.length > 0) {
      const allValid = newFiles.every((file) => {
        const name = file.name.toLowerCase();
        const validTypes = [
          ".dcm",
          ".jpg",
          ".jpeg",
          ".png",
        ];
        return validTypes.some((type) => name.endsWith(type));
      });

      if (!allValid) {
        alert("Only DICOM (.dcm), JPG, and PNG files are allowed.");
        fileInput.value = "";
        return;
      }

      const updatedFiles = [
        ...value,
        ...newFiles.filter(
          (newFile) => !value.some((file) => file.name === newFile.name)
        ),
      ];

      onChange(updatedFiles);
    }
  };

  const handleClearFiles = () => {
    onChange([]);
    document.getElementById("reportFile").value = "";
  };

  return (
    <div className="mb-4">
      <div className="flex flex-row items-start gap-4">
        {/* File Input */}
        <div className="relative">
          <input
            id="reportFile"
            name="reportFile"
            type="file"
            accept=".dcm,.DCM,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            className="opacity-0 absolute w-full h-full cursor-pointer"
          />
          <label
            htmlFor="reportFile"
            className="inline-block py-2 px-4 rounded-md text-sm font-semibold bg-primary-light text-primary-dark hover:bg-primary"
          >
            {value && value.length > 0 ? "Select More Files" : "Choose Files"}
          </label>
        </div>

        {/* Clear Button */}
        {value && value.length > 0 && (
          <button
            type="button"
            onClick={handleClearFiles}
            className="py-2 px-4 rounded-md text-sm font-semibold bg-gray-light text-gray-dark hover:bg-gray"
          >
            Clear Files
          </button>
        )}

        {/* Selected Files */}
        {value && value.length > 0 && (
          <div>
            <p className="text-sm text-gray">Selected Files:</p>
            <ul className="list-disc list-inside text-sm text-gray">
              {value.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {touched && error && (
        <div className="mt-1 text-sm text-primary-dark">{error}</div>
      )}
    </div>
  );
};

export default DicomFileUploader;
