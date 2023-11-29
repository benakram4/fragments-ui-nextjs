import { useState } from "react";
import validTypes from "../../utilities/validTypes";
import { getAuthHeaders } from "../../utilities/auth";
import { getUserFragments } from "../../utilities/api";
import FileSelectorRadio from "@/components/FileSelectorRadio";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function UserForm({ setFragUploadedCounter, fragUploadedCounter }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const file = formData.get("text") || formData.get("image");
      const user = await getAuthHeaders();
      console.log("file:", file);
      //log the formdata value:
      console.log("formData:", ...formData.entries());

      let buffer = null;
      console.log("file type:", type);
      if (file instanceof Blob) {
        const response = await fetch(URL.createObjectURL(file));
        const arrayBuffer = await response.arrayBuffer();
        console.log("file type: image: ", type);
        buffer = Buffer.from(arrayBuffer);
      } else {
        buffer = Buffer.from(file);
      }

      const response = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        headers: {
          "Content-Type": type,
          Authorization: `Bearer ${user.idToken}`,
        },
        body: buffer,
      });
      // reset the file type after each submit
      setType('');
      if (response.ok) {
        console.log("fragment posted successfully");
        // clear the form
        setText(undefined);
        // call the API to get the latest fragments
        await getUserFragments();
        setFragUploadedCounter(fragUploadedCounter + 1);
      } else {
        console.error("Error posting buffer:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  const handleDrop = (event) => {
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

    setType(fileType);

    // Check if the MIME type is valid
    if (validTypes.has(fileType)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert(`${fileType} is unsupported file format`);
    }
  };

  return (
    <div>
      <h1 className="m-5 text-xl font-medium">Upload a Fragment</h1>
      <form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        className="p-4 border-2 border-gray-300 rounded-lg"
      >
        <FileSelectorRadio
          type={type}
          setType={setType}
          text={text}
          setText={setText}
        />
        <button
          type="submit"
          disabled={!text }
          className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post
        </button>
        <button
          type="button"
          onClick={() => {
            setText("");
          }}
          className="px-4 py-2 mx-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default UserForm;
