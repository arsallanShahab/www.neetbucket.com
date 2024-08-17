import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { SoftCopyChapter, Subject } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  addItem,
  buyNowSoftCopy,
  removeItem,
  toggleCart,
} from "@/redux/slices/cart";
import { AppDispatch, RootState } from "@/redux/store";
import { BreadcrumbItem, Breadcrumbs, Divider } from "@nextui-org/react";
import { useToggle } from "@uidotdev/usehooks";
import { Entry, EntryCollection } from "contentful";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  data: SoftCopyChapter;
};

const Index = (props: Props) => {
  const { softcopy_items: items, isCartOpen } = useSelector(
    (state: RootState) => state.cart,
  );
  const isInCart = items?.some((item) => item.sys.id === props.data.sys.id);
  const [pointsVisible, setPointsVisible] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  console.log(props.data, "props");

  const handleAddToCart = () => {
    if (isInCart) {
      dispatch(removeItem(props.data.sys.id));
      return;
    }
    if (!isCartOpen) dispatch(toggleCart());
    dispatch(addItem(props.data));
  };

  const handleBuyNow = () => {
    dispatch(buyNowSoftCopy(props.data));
    router.push("/checkout");
  };
  if (!props.data)
    return (
      <div>
        <h1>No data found</h1>
      </div>
    );
  return (
    <Wrapper>
      <FlexContainer variant="column-start" gap="xl">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/subjects">Subjects</BreadcrumbItem>
          <BreadcrumbItem
            href={`/subjects/${props.data.fields.subject.fields.slug}-${props.data.fields.subject.sys.id}`}
          >
            {props?.data?.fields.subject.fields.subjectName}
          </BreadcrumbItem>
          <BreadcrumbItem>{props.data.fields.chapterName}</BreadcrumbItem>
        </Breadcrumbs>
        <FlexContainer
          variant="row-center"
          className="w-full flex-wrap items-start gap-4 md:flex-nowrap"
          // wrap="wrap"
        >
          <div className="basis-full sm:basis-1/3 md:basis-1/2">
            <GridContainer className="grid-cols-2 gap-x-5 *:rounded-xl *:border lg:grid-cols-2">
              {/* <Image
                width={950}
                height={950}
                className="h-full max-h-[500px] w-full object-cover object-top hover:shadow-2xl"
                alt={props.data.fields.chapterName}
                src={
                  props.data.fields.chapterThumbnail.fields.file.url.startsWith(
                    "//",
                  )
                    ? "https:" +
                      props.data.fields.chapterThumbnail.fields.file.url
                    : props.data.fields.chapterThumbnail.fields.file.url
                }
              /> */}
              {props.data.fields.demoImages?.map((image, i) => (
                <Image
                  key={image.sys.id}
                  width={950}
                  height={950}
                  className={cn(
                    "h-full max-h-[400px] w-full object-cover object-top duration-200 hover:shadow-2xl",
                    i === props.data.fields.demoImages.length - 1 &&
                      props.data.fields.demoImages.length % 2 == 1 &&
                      "col-span-full h-full w-full object-cover",
                  )}
                  alt={props.data.fields.chapterName}
                  src={
                    image.fields.file.url.startsWith("//")
                      ? "https:" + image.fields.file.url
                      : image.fields.file.url
                  }
                />
              ))}
            </GridContainer>
          </div>
          <div className="relative basis-full pb-10 sm:sticky sm:top-56 sm:basis-2/3 md:top-28 md:basis-1/2 md:pb-0 md:pl-10">
            <FlexContainer variant="column-start">
              <Heading variant="h3">{props?.data?.fields?.chapterName}</Heading>
              {props?.data?.fields?.keyPoints?.length > 0 && (
                <FlexContainer variant="column-start" className="">
                  <Heading variant="subtitle2">Key Points</Heading>
                  <div
                    style={{
                      maxHeight: pointsVisible ? "100%" : "200px",
                    }}
                    className="relative z-10 overflow-hidden"
                  >
                    <div
                      style={{
                        display: pointsVisible ? "none" : "flex",
                      }}
                      className="absolute bottom-0 z-20 flex w-full items-center justify-center rounded-3xl bg-gradient-to-b from-transparent to-slate-50 px-4 py-6"
                    >
                      <button
                        onClick={() => setPointsVisible(true)}
                        className="text-slate-800d z-30 mt-2 rounded-3xl border bg-slate-50 px-4 py-2 text-xs font-medium duration-100 hover:bg-slate-100 active:scale-95"
                      >
                        Show All
                      </button>
                    </div>
                    <ul className="flex list-inside list-disc flex-col gap-2 pl-3">
                      {props.data?.fields?.keyPoints?.map((_, i) => {
                        return (
                          <li
                            key={i}
                            className="font-mediums text-sm leading-loose text-slate-600"
                          >
                            {_}
                          </li>
                        );
                      })}
                    </ul>
                    <div
                      className="flex-row-end"
                      style={{
                        display: pointsVisible ? "flex" : "none",
                      }}
                    >
                      <button
                        onClick={() => setPointsVisible(false)}
                        className="mt-2 rounded-3xl border bg-slate-50 px-4 py-2 text-xs font-medium text-slate-800 duration-100 hover:bg-slate-100 active:scale-95"
                      >
                        Show Less
                      </button>
                    </div>
                  </div>
                </FlexContainer>
              )}

              <FlexContainer
                variant="row-between"
                className="flex-wrap gap-3 md:flex-nowrap"
              >
                {isInCart ? (
                  <Link
                    href="/checkout"
                    className="text-md basis-full rounded-xl border bg-yellow-500 px-5 py-5 text-center font-medium text-white duration-100 hover:bg-yellow-600 active:scale-95 md:basis-1/2 md:rounded-l-xl md:border-r-0"
                  >
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="text-md basis-full rounded-xl border bg-zinc-400 px-5 py-5 text-center font-medium text-white duration-100 hover:bg-zinc-500 active:scale-95 md:basis-1/2 md:rounded-l-xl md:border-r-0"
                  >
                    Add to Cart
                  </button>
                )}
                {/* <button
                  onClick={handleAddToCart}
                  className="text-md basis-full rounded-xl border bg-zinc-400 px-5 py-5 text-center font-medium text-white duration-100 hover:bg-zinc-500 active:scale-95 md:basis-1/2 md:rounded-l-xl md:border-r-0"
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </button> */}
                <button
                  onClick={handleBuyNow}
                  className="text-md basis-full rounded-xl border border-green-50 bg-green-500 px-5 py-5 text-center font-medium text-white duration-100 hover:bg-green-400 active:scale-95 md:basis-1/2 md:rounded-r-xl md:border-l-0"
                >
                  Buy Now
                </button>
              </FlexContainer>
              <FlexContainer className="relative flex items-center text-xs font-medium *:flex-1 *:p-2 *:text-center">
                <div className="">High Quality Scans</div>
                <div className="">24/7 Support</div>
                <div className="">100% Secure Payment</div>
              </FlexContainer>
            </FlexContainer>
          </div>
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export async function getStaticPaths() {
  try {
    const subjects = (await client.getEntries({
      content_type: "subject",
    })) as EntryCollection<Subject>;
    const chapters = (await client.getEntries({
      content_type: "productDemo",
    })) as EntryCollection<SoftCopyChapter>;
    const paths = subjects.items
      .map((subject) => {
        const subject_id = subject.sys.id;
        const subject_chapters = chapters.items.filter(
          (chapter: Entry<SoftCopyChapter> | SoftCopyChapter) => {
            if (!chapter.fields.subject) return false;
            const id = chapter.fields.subject?.sys?.id;
            return id === subject_id;
          },
        );
        const params = subject_chapters
          .map((chapter) => ({
            params: {
              slug: subject.fields.slug,
              chapter_id: chapter.sys.id,
            },
          }))
          .flat();
        // console.log(params, "params");
        return params;
      })
      .flat();
    console.log(paths, "paths");
    return {
      paths,
      fallback: false,
    };
    // Flatten the nested array of paths
  } catch (error) {
    console.error(error);
    // Handle errors appropriately, e.g., return an empty array or redirect
    return {
      paths: [],
      fallback: false,
    };
  }
}

// i am using getStaticPaths and getStaticProps to fetch data from contentful for dynamic routes
export async function getStaticProps(ctx: GetStaticPropsContext) {
  const query = ctx.params;
  const chapter_id = query?.chapter_id as string;
  console.log(chapter_id, "chapter_id");
  let data;
  try {
    const entry = (await client.getEntry(chapter_id)) as Entry<SoftCopyChapter>;
    data = entry;
  } catch (error) {
    data = [];
  }
  return {
    props: {
      data,
    },
  };
}

export default Index;
