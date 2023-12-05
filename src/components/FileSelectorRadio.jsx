import { useState, useEffect } from "react";
import validTypes from "../../utilities/validTypes";
import { Elsie_Swash_Caps } from "next/font/google";

const RadioValidTypes = [...validTypes]
  .filter(([key, value]) => value === true)
  .map(([key, value]) => key);

export default function FileSelectorRadio(props) {
  const [selectedOption, setSelectedOption] = useState("");

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    let fileType = file.type;
    if (fileType !== selectedOption) {
      alert("The file type does not match the selected type.");
      event.target.value = ''; // Reset the value of the file input
      return;
    }
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // If the MIME type is empty, check the file extension
    if (!fileType) {
      if (fileExtension === "md" || fileExtension === "markdown") {
        fileType = "text/markdown";
      }
    }

    if (props.disableSelection) {
      setSelectedOption(props.type);
    } else {
      setSelectedOption(fileType);
    }
  };

  function renderOption() {
    if (
      selectedOption.includes("text") ||
      selectedOption.includes("application/json")
    ) {
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
            className="mt-1 text-white block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={async (event) => {
              const file = event.target.files[0];
              if (file.type !== selectedOption) {
                alert("The file type does not match the selected type.");
                event.target.value = ""; // Reset the value of the file input
                return;
              }
              const reader = new FileReader();
              reader.onloadend = function () {
                const dataUrl = reader.result;
                props.setText(dataUrl);
                props.setType(selectedOption);
              };
              // only if file is a blob
              if (file) {
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (props.disableSelection) {
      setSelectedOption(props.type);
    }
  }, [props.disableSelection, props.type]);

  return (
    <div className="my-2">
      <label
        htmlFor="fileTypes"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {!props.disableSelection
          ? "Select Fragment Type to Upload"
          : "Update Fragment"}
      </label>
      <select
        id="fileTypes"
        className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {!props.disableSelection ? (
          <>
            <option value="" disabled>
              Select fragment type
            </option>
            {RadioValidTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </>
        ) : (
          <option disabled={true} key={props.type} value={props.type}>
            {props.type}
          </option>
        )}
      </select>

      {renderOption()}
    </div>
  );
}
