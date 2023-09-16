// utilities/auth.js

import { Auth } from 'aws-amplify';

export async function getAuthHeaders() {
  const session = await Auth.currentSession();
  const idToken = session.getIdToken().getJwtToken();
  const accessToken = session.getAccessToken().getJwtToken();
  const username = session.getIdToken().payload['cognito:username'];

  return {
    username,
    idToken,
    accessToken,
    // Include a simple method to generate headers with our Authorization info
    authorizationHeaders: (type = 'application/json') => {
      const headers = { 'Content-Type': type };
      headers['Authorization'] = `Bearer ${idToken}`;
      return headers;
    },
  };
}
