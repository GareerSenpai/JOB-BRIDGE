import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-4 flex gap-10 items-center">
        <Link to="/" className="mr-auto">
          <img src="public/logo.png" alt="logo" className="h-20" />
        </Link>

        <SignedOut>
          <Button variant="outline" onClick={() => setShowSignIn(true)}>
            Login
          </Button>
        </SignedOut>

        <SignedIn>
          {user?.unsafeMetadata?.role === "recruiter" && (
            <Link to="/post-job">
              <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2" />
                Post Jobs
              </Button>
            </Link>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Post Jobs"
                labelIcon={<BriefcaseBusiness size={15} />}
                href="/post-job"
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Saved Jobs"
                labelIcon={<Heart size={15} />}
                href="/saved-jobs"
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        {showSignIn && (
          <div
            onClick={(e) => handleOverlayClick(e)}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          >
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              forceRedirectUrl="/onboarding"
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
