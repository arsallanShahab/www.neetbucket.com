import { SignIn } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center px-5 py-28">
      <SignIn
        routing="hash"
        appearance={{
          layout: {
            socialButtonsVariant: "blockButton",
            animations: true,
            socialButtonsPlacement: "top",
          },
          // baseTheme:dark
        }}
      />
    </div>
  );
}
