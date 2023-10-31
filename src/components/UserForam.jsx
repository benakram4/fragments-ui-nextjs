import { useState } from "react";
import validTypes from "../../utilities/validTypes";
import { getAuthHeaders } from "../../utilities/auth";
import { getUserFragments } from "../../utilities/api";
import FileSelectorRadio from "@/components/FileSelectorRadio";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function UserForm(props) {
  const [text, setText] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const user = await getAuthHeaders();
      const resBody = formData.get("text");
      console.log(type);
      const response = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        headers: {
          "Content-Type": type,
          Authorization: `Bearer ${user.idToken}`,
        },
        body: resBody,
      });
      // reset the file type after each submit
      setType("");
      if (response.ok) {
        console.log("fragment posted successfully");
        // clear the form
        setText("");
        // call the API to get the latest fragments
        await getUserFragments();
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
    console.log(file);
    let fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // If the MIME type is empty, check the file extension
    if (!fileType) {
      if (fileExtension === "md" || fileExtension === "markdown") {
        fileType = "text/markdown";
      }
    }

    setType(fileType);
    console.log(file);
    console.log(fileType);

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
        className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Post
      </button>
    </form>
  );
}

export default UserForm;
