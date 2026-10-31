import { Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "./services/interview.api";
import { InterviewProvider } from "./interview.context.jsx";

const InterviewLayout = () => {
  const { getToken } = useAuth();
  setAuthTokenGetter(getToken);

  return (
    <>
      <SignedIn>
        <InterviewProvider>
          <div className="interview-root">
            <Outlet />
          </div>
        </InterviewProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default InterviewLayout;