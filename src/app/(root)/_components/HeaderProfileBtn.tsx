"use client";

import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
  const { isSignedIn } = useAuth();

  return (
    <>
      {isSignedIn ? (
        // User is logged in — show avatar/profile menu
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Profile"
              labelIcon={<User className="size-4" />}
              href="/profile"
            />
          </UserButton.MenuItems>
        </UserButton>
      ) : (
        // User is NOT logged in — show Sign In button
        <SignInButton>
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors">
            Sign In
          </button>
        </SignInButton>
      )}
    </>
  );
}

export default HeaderProfileBtn;