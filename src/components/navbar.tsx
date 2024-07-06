"use client";

import { SoftCopyChapter } from "@/lib/types";
import { cn, convertToHttpsLink, excerpt } from "@/lib/utils";
import { removeItem, toggleCart } from "@/redux/slices/cart";
import { AppDispatch, RootState } from "@/redux/store";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { useClickAway, useWindowSize } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, ShoppingCart, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlexContainer from "./FlexContainer";
import { useGlobalContext } from "./context-provider";
import Logo from "./icons/logo";
import { Button as ShadcnButton } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
  // const { cartOpen, setCartOpen } = useGlobalContext();
  const {
    softcopy_items: items,
    isCartOpen,
    total_amount_softcopy: total_amount,
  } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const ref = useClickAway(() => {
    dispatch(toggleCart());
  });

  const handleMenuOpen = () => {
    dispatch(toggleCart());
  };

  useEffect(() => {
    if (width && width > 640) {
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  }, [width]);

  useEffect(() => {
    if (navRef.current) {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navRef.current.offsetHeight}px`,
      );
    }
  }, [navRef]);

  return (
    <div
      ref={navRef}
      className={cn(
        "sticky top-0 z-[500] mx-auto flex w-full max-w-screen-2xl flex-row flex-wrap items-center justify-between gap-5 border-b bg-white px-5 py-5 md:px-10",
        // pathname == "/login" && " hidden"
      )}
    >
      <div className="flex flex-1 flex-row flex-wrap items-center justify-start gap-5 md:gap-10">
        <Link href={"/"}>
          <Logo height="25px" />
        </Link>
        {/* <ShadcnButton
          onClick={handleMenuOpen}
          variant="secondary"
          className="ml-auto text-xs sm:hidden"
        >
          Menu
        </ShadcnButton> */}
        {menuOpen && (
          <nav
            ref={navRef}
            className="custom-transition-nav responsive-nav flex w-full flex-shrink-0 flex-col justify-start sm:flex sm:w-auto sm:flex-row"
          >
            {[
              { name: "Home", path: "/" },
              { name: "Subjects", path: "/subjects" },
              { name: "Hard Copy", path: "/hardcopy" },
              // { name: "About Us", path: "/about-us" },
              { name: "Contact Us", path: "/contact-us" },
            ].map((item, index) => {
              return (
                <Link
                  href={item.path}
                  key={index}
                  className="custom-transition-nav-links rounded-lg px-3 py-2 font-rubik text-sm font-medium capitalize text-black transition-colors duration-200 hover:bg-zinc-100 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
      <div className="flex w-auto flex-row items-center justify-end gap-y-5 sm:gap-5">
        {menuOpen && (
          <Input
            type="text"
            placeholder="Search..."
            labelPlacement="outside"
            classNames={{
              input: "font-medium",
              inputWrapper:
                "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
            }}
            startContent={
              <Search className="pointer-events-none h-5 w-5 flex-shrink-0 text-default-400" />
            }
          />
        )}
        <div className="flex w-full flex-row items-center justify-end gap-5">
          {" "}
          <div className="flex items-center justify-between gap-2.5 sm:gap-5">
            <ShadcnButton
              variant="outline"
              onClick={() => dispatch(toggleCart())}
              className="relative h-auto px-2"
            >
              <span className="absolute -right-2.5 -top-2.5 rounded-full bg-danger px-2 py-1 text-xs font-medium text-white shadow-xl shadow-rose-400">
                {items?.length ? items?.length : 0}
              </span>
              <ShoppingCart className="h-4 w-4" />
            </ShadcnButton>
          </div>
          <Divider orientation="vertical" className="hidden h-6 sm:block" />
          {isSignedIn && isLoaded ? (
            <Dropdown>
              <DropdownTrigger className="cursor-pointer">
                <User
                  name={user?.firstName + " " + user?.lastName}
                  description={
                    user?.primaryEmailAddress?.emailAddress?.length ?? 0 > 20
                      ? user?.primaryEmailAddress?.emailAddress?.slice(0, 20) +
                        "..."
                      : user?.primaryEmailAddress?.emailAddress
                  }
                  avatarProps={{
                    src: user.imageUrl,
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem onClick={() => router.push("/user/profile")}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => router.push("/user/orders")}>
                  Orders
                </DropdownItem>
                <DropdownItem key="" href="/settings">
                  Settings
                </DropdownItem>
                <DropdownItem
                  onPress={async () => await signOut()}
                  className="text-danger"
                  color="danger"
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link href={"/sign-in"}>
              <ShadcnButton variant="default">
                {isLoaded ? (
                  "Sign In"
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                )}
              </ShadcnButton>
            </Link>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            ref={ref as RefObject<HTMLDivElement>}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0.4,
            }}
            initial={{
              scale: 0.75,
              opacity: 0.75,
              // transformOrigin: "top-right",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              // transformOrigin: "top-right",
              // transition: {
              //   duration: 0.2,
              // },
            }}
            exit={{
              scale: 0.65,
              opacity: 0,
              // transformOrigin: "top-right",
              // transition: {
              //   duration: 0.15,
              // },
            }}
            // layout="position"
            className="fixed right-5 top-24 z-[900] w-full max-w-[22rem] origin-top-right overflow-hidden rounded-2xl border bg-white p-0 shadow-xl *:w-full sm:right-28 sm:top-24 sm:origin-top"
          >
            <FlexContainer
              variant="column-start"
              wrap="nowrap"
              className="custom_scrollbar h-full max-h-96 gap-0 overflow-y-auto"
            >
              {items?.map((item) => <CartItem key={item.sys.id} {...item} />)}
              {items?.length === 0 && (
                <FlexContainer
                  variant="column-center"
                  className="h-40 text-center"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-500" />
                  <FlexContainer variant="column-center" className="gap-1">
                    <h1 className="text-xs font-medium">Your cart is empty</h1>
                    <p className="text-xs text-gray-500">
                      Add items to your cart to continue
                    </p>
                  </FlexContainer>
                </FlexContainer>
              )}
            </FlexContainer>
            {items?.length > 0 && (
              <button
                onClick={() => {
                  dispatch(toggleCart());
                  router.push("/checkout");
                }}
                className="rounded-xl border border-indigo-400 bg-gradient-to-b from-indigo-200 to-indigo-500 py-2.5 text-sm font-medium text-white backdrop-blur-sm duration-200 hover:from-indigo-300 hover:to-indigo-600 active:scale-95"
              >
                Proceed to Checkout (₹{total_amount})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CartItem: FC<SoftCopyChapter> = (props) => {
  // const {} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const imageUrl = convertToHttpsLink(
    props?.fields?.chapterThumbnail?.fields?.file?.url,
  );

  const handleRemoveFromCart = () => {
    dispatch(removeItem(props.sys.id));
  };
  return (
    <FlexContainer
      variant="row-between"
      className="w-full border-b p-3 duration-100 last:border-b-0 hover:bg-zinc-50"
    >
      <Image
        alt={props?.fields?.chapterThumbnail?.fields?.title}
        src={imageUrl}
        width={200}
        height={200}
        className="h-[72px] w-16 rounded-xl border object-cover shadow-small"
      />
      <FlexContainer variant="row-between" className="flex-grow gap-0">
        <FlexContainer variant="column-start" className="gap-1">
          <h1 className="max-w-[185px] font-sora text-xs font-medium">
            {excerpt(props?.fields?.chapterName, 40)}
          </h1>
          <p className="text-xs text-gray-500">
            {props?.fields?.subject?.fields?.subjectName}
          </p>
          <h1 className="font-sora text-sm font-semibold">
            <span className="mr-2 text-xs font-normal text-gray-500">x 1</span>{" "}
            ₹{props?.fields?.price}
          </h1>
        </FlexContainer>
        <FlexContainer variant="column-start" className="gap-0">
          <Trash
            onClick={handleRemoveFromCart}
            className="h-9 w-9 rounded-xl bg-red-50 stroke-red-500 p-2.5 text-red-500 hover:bg-red-100"
          />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
export default Navbar;
