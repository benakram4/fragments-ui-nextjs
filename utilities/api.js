// src/api.js
import { Auth } from 'aws-amplify';
// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

async function getAuthHeaders() {
  const session = await Auth.currentSession();
  const idToken = session.getIdToken().getJwtToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments() {
  console.log('Requesting user fragments data...');
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', {data});
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}