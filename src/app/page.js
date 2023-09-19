"use client";

import { Amplify, Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getUserFragments } from "../../utilities/api";

import { useState } from "react";

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

// check is user is auth for console debugging purposes
function userIsAuth() {
  Auth.currentAuthenticatedUser()
    .then((user) => {
      // console.log( user ); // for debugging purposes
      return true;
    })
    .catch((err) => {
      console.log(err); // for debugging purposes
      return false;
    });
}

export default function Home() {
  const [isLoggingClicked, setIsLoggingClicked] = useState(false);

  const handleLoginClick = () => {
    // set the state
    setIsLoggingClicked(true);
  };

  const handleLogoutClick = (AmplifySignOut) => {
    // sign out
    AmplifySignOut();
    // set the state
    setIsLoggingClicked(false);
    // reload the page
    window.location.reload();
  };

  return (
    <>
      {userIsAuth() || isLoggingClicked ? (
        <Authenticator signUpAttributes={["email", "name"]}>
          {({ signOut, user }) => {
            // Do an authenticated API call to the fragments API server and log the result
            getUserFragments();

            return (
              <main>
                <section className="text-center">
                  <h1 className="text-4xl font-medium leading-tight">
                    Hello
                    <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">
                      {user.username}
                    </span>
                  </h1>

                  <section>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold 
                          py-2 px-4 my-3 rounded"
                      onClick={() => handleLogoutClick(signOut)}
                    >
                      Sign out
                    </button>
                  </section>
                </section>
              </main>
            );
          }}
        </Authenticator>
      ) : (
        <>
          <section className="text-center">
            <h1 className="text-4xl font-medium leading-tight">Fragments UI</h1>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
                          py-2 px-4 my-3 rounded"
              onClick={handleLoginClick}
            >
              Log in
            </button>
          </section>
        </>
      )}
    </>
  );
}
