import { useState, useEffect } from "react";
import validTypes from "../../utilities/validTypes";
import { apiUrl } from "../../utilities/api";
import { getAuthHeaders } from "../../utilities/auth";

const mime = require("mime-types");

// file type to file extension
const fileTypeToExt = (fragmentType) => {
  // if the file type string in the Valid Types map, return the file extension
  if (validTypes.has(fragmentType)) {
    let fileExt = mime.extension(fragmentType);
    fileExt = fileExt === "markdown" ? "md" : fileExt;
    console.log(
      `fileTypeToExt: ${fragmentType} is valid and has extension ${fileExt}`
    );
    return fileExt;
  } else {
    console.log(`fileTypeToExt: ${fragmentType} is NOT valid`);
    return null;
  }
};

// available file formats for conversion
const formats = (fragmentType) => {
  if (fragmentType.includes("text/")) {
    if (fragmentType.includes("text/markdown")) {
      return ["text/plain", "text/html"];
    } else if (fragmentType.includes("text/html")) {
      return ["text/plain"];
    }
  } else if (fragmentType.includes("application/json")) {
    return ["text/plain"];
  } else if (fragmentType.includes("image/")) {
    return ["image/png", "image/jpeg", "image/webp", "image/gif"];
  } else {
    return [];
  }
};

const convertFragment = async (fragmentId, fragmentType, toFileType) => {
  // get the file extension from the file type
  const ext = fileTypeToExt(toFileType);
  const validFormats = formats(fragmentType);
  console.log("available formats: ", validFormats);
  console.log("file extension: ", ext);
  console.log("Converting fragment with id: ", fragmentId);
  try {
    // check if the file type is valid
    if (!validTypes.has(toFileType)) {
      throw new Error(`Invalid file type ${toFileType}`);
    }
    const user = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}.${ext}`, {
      method: "GET",
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data =
      toFileType.startsWith("text/") || toFileType === "application/json"
        ? await res.text()
        : await res.blob();
    console.log("Converted fragment", { data });

    // Create a Blob from the data
    const blob =
      typeof data === "string" ? new Blob([data], { type: toFileType }) : data;
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set the link's href to the Blob URL
    link.href = url;

    // Set the download attribute to the desired file name
    link.download = `${fragmentId}.${ext}`;

    // Append the link to the body
    document.body.appendChild(link);

    // Simulate a click on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  } catch (err) {
    // log the file type
    console.log("file type: ", fragmentType);
    console.error("Unable to call GET /v1/fragment/:id.:ext", { err });
  }
};

export default function ConvertFragmentButton(props) {
  const [valid, setValid] = useState(false);
  const [isConvertClicked, setIsConvertClicked] = useState(false);
  const [toFileType, setToFileType] = useState("");

  return (
    <div className="mt-4">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={() => {
          setIsConvertClicked(!isConvertClicked);
        }}
      >
        {isConvertClicked ? "Cancel" : "Convert"}
      </button>
      <button>
        {isConvertClicked && (
          <button
            type="button"
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            onClick={() => {
              convertFragment(props.fragmentId, props.fragmentType, toFileType);
            }}
          >
            Download
          </button>
        )}
      </button>
      {isConvertClicked && (
        <div className="mt-2">
          <label
            htmlFor="toFileType"
            className="block text-sm font-medium text-gray-700"
          >
            Convert to:
          </label>
          <select
            id="toFileType"
            name="toFileType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={toFileType}
            onChange={(e) => {
              setToFileType(e.target.value);
              console.log("toFileType: ", toFileType);
            }}
          >
            <option className="text-black" disabled={true} value="">
              Select a format
            </option>
            {formats(props.fragmentType).map((format) => (
              <option className="text-black" key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
