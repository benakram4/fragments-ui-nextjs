import { useState } from "react";
import validTypes from "../../utilities/validTypes";

const RadioValidTypes = [...validTypes]
  .filter(([key, value]) => value === true)
  .map(([key, value]) => key);

export default function FileSelectorRadio(props) {
  const [selectedOption, setSelectedOption] = useState("");

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    let fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // If the MIME type is empty, check the file extension
    if (!fileType) {
      if (fileExtension === "md" || fileExtension === "markdown") {
        fileType = "text/markdown";
      }
    }

    setSelectedOption(fileType);
  };

  function renderOption() {
    if (
      selectedOption.includes("text") ||
      selectedOption.includes("application/json")
    ) {
      console.log("selectedOption in text", selectedOption);
      return (
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
      );
    } else if (selectedOption.includes("image")) {
      // add dropzone for images
      console.log("selectedOption in image", selectedOption);
      return (
        <div className="mb-4">
          <label htmlFor="image" className="block font-medium text-gray-500">
            Drop an Image File
          </label>
          <input
            name="image"
            id="image"
            type="file"
            accept="image/*"
            className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={async (event) => {
              const file = event.target.files[0];
              // log the file name
              console.log("file name", file.name);
              const reader = new FileReader();
              reader.onloadend = function () {
                const arrayBuffer = reader.result;
                if (Buffer.isBuffer(arrayBuffer)) {
                  console.log("arrayBuffer is already buffer!!!!!!!", arrayBuffer);}
                else {
                  console.log("arrayBuffer is not !!", arrayBuffer);
                }
                const buffer = Buffer.from(arrayBuffer);
                props.setText(buffer);
                props.setType(selectedOption);
              };
              reader.readAsArrayBuffer(file);
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <label
        htmlFor="fileTypes"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select Fragment Type to Upload
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

      {renderOption()}
    </>
  );
}
