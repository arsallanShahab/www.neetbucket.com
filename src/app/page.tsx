"use client";

import { useGlobalContext } from "@/components/context-provider";
import { Button as ShadcnButton } from "@/components/ui/button";
import { BookText, FileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

// min-h-[calc(100vh_-_var(--nav-height))]

export default function Home() {
  const { onOpen, user } = useGlobalContext();

  useEffect(() => {
    if (!user) onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <main className="relative h-[90vh] max-h-[550px] grid items-center place-items-center">
        <div className="flex flex-col items-center text-center justify-center h-full *:w-full gap-2.5 px-7 sm:px-10 py-10">
          <h1 className="max-w-full text-center font-sora text-4xl font-[700] leading-tight text-blue-500 md:max-w-4xl md:text-7xl">
            <span className="sm:block text-slate-950 md:inline-block">
              Neet Bucket -{" "}
            </span>
            A+ Grade Study Material for your NEET Preparation
          </h1>
          <div className="relative flex flex-row flex-wrap gap-5 mt-5 items-center justify-center">
            <div className="absolute hidden sm:block -bottom-5 -z-10 blur-lg left-0 right-0 mx-auto w-1/2  h-full bg-gradient-to-r from-zinc-400 to-zinc-400 rounded-3xl" />
            <ShadcnButton
              variant="default"
              className="bg-zinc-800 hover:bg-zinc-700 py-6 px-5 rounded-xl font-rubik"
            >
              <FileIcon className="w-4 h-4 mr-2 stroke-[3px]" />
              Class Notes (PDF&apos;s)
            </ShadcnButton>
            <ShadcnButton
              variant="default"
              className="py-6 px-5 rounded-xl font-rubik"
            >
              <BookText className="w-4 h-4 mr-2 stroke-[3px]" />
              Hard Copy Books (Printed)
            </ShadcnButton>
          </div>
        </div>
      </main>
      <div className="max-w-screen-2xl mx-auto flex flex-col *:w-full justify-start items-start ">
        <div className="px-10 pt-10 pb-32 max-w-screen-xl mx-auto">
          <h3 className="text-5xl font-rubik font-[700] text-center text-slate-950">
            Why Neet Bucket?
          </h3>
          <div className="flex flex-row gap-10 mt-16 items-center justify-center *:flex-1 flex-wrap">
            <div className="flex flex-col justify-start items-center sm:items-start gap-4">
              <h3 className="text-xl font-sora font-[600] text-indigo-500 py-3 px-6 rounded-3xl bg-indigo-50">
                Quality Content
              </h3>
              <p className="text-md text-center sm:text-left font-medium text-slate-600 sm:pl-3 max-w-md">
                We provide the best quality study material for NEET Preparation
                which is prepared by our expert faculty.
              </p>
            </div>
            <div className="flex flex-col justify-start items-center sm:items-start gap-4">
              <h3 className="text-xl font-sora font-[600] text-green-500 py-3 px-6 rounded-3xl bg-green-50">
                Easy to Understand
              </h3>
              <p className="text-md text-center sm:text-left font-medium text-slate-600 sm:pl-3 max-w-md">
                Our study material is designed in such a way that it is easy to
                understand and grasp the concepts.
              </p>
            </div>
            <div className="flex flex-col justify-start items-center sm:items-start gap-4">
              <h3 className="text-xl font-sora font-[600] text-red-500 py-3 px-6 rounded-3xl bg-red-50">
                Affordable
              </h3>
              <p className="text-md text-center sm:text-left font-medium text-slate-600 sm:pl-3 max-w-md">
                Our study material is affordable and is available at a very
                reasonable price. We also provide discounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
