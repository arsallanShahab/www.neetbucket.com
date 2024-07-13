import Link from "next/link";
import React from "react";
import Logo from "./icons/logo";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-screen-2xl flex-row items-center justify-between gap-5 px-5 py-7 md:px-10">
        <div className="flex flex-1 flex-row flex-wrap items-center justify-start gap-5 md:gap-10">
          <div className="flex flex-row items-center justify-start gap-5">
            <Link href="/" className="">
              <Logo className="h-4 w-4" />
            </Link>
            <p className="font-rubik text-sm text-black">
              © 2021 Neet Bucket. All rights reserved
            </p>
          </div>
          <div className="flex flex-row items-center justify-start gap-5">
            <Link href="/" className="font-rubik text-sm text-black">
              Privacy Policy
            </Link>
            <Link href="/" className="font-rubik text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-5">
          <Link href="/" className="font-rubik text-sm">
            Facebook
          </Link>
          <Link href="/" className="font-rubik text-sm">
            Instagram
          </Link>
          <Link href="/" className="font-rubik text-sm">
            Twitter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
