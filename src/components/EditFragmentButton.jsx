import { useState } from "react";
import validTypes from "../../utilities/validTypes";
import { getAuthHeaders } from "../../utilities/auth";
import FileSelectorRadio from "./FileSelectorRadio";
import { Logger } from "aws-amplify";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function EditFragmentButton({
  fragmentId,
  fragmentType,
  editFragment,
  setEditFragment,
}) {
  // states
  const [isEditing, setIsEditing] = useState(false);
  const [newTextFragment, setNewTextFragment] = useState("");
  const [type, setType] = useState(fragmentType);

  const handleClick = () => {
    setIsEditing(!isEditing);
    // reset the text fragment
    setNewTextFragment("");
  };

  const handleTextSave = async (event) => {
    try {
      event.preventDefault();
      if (!newTextFragment) {
        alert("Please enter some text");
        return;
      }
      const formData = new FormData(event.target);
      const file = formData.get("text") || formData.get("image");
      const user = await getAuthHeaders();
      console.log("file:", file);
      //log the formdata value:
      console.log("formData:", ...formData.entries());
      console.log("file type:", type);
      console.log("fragment type:", fragmentType);

      let buffer = null;
      if (file) {
        if (typeof file === "string") {
          buffer = Buffer.from(file, "utf8");
        } else {
          const response = await fetch(URL.createObjectURL(file));
          const arrayBuffer = await response.arrayBuffer();
          console.log("file type: image: ", type);
          buffer = Buffer.from(arrayBuffer);
        }
      } else {
        console.error("File is null");
        return;
      }

      const response = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": fragmentType,
          Authorization: `Bearer ${user.idToken}`,
        },
        body: buffer,
      });
      if (response.ok) {
        console.log("fragment updated successfully");
        // clear the form
        setNewTextFragment("");
        setIsEditing(!isEditing);
        setEditFragment(editFragment + 1);
      } else {
        console.error("Error updating buffer:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  const handleTextFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    let fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!fileType) {
      if (fileExtension === "md" || fileExtension === "markdown") {
        fileType = "text/markdown";
      }
    }

    if (fragmentType !== fileType) {
      alert(`${fileType} is not the same type as the original fragment`);
      return;
    }

    if (validTypes.has(fileType)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (fileType.startsWith("text/")) {
          setNewTextFragment(event.target.result);
        }
      };
      if (fileType.startsWith("text/")) {
        reader.readAsText(file);
      } else if (fileType.startsWith("image/")) {
        reader.readAsDataURL(file);
      }
    } else {
      alert(`${fileType} is an unsupported file format`);
    }
  };

  return (
    <form
      onSubmit={handleTextSave}
      onDrop={handleTextFileDrop}
      className="my-2"
    >
      <button
        type="button"
        className="px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600 w-20 h-8"
        onClick={handleClick}
      >
        {isEditing ? "Cancel" : "Edit"}
      </button>

      {isEditing && (
        <>
          <button
            type="submit"
            className=" ml-2 px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600 w-20 h-8"
          >
            Save
          </button>
          <FileSelectorRadio
            type={type}
            setType={setType}
            text={newTextFragment}
            setText={setNewTextFragment}
            disableSelection={true}
          />
        </>
      )}
    </form>
  );
}
