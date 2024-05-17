import { Button as ShadcnButton } from "@/components/ui/button";
import { BookText, FileIcon } from "lucide-react";
import Link from "next/link";

// min-h-[calc(100vh_-_var(--nav-height))]

export default function Home() {
  return (
    <>
      <main className="relative grid h-[90vh] max-h-[550px] place-items-center items-center">
        <div className="flex h-full flex-col items-center justify-center gap-2.5 px-7 py-10 text-center *:w-full sm:px-10">
          <h1 className="max-w-full text-center font-sora text-4xl font-[700] leading-tight text-blue-500 md:max-w-4xl md:text-7xl">
            <span className="text-slate-950 sm:block md:inline-block">
              Neet Bucket -{" "}
            </span>
            A+ Grade Study Material for your NEET Preparation
          </h1>
          <div className="relative mt-5 flex flex-row flex-wrap items-center justify-center gap-5">
            <div className="absolute -bottom-5 left-0 right-0 -z-10 mx-auto hidden h-full w-1/2 rounded-3xl  bg-gradient-to-r from-zinc-400 to-zinc-400 blur-lg sm:block" />
            <Link href={"/subjects"}>
              <ShadcnButton
                variant="default"
                className="rounded-xl bg-zinc-800 px-5 py-6 font-rubik hover:bg-zinc-700"
              >
                <FileIcon className="mr-2 h-4 w-4 stroke-[3px]" />
                Class Notes (PDF&apos;s)
              </ShadcnButton>
            </Link>
            <Link href={"/hardcopy"}>
              <ShadcnButton
                variant="default"
                className="rounded-xl px-5 py-6 font-rubik"
              >
                <BookText className="mr-2 h-4 w-4 stroke-[3px]" />
                Hard Copy Books (Printed)
              </ShadcnButton>
            </Link>
          </div>
        </div>
      </main>
      <div className="mx-auto flex max-w-screen-2xl flex-col items-start justify-start *:w-full ">
        <div className="mx-auto max-w-screen-xl px-10 pb-32 pt-10">
          <h3 className="text-center font-rubik text-5xl font-[700] text-slate-950">
            Why Neet Bucket?
          </h3>
          <div className="mt-16 flex flex-row flex-wrap items-center justify-center gap-10 *:flex-1">
            <div className="flex flex-col items-center justify-start gap-4 sm:items-start">
              <h3 className="rounded-3xl bg-indigo-50 px-6 py-3 font-sora text-xl font-[600] text-indigo-500">
                Quality Content
              </h3>
              <p className="text-md max-w-md text-center font-medium text-slate-600 sm:pl-3 sm:text-left">
                We provide the best quality study material for NEET Preparation
                which is prepared by our expert faculty.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-4 sm:items-start">
              <h3 className="rounded-3xl bg-green-50 px-6 py-3 font-sora text-xl font-[600] text-green-500">
                Easy to Understand
              </h3>
              <p className="text-md max-w-md text-center font-medium text-slate-600 sm:pl-3 sm:text-left">
                Our study material is designed in such a way that it is easy to
                understand and grasp the concepts.
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-4 sm:items-start">
              <h3 className="rounded-3xl bg-red-50 px-6 py-3 font-sora text-xl font-[600] text-red-500">
                Affordable
              </h3>
              <p className="text-md max-w-md text-center font-medium text-slate-600 sm:pl-3 sm:text-left">
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
