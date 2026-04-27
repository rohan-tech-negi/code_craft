import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div>
      <p>hi</p>
    </div>
  );
}
