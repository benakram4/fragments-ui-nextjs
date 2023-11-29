import { apiUrl } from "../../utilities/api";
import { getAuthHeaders } from "../../utilities/auth";
import { useState } from "react";
import Image from "next/image";

const displayFragment = async (
  fragmentId,
  fragmentType,
  setDisplayedFragment,
  setDisplayStatus
) => {
  console.log("Displaying fragment with id: ", fragmentId);
  console.log("Displaying fragment with type: ", fragmentType);
  try {
    const user = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: "GET",
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    if (fragmentType.includes("image")) {
      console.log("res Display", res.body);
      const blob = await res.blob();
      console.log("blob", blob);
      const blobUrl = URL.createObjectURL(blob);
      console.log("blobUrl", blobUrl);
      setDisplayedFragment(blobUrl);
    } else {
      const resText = res.text();
      console.log("resText", resText);
      setDisplayedFragment(resText);
    }
    setDisplayStatus(true);
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
};

export default function DisplayFragmentButton({ fragmentId, fragmentType }) {
  const [displayedFragment, setDisplayedFragment] = useState(undefined);
  const [displayStatus, setDisplayStatus] = useState(false);

  const handleClick = () => {
    if (!displayStatus) {
      displayFragment(
        fragmentId,
        fragmentType,
        setDisplayedFragment,
        setDisplayStatus
      );
    } else {
      setDisplayStatus(false);
      setDisplayedFragment(undefined);
    }
  };

  return (
    <>
      <button
        className="px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600"
        onClick={handleClick}
      >
        {displayStatus ? "Minimize" : "Display"}
      </button>
      {displayStatus && displayedFragment && fragmentType.includes("image") ? (
        <Image
          width={1000}
          height={800}
          src={displayedFragment}
          alt="fragment"
        />
      ) : (
        <p>{displayedFragment}</p>
      )}
    </>
  );
}
