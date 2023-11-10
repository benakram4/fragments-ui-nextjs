// utilities/api.js

import { getAuthHeaders } from "./auth";

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments() {
  console.log("Requesting user fragments data...");
  try {
    const user = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments id's", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

// get all fragments metadata for a given user id
export async function getUserFragmentsMetaData() {
  console.log("Requesting user fragments metadata...");
  try {
    const user = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments metadata", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}


