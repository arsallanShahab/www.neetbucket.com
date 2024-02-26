import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="w-full bg-zinc-900 bg-fixed">
      <div className="max-w-screen-2xl mx-auto flex flex-row justify-between items-center gap-5 px-5 py-7 md:px-10">
        <div className="flex flex-row justify-start items-center flex-1 flex-wrap gap-5 md:gap-10">
          <div className="flex flex-row justify-start items-center gap-5">
            <a href="/" className="text-white font-rubik text-lg font-[700]">
              Neet Bucket
            </a>
            <p className="text-white text-sm font-rubik">
              © 2021 Neet Bucket. All rights reserved
            </p>
          </div>
          <div className="flex flex-row justify-start items-center gap-5">
            <a href="/" className="text-white text-sm font-rubik">
              Privacy Policy
            </a>
            <a href="/" className="text-white text-sm font-rubik">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-5">
          <a href="/" className="text-white text-sm font-rubik">
            Facebook
          </a>
          <a href="/" className="text-white text-sm font-rubik">
            Instagram
          </a>
          <a href="/" className="text-white text-sm font-rubik">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
