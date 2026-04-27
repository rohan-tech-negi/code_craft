import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to CodeCraft</h1>

      {userId ? (
        // User is logged in — show Sign Out button
        <div>
          <p>You are logged in!</p>
          <SignOutButton>
            <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      ) : (
        // User is NOT logged in — show Sign In and Sign Up buttons
        <div style={{ display: "flex", gap: "1rem" }}>
          <SignInButton>
            <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
              Sign In
            </button>
          </SignInButton>

          <SignUpButton>
            <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
              Sign Up
            </button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
}
