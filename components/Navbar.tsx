"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const avatarLabel =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="flex justify-between p-4">
      <h1>LiveMeet</h1>

      {isSignedIn ? (
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1.5 hover:bg-black/5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            {avatarLabel}
          </span>
          <span className="text-sm font-medium">Profile</span>
        </Link>
      ) : (
        <Link href="/sign-in" className="px-4 py-2 bg-black text-white rounded">
          Sign In
        </Link>
      )}
    </div>
  );
}
