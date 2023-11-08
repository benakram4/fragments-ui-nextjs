import React, { useState } from "react";
import validTypes from "../../utilities/validTypes";

const RadioValidTypes = [...validTypes]
  .filter(([key, value]) => value === true)
  .map(([key, value]) => key);

export default function FileSelectorRadio(props) {
  const [selectedOption, setSelectedOption] = useState("");
  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    console.log(file);
    let fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // If the MIME type is empty, check the file extension
    if (!fileType) {
      if (fileExtension === "md" || fileExtension === "markdown") {
        fileType = "text/markdown";
      }
    }

    setSelectedOption(fileType);
    console.log(file);
    console.log(fileType);
  };

  return (
    <>
      <label
        htmlFor="fileTypes"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select an option
      </label>
      <select
        id="fileTypes"
        className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option>Choose a File Type</option>
        {RadioValidTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {(selectedOption.includes("text") ||
        selectedOption.includes("application/json")) && (
        <div className="mb-4">
          <label htmlFor="text" className="block font-medium text-gray-500">
            Enter Text or Drop a File
          </label>
          <textarea
            name="text"
            id="text"
            rows="7"
            type={props.type}
            className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={props.text}
            onDrop={onDrop}
            onChange={(event) => {
              props.setText(event.target.value);
              props.setType(selectedOption);
            }}
          ></textarea>
        </div>
      )}
    </>
  );
}
