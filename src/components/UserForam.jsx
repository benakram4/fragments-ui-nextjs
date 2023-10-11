import { useState } from "react";
import validTypes from "../../utilities/validTypes";
import { getAuthHeaders } from "../../utilities/auth";
import { getUserFragments } from "../../utilities/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function UserForm(props) {
  const [text, setText] = useState("");
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const user = await getAuthHeaders();
      const resBody = formData.get("text");
      const response = await fetch(`${apiUrl}/v1/fragments`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Authorization: `Bearer ${user.idToken}`,
        },
        body: resBody,
      });

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
    if (validTypes.get(file.type) === true) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert(`${file.type} is unsupported file format`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDrop={handleDrop}
      className="p-4 border-2 border-gray-300 rounded-lg"
    >
      <div className="mb-4">
        <label htmlFor="text" className="block font-medium text-gray-500">
          Enter Plain Text or Drop a File
        </label>
        <textarea
          name="text"
          id="text"
          rows="7"
          className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={text}
          onChange={(event) => setText(event.target.value)}
        ></textarea>
      </div>
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
