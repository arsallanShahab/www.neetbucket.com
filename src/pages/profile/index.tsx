import { SoftCopyOrder } from "@/app/api/order/softcopy/route";
import FlexContainer from "@/components/FlexContainer";
import NextButton from "@/components/NextButton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGet from "@/lib/hooks/get-api";
import { cn, excerpt, handleDownload } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Input, Textarea } from "@nextui-org/react";
import dayjs from "dayjs";
import { MailIcon, MoreHorizontalIcon, PhoneIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function Index() {
  const { isLoaded, isSignedIn, user } = useUser();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses"
  >();

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

  const createQueryString = (
    paramsToUpdate: Record<string, string>,
    paramToRemove?: string,
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(paramsToUpdate).forEach(([name, value]) => {
      params.set(name, value);
    });
    if (paramToRemove) {
      params.delete(paramToRemove);
    }
    return params.toString();
  };

  const {
    loading: loading_orders,
    error: error_orders,
    data: orders,
    getData,
    invalidateCache,
  } = useGet<{
    success: boolean;
    orders: {
      softcopy_orders: ISoftCopy[];
      hardcopy_orders: {
        _id: string;
        amount: number;
        currency: string;
        notes: {
          fields: {
            chapterThumbnail: {
              fields: {
                file: {
                  url: string;
                };
              };
            };
            demoImages: {
              fields: {
                file: {
                  url: string;
                };
              };
            }[];
            heading: string;
            price: number;
          };
        };
        shipping_address: {
          address: string;
          city: string;
          state: string;
          pincode: string;
          phone: string;
        };
        shipping_status: string;
        order_id: string;
        receipt: string;
        user_id: string;
        user_email: string;
        total_quantity: number;
        payment_status: string;
        order_type: string;
        created_at: string;
      }[];
    };
  }>({
    showToast: true,
  });

  useEffect(() => {
    if (searchParams && searchParams.has("tab")) {
      setActiveTab(
        searchParams.get("tab") as "profile" | "orders" | "addresses",
      );
    } else {
      setActiveTab("profile");
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "orders") {
      getData("/api/user/orders", "orders", {
        loading: "Loading orders...",
        success: "Orders loaded",
        failure: "Failed to load orders",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 pt-5">
          <div className="grid items-start px-4 text-sm font-medium">
            <p
              onClick={() => {
                setActiveTab("profile");
                router.push(
                  pathname + "?" + createQueryString({ tab: "profile" }),
                );
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ",
                activeTab === "profile" &&
                  "text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
              )}
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </p>
            <p
              onClick={() => {
                setActiveTab("orders");
                router.push(
                  pathname + "?" + createQueryString({ tab: "orders" }),
                );
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                activeTab === "orders" &&
                  "text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
              )}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Orders
            </p>
            <p
              onClick={() => {
                setActiveTab("addresses");
                router.push(
                  pathname + "?" + createQueryString({ tab: "addresses" }),
                );
              }}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                activeTab === "addresses" &&
                  "text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
              )}
            >
              <MapPinIcon className="h-4 w-4" />
              Addresses
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {activeTab === "profile" && (
            <div className="flex flex-col items-start justify-start gap-2 rounded-lg *:w-full">
              <h2 className="pb-3 font-rubik text-4xl font-semibold">
                Profile
              </h2>
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
                    <Input
                      type="text"
                      placeholder="Enter your address"
                      labelPlacement="outside"
                      value={userDetails.address}
                      onValueChange={(value) =>
                        setUserDetails({ ...userDetails, address: value })
                      }
                      classNames={{
                        input: "font-medium",
                        inputWrapper:
                          "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
                      }}
                      startContent={
                        // Add the MapPinIcon component here
                        <MapPinIcon className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm" htmlFor="bio">
                      Bio
                    </Label>
                    <Textarea
                      placeholder="Enter your bio"
                      labelPlacement="outside"
                      value={userDetails.bio}
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
          )}
          {activeTab === "orders" && (
            <div className="flex flex-col items-start justify-start gap-2 rounded-lg *:w-full">
              <h2 className="font-rubik text-4xl font-semibold">Orders</h2>

              {loading_orders && <div>Loading orders...</div>}
              {error_orders && <div>Failed to load orders</div>}
              {orders?.orders?.softcopy_orders && (
                <>
                  <h2 className="pb-3 text-lg font-medium text-zinc-600">
                    Softcopy Orders
                  </h2>
                  {/* {orders?.orders?.softcopy_orders?.map((order) => (
                    <SoftCopyOrders key={order._id} order={order} />
                  ))} */}
                  <div className="w-full rounded-lg border p-2 shadow-sm">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden text-nowrap sm:table-cell">
                            S No.
                          </TableHead>
                          {/* <TableHead className="hidden md:table-cell">
                            Order
                          </TableHead> */}
                          <TableHead className="w-full">
                            Bought Chapters
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-x-auto">
                        {orders?.orders?.softcopy_orders?.map((order, i) => (
                          <TableRow key={order?._id}>
                            <TableCell className="hidden sm:table-cell">
                              {i + 1}
                            </TableCell>
                            {/* <TableCell className="hidden font-medium md:table-cell">
                              {order?.order_id}
                            </TableCell> */}
                            <TableCell className="w-full break-all sm:w-full">
                              {order?.notes
                                ?.map((note) => note.chapter_name)
                                .join(", ")
                                .slice(0, 100)}
                              {order?.items
                                ?.map((item) => item?.title)
                                .join(", ")
                                .slice(0, 100)}
                              ...
                            </TableCell>
                            <TableCell className="hidden text-nowrap sm:table-cell">
                              {dayjs(order?.created_at).format("DD MMM YYYY")}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹
                              {order?.total_amount
                                ? order?.total_amount
                                : order?.amount}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order?.payment_status}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Customer details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {orders?.orders?.hardcopy_orders && (
                <>
                  <h2 className="py-3 text-lg font-medium text-zinc-600">
                    Hardcopy Orders
                  </h2>
                  <div className="w-full overflow-x-auto rounded-lg border p-2 shadow-sm">
                    <Table className="">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden text-nowrap md:table-cell">
                            S No.
                          </TableHead>
                          {/* <TableHead className="hidden md:table-cell">
                            Order
                          </TableHead> */}
                          <TableHead className="">Bought</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Shipping Address
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Contact Number
                          </TableHead>

                          <TableHead className="">Delivery Status</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Order Date
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.orders?.hardcopy_orders?.map((order, i) => (
                          <TableRow key={order?._id}>
                            <TableCell className="hidden md:table-cell">
                              {i + 1}
                            </TableCell>
                            {/* <TableCell className="hidden font-medium md:table-cell">
                              {order?.order_id}
                            </TableCell> */}
                            <TableCell>
                              {order?.notes?.fields?.heading}
                            </TableCell>
                            <TableCell className="hidden max-w-[175px] md:table-cell">
                              <div>
                                {order?.shipping_address?.address},{" "}
                                {order?.shipping_address?.city},{" "}
                                {order?.shipping_address?.state} -{" "}
                                {order?.shipping_address?.pincode}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {order?.shipping_address?.phone}
                            </TableCell>
                            <TableCell>
                              {order?.shipping_status === "delivered"
                                ? "Shipped"
                                : "Not shipped"}
                            </TableCell>
                            <TableCell className="hidden text-nowrap md:table-cell">
                              {dayjs(order?.created_at).format("DD MMM YYYY")}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{order?.amount}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order?.payment_status}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Customer details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === "addresses" && (
            <div className="rounded-lg border p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Addresses</h2>
              <div className="flex flex-col gap-2">
                <div>
                  <Label className="font-medium" htmlFor="address1">
                    Home
                  </Label>
                  <div>1234 Main St.</div>
                  <div>Anytown, CA 12345</div>
                </div>
                <div>
                  <Label className="font-medium" htmlFor="address2">
                    Work
                  </Label>
                  <div>5678 Elm St.</div>
                  <div>Anytown, CA 54321</div>
                </div>
              </div>
              <Button className="mt-4">Add new address</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const SoftCopyOrders = ({ order }: { order: ISoftCopy }) => {
  console.log(order);
  const [showChapters, setShowChapters] = useState(false);
  const ChaptersName = order?.items
    ? order?.items.map((item) => item?.title)
    : order?.notes?.map((note) => note.chapter_name);
  return (
    <FlexContainer
      variant="row-between"
      className="rounded-xl border p-1 shadow-sm"
    >
      <FlexContainer variant="column-start" gap="xs" className="p-2">
        <span className="text-xs font-semibold">Chapters</span>
        <p className="max-w-lg text-sm">
          {excerpt(ChaptersName.join(", "), 130)}
        </p>
      </FlexContainer>
      <FlexContainer variant="row-start">
        <FlexContainer variant="column-start" gap="xs" className="p-2">
          <span className="text-xs font-semibold">Date</span>
          <p className="text-sm">
            {dayjs(order?.created_at).format("DD MMM YYYY")}
          </p>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="xs" className="p-2">
          <span className="text-xs font-semibold">Total</span>
          <p className="text-sm">₹{order?.amount || order?.total_amount}</p>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="xs" className="p-2">
          <span className="text-xs font-semibold">Status</span>
          <p className="text-sm">{order?.payment_status}</p>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="xs" className="p-2">
          <span className="text-xs font-semibold">Actions</span>
          <button className="rounded-lg border bg-zinc-100 px-2 py-1 text-xs font-medium text-black">
            View order
          </button>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
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

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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
