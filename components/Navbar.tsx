"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex justify-between p-4">
      <h1>LiveMeet</h1>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-black text-white rounded">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  );
}