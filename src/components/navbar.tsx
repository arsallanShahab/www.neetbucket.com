"use client";

import { cn } from "@/lib/utils";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "./context-provider";
import Logo from "./icons/logo";
import { Button as ShadcnButton } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useGlobalContext();
  const [loginType, setLoginType] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");

  const navRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const { width } = useWindowSize();

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
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
        `${navRef.current.offsetHeight}px`
      );
    }
  }, [navRef]);

  return (
    <>
      <div
        ref={navRef}
        className={cn(
          "relative flex flex-row justify-between items-center flex-wrap top-0 z-[500] mx-auto w-full max-w-screen-2xl gap-5 border-b bg-white px-5 py-5 md:px-10"
          // pathname == "/login" && " hidden"
        )}
      >
        <div className="flex flex-row justify-start items-center flex-1 flex-wrap gap-5 md:gap-10">
          <Link href={"/"}>
            <Logo height="25px" />
          </Link>
          <ShadcnButton
            onClick={handleMenuOpen}
            variant="secondary"
            className="ml-auto text-xs sm:hidden"
          >
            Menu
          </ShadcnButton>
          {menuOpen && (
            <nav
              ref={navRef}
              className="custom-transition-nav responsive-nav flex w-full flex-shrink-0 flex-col justify-start sm:flex sm:w-auto sm:flex-row"
            >
              {[
                { name: "Home", path: "/" },
                { name: "Soft Copy", path: "/soft-copy" },
                { name: "Hard Copy", path: "/hard-copy" },
                // { name: "About Us", path: "/about-us" },
                { name: "Contact Us", path: "/contact-us" },
              ].map((item, index) => {
                return (
                  <Link
                    href={item.path}
                    key={index}
                    className="custom-transition-nav-links text-sm font-medium font-rubik text-black px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors duration-200 hover:text-gray-900 capitalize"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        <div className="flex w-full flex-col items-center justify-end gap-y-5 sm:gap-5 md:w-auto md:flex-row">
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
                <Search className="h-5 w-5 text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          )}
          <div className="flex flex-row gap-2.5 sm:gap-5 items-center justify-between w-full">
            {" "}
            <div className="flex gap-2.5 sm:gap-5 items-center">
              <ShadcnButton
                onClick={() => {
                  onOpen();
                  setLoginType("login");
                }}
                variant="secondary"
              >
                Login
              </ShadcnButton>
              <ShadcnButton
                variant="default"
                onClick={() => {
                  onOpen();
                  setLoginType("signup");
                }}
              >
                Sign Up
              </ShadcnButton>
            </div>
            <Divider orientation="vertical" className="h-6 hidden sm:block" />
            <ShadcnButton variant="outline">
              <ShoppingCart className="w-4 h-4" />
            </ShadcnButton>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        isDismissable
        backdrop="blur"
        classNames={{
          backdrop: "z-[800]",
          wrapper: "z-[900]",
          base: "bottom-20",
        }}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center gap-1">
                <div className="flex flex-col flex-1">
                  {loginType == "login" ? "Login" : "Sign Up"}
                  <span className="text-xs text-gray-500">
                    {loginType == "login"
                      ? "Login to your account"
                      : "Create a new account"}
                  </span>
                </div>
                <div className="flex flex-row gap-5 pr-3">
                  <ShadcnButton
                    variant="ghost"
                    className="ring-2 ring-transparent hover:ring-zinc-200 duration-300 transition-all"
                    color="default"
                    onClick={() => {
                      if (loginType == "login") {
                        setLoginType("signup");
                      } else {
                        setLoginType("login");
                      }
                    }}
                  >
                    {loginType == "login" ? "Sign Up" : "Login"}{" "}
                    <span className="text-blue-500">?</span>
                  </ShadcnButton>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    labelPlacement="outside"
                    value={email}
                    onValueChange={setEmail}
                    classNames={{
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-300",
                    }}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    labelPlacement="outside"
                    value={password}
                    onValueChange={setPassword}
                    classNames={{
                      inputWrapper:
                        "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-300",
                    }}
                  />
                  {loginType == "signup" && (
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      labelPlacement="outside"
                      value={confirmPassword}
                      onValueChange={setConfirmPassword}
                      classNames={{
                        inputWrapper:
                          "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-300",
                      }}
                    />
                  )}
                  {loginType == "signup" && (
                    <Input
                      label="Mobile Number"
                      type="tel"
                      placeholder="Enter your mobile number"
                      labelPlacement="outside"
                      value={mobileNumber}
                      onValueChange={setMobileNumber}
                      classNames={{
                        inputWrapper:
                          "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-300",
                      }}
                    />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <ShadcnButton variant="ghost" onClick={onClose}>
                  Close
                </ShadcnButton>
                <ShadcnButton onClick={onClose}>
                  {loginType == "login" ? "Login" : "Sign Up"}
                </ShadcnButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
