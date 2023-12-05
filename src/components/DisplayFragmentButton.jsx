import { apiUrl } from "../../utilities/api";
import { getAuthHeaders } from "../../utilities/auth";
import { useState, useEffect } from "react";
import Image from "next/legacy/image";

const displayFragment = async (
  fragmentId,
  fragmentType,
  setDisplayedFragment,
  setDisplayStatus
) => {
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
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setDisplayedFragment(blobUrl);
    } else {
      const resText = res.text();
      setDisplayedFragment(resText);
    }
    setDisplayStatus(true);
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
};

export default function DisplayFragmentButton({
  fragmentId,
  fragmentType,
  editFragment,
}) {
  const [displayedFragment, setDisplayedFragment] = useState(null);
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
      setDisplayedFragment(null);
    }
  };

  useEffect(() => {
    setDisplayStatus(false);
    setDisplayedFragment(null);
  }, [editFragment]);

  return (
    <>
      <button
        className="px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600 w-21 h-8"
        onClick={handleClick}
      >
        {displayStatus ? "Minimize" : "Display"}
      </button>
      {displayStatus && displayedFragment && fragmentType.includes("image") ? (
        <Image
          layout="responsive"
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
