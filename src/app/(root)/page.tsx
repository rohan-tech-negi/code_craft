import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Header from "./_components/Header";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div>
      <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
    </div>
  );
}
