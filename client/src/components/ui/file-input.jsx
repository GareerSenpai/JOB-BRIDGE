import React, { useState } from "react";
import { Input } from "./input.jsx";

const FileInput = ({
  className,
  accept,
  name,
  placeholder,
  value,
  onChange,
  ...props
}) => {
  const [fileName, setFileName] = useState(value?.name || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };
  return (
    <div className={`relative ${className}`}>
      <Input
        type="file"
        className={`opacity-0 `}
        accept={accept ? accept : "*/*"}
        name={name}
        onChange={handleFileChange}
        {...props}
      />
      <Input
        placeholder={fileName || placeholder}
        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pointer-events-none placeholder:${
          fileName ? "text-white" : "text-gray-500"
        }`}
        readOnly
      />
      {/* <p
        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pointer-events-none ${
          fileName ? "text-white" : "text-gray-500"
        }`}
      >
        {fileName || placeholder}
      </p> */}
    </div>
  );
};

export default FileInput;
