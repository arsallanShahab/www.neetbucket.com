import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center px-5 py-28">
      <SignIn />
    </div>
  );
}
