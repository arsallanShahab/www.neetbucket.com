import { HardCopyOrder } from "@/app/api/order/hardcopy/route";
import { SoftCopyOrder } from "@/app/api/order/softcopy/route";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Input, Textarea } from "@nextui-org/react";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface ISoftCopy extends SoftCopyOrder {
  _id: string;
  notes: {
    demo_pdf_id: string;
    chapter_name: string;
    teacher_name: string;
    subject_name: string;
    keyPoints: string[];
    class: string;
    price: number;
    quantity: number;
    thumbnail: string;
    full_pdf: {
      url: string;
      fileSize: number;
    };
  }[];
  amount: number;
}

export interface IHardCopy extends HardCopyOrder {
  _id: string;
}

export default function Index() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setUserDetails({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0].emailAddress || "",
        phone: (user.publicMetadata?.phone as string) || "",
        address: (user.publicMetadata?.address as string) || "",
        bio: (user.publicMetadata?.bio as string) || "",
      });
    }
  }, [user]);

  const updateUserData = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    // await clerkClient.phoneNumbers.updatePhoneNumber("9432813068");
    const t = toast.loading("Updating user data...");
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      toast.success("User data updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(t);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-white dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 pt-5">
          <div className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/user/profile"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 transition-all",
                "text-gray-900 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
              )}
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/user/orders"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              )}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex flex-col items-start justify-start gap-2 rounded-lg *:w-full">
            <h2 className="pb-3 font-rubik text-4xl font-semibold">Profile</h2>
            <div className="rounded-lg border p-4 shadow-sm">
              <form className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="name">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    labelPlacement="outside"
                    value={userDetails.firstName}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, firstName: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                    startContent={
                      <UserIcon className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="name">
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    labelPlacement="outside"
                    value={userDetails.lastName}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, lastName: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                    startContent={
                      <UserIcon className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    labelPlacement="outside"
                    value={userDetails.email}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, email: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                    startContent={
                      //add email icon
                      <MailIcon className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
                    }
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="phone">
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone"
                    labelPlacement="outside"
                    value={userDetails.phone}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, phone: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                    startContent={
                      // Add the PhoneIcon component here
                      <PhoneIcon className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="address">
                    Address
                  </Label>
                  <Textarea
                    placeholder="Enter your address"
                    labelPlacement="outside"
                    minRows={2}
                    value={userDetails.address}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, address: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="bio">
                    Bio
                  </Label>
                  <Textarea
                    placeholder="Enter your bio"
                    labelPlacement="outside"
                    minRows={2}
                    value={userDetails.bio}
                    height={100}
                    onValueChange={(value) =>
                      setUserDetails({ ...userDetails, bio: value })
                    }
                    classNames={{
                      input: "font-medium",
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                    }}
                  />
                </div>
                <Button
                  onClick={updateUserData}
                  className="col-span-2"
                  type="submit"
                >
                  Update
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
