import { HardCopyOrder } from "@/app/api/order/hardcopy/route";
import { SoftCopyOrder } from "@/app/api/order/softcopy/route";
import FlexContainer from "@/components/FlexContainer";
import { Button } from "@/components/ui/button";
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
import { cn, excerpt } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { MailIcon, MoreHorizontalIcon, PhoneIcon } from "lucide-react";
import { Document } from "mongodb";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
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

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<
    ISoftCopy | IHardCopy | null
  >(null);

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
      hardcopy_orders: IHardCopy[];
    };
  }>({
    showToast: true,
  });

  useEffect(() => {
    getData("/api/user/orders", "orders", {
      loading: "Loading orders...",
      success: "Orders loaded",
      failure: "Failed to load orders",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  console.log(selectedOrder, "selectedOrder");

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-white lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 pt-5">
          <div className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/user/profile"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              )}
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/user/orders"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 transition-all ",
                "text-gray-900 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50",
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedOrder(order);
                                  }}
                                >
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
                        <TableHead className="">Hardcopy Book</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Shipping Details
                        </TableHead>
                        {/* <TableHead className="hidden md:table-cell">
                            Contact Number
                          </TableHead> */}

                        <TableHead className="">Delivery Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Delivery Date (Expected)
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
                          <TableCell className="max-w-[200px]">
                            {order?.items
                              ?.map((item) => item?.title)
                              .join(", ")}
                          </TableCell>
                          <TableCell className="hidden max-w-[175px] md:table-cell">
                            <div>
                              <p className="text-sm font-semibold">
                                {order?.shipping_details?.address}
                              </p>
                              <p className="text-sm font-semibold">
                                {order?.shipping_details?.city},{" "}
                                {order?.shipping_details?.state}
                                {/* {order?.shipping_details?.pincode} */}
                                {order?.user_phone}
                              </p>
                            </div>
                          </TableCell>
                          {/* <TableCell className="hidden md:table-cell">
                              {order?.user_phone}
                            </TableCell> */}
                          <TableCell>{order?.delivery?.status}</TableCell>
                          <TableCell className="hidden text-nowrap md:table-cell">
                            {order?.delivery?.date
                              ? dayjs(order?.delivery?.date).format(
                                  "DD MMM YYYY",
                                )
                              : "Not available"}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{order?.total_amount}
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedOrder(order);
                                  }}
                                >
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
        </main>
      </div>
    </div>
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
