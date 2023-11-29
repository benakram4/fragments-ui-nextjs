"use client";

import { Amplify, Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getUserFragments } from "../../utilities/api";

import { useState } from "react";

// import components
import LoginButton from "@/components/LogInButton";
import LogoutButton from "@/components/LogoutButton";
import UserForm from "@/components/UserForm";
import FragmentsAccordion from "@/components/FragmentsAccordion";

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
  let isAuth = false;
  Auth.currentAuthenticatedUser()
    .then((user) => {
      // console.log(user); // for debugging purposes
      isAuth = true;
    })
    .catch((err) => {
      //console.log(err);
      isAuth = false;
    });
  return isAuth;
}

export default function Home() {
  const [isLoggingClicked, setIsLoggingClicked] = useState(false);
  const [fragUploadedCounter, setFragUploadedCounter] = useState(0);

  const handleLoginClick = () => {
    // set the state
    setIsLoggingClicked(true);
  };

  const handleLogoutClick = (AmplifySignOut) => {
    // sign out the user
    Auth.signOut().then(() => {
      //console.log("user signed out");
    });
    //.catch((err) => console.log(err));

    // clear the local storage
    localStorage.clear();

    // set the state
    setIsLoggingClicked(false);
  };

  return (
    <>
      {userIsAuth() || isLoggingClicked ? (
        <Authenticator signUpAttributes={["email", "name"]}>
          {({ user }) => {
            // call the API to get the latest fragments (if user is logged in)
            getUserFragments();
            return (
              <main>
                <section className="text-center">
                  <h1 className="text-4xl font-medium leading-tight">
                    Hello{" "}
                    <span className="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">
                      {user.username}
                    </span>
                  </h1>
                  <section>
                    <LogoutButton handleLogoutClick={handleLogoutClick} />
                    <UserForm
                      fragUploadedCounter={fragUploadedCounter}
                      setFragUploadedCounter={setFragUploadedCounter}
                    />
                    <FragmentsAccordion
                      fragUploadedCounter={fragUploadedCounter}
                    />
                  </section>
                </section>
              </main>
            );
          }}
        </Authenticator>
      ) : (
        <section className="text-center">
          <h1 className="text-4xl font-medium leading-tight">Fragments UI</h1>
          <LoginButton handleLoginClick={handleLoginClick} />
        </section>
      )}
    </>
  );
}
