import { apiUrl } from "../../utilities/api";
import { getAuthHeaders } from "../../utilities/auth";

// delete a fragment
const deleteFragment = async (fragmentId, setDeleteFragmentId) => {
  console.log("Deleting fragment with id: ", fragmentId);
  try {
    const user = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: "DELETE",
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    setDeleteFragmentId(fragmentId);
    console.log("Deleted fragment", { data });
  } catch (err) {
    console.error("Unable to call DELETE /v1/fragment", { err });
  }
};

export default function DeleteFragmentButton({ fragmentId, setDeleteFragmentId }) {
  return (
    <button
      className="my-2 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 w-20 h-8"
      onClick={() => deleteFragment(fragmentId, setDeleteFragmentId)}
    >
      Delete
    </button>
  );
}
