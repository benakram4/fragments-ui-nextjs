"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getUserFragments } from "../../utilities/api";

Amplify.configure({
  Auth: {
    // Amazon Region. We can hard-code this (we always use the us-east-1 region)
    region: process.env.NEXT_PUBLIC_REGION,

    // Amazon Cognito User Pool ID
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID,

    // Amazon Cognito App Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,

    oauth: {
      domain: process.env.NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN,

      scope: ["email", "phone", "openid"],

      redirectSignIn: process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL,

      responseType: "code",
    },
  },
});

// log the user info when user sign in, for debugging purpose
const logUserData = (data) => console.log('user data: ',{data})

export default function Home() {
  return (
    <Authenticator signUpAttributes={["email", "name"]}>
      {({ signOut, user }) => {
        // Call the listener function with the user data
        logUserData(user);

        // Do an authenticated API call to the fragments API server and log the result
        getUserFragments();

        return (
          <main>
            <section className="text-center">
              <h2 className="text-4xl font-medium leading-tight">
                Hello
                <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">
                  {user.username}
                </span>
              </h2>

              <section>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold 
                        py-2 px-4 my-3 rounded"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </section>
            </section>
          </main>
        );
      }}
    </Authenticator>
  );
}
