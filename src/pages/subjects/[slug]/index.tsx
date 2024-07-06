import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import { useGlobalContext } from "@/components/context-provider";
import client from "@/lib/contentful";
import { SoftCopyChapter } from "@/lib/types";
import { addItem, removeItem, toggleCart } from "@/redux/slices/cart";
import { AppDispatch, RootState } from "@/redux/store";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  data: SoftCopyChapter[];
};

const Index = (props: Props) => {
  const router = useRouter();
  const [showBy, setShowBy] = useState<"11" | "12" | "11 & 12" | string>(
    "11 & 12",
  );

  console.log(props.data, "props");
  if (props.data.length === 0)
    return (
      <Wrapper>
        <h1 className="text-left font-rubik text-3xl font-[700] text-slate-950">
          No data found
        </h1>
      </Wrapper>
    );
  return (
    <Wrapper>
      <FlexContainer variant="column-start" gap="xl">
        <FlexContainer variant="row-between">
          <FlexContainer variant="column-start">
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/subjects">Subjects</BreadcrumbItem>
              <BreadcrumbItem>
                {props.data[0].fields.subject.fields.subjectName}
              </BreadcrumbItem>
            </Breadcrumbs>
            <Heading variant="h2">
              {props.data[0].fields.subject.fields.subjectName}
            </Heading>
          </FlexContainer>
          <div className="flex w-full items-center justify-end md:w-auto">
            <Select
              label="Select Class"
              placeholder="Select Class"
              radius="sm"
              classNames={{
                label: "font-medium text-zinc-900",
                trigger: "border shadow-none w-64",
              }}
              items={[
                { label: "Both 11 & 12", value: "11 & 12" },
                { label: "Class XI", value: "11" },
                { label: "Class XII", value: "12" },
              ]}
              onChange={(e) => {
                setShowBy(e.target.value);
              }}
              selectionMode="single"
              selectedKeys={showBy ? [showBy] : []}
            >
              {(item) => (
                <SelectItem key={item?.value}>{item?.label}</SelectItem>
              )}
            </Select>
          </div>
          {/* <Dropdown>
            <DropdownTrigger>
              <Button color="primary">Class {showBy}</Button>
            </DropdownTrigger>
            <DropdownMenu
              items={[
                { label: "All", value: "11 & 12" },
                { label: "Class XI", value: "11" },
                { label: "Class XII", value: "12" },
              ]}
            >
              {(item: { label: string; value: string }) => (
                <DropdownItem
                  onClick={() => setShowBy(item.value)}
                  key={item.value}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown> */}
        </FlexContainer>
        {(showBy === "11" || showBy === "11 & 12") && (
          <>
            <Heading variant="h5">Class XI</Heading>
            <GridContainer gap="xl">
              {props.data.map((chapter) => {
                if (chapter.fields.class !== "11") return null;
                return <Chapter key={chapter.sys.id} chapter={chapter} />;
              })}
            </GridContainer>
          </>
        )}

        {(showBy === "12" || showBy === "11 & 12") && (
          <>
            <Heading variant="h5">Class XII</Heading>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {props.data.map((chapter) => {
                if (chapter.fields.class !== "12") return null;
                return <Chapter key={chapter.sys.id} chapter={chapter} />;
              })}
            </div>
          </>
        )}
      </FlexContainer>
    </Wrapper>
  );
};

//fetch data from contentful for dynamic routes
export const getStaticPaths = async () => {
  const subjects = await client.getEntries({
    content_type: "subject",
  });
  const paths = subjects.items.map((subject) => ({
    params: { slug: `${subject.fields.slug}-${subject.sys.id}` },
  }));
  return {
    paths,
    fallback: false,
  };
};

//fetch data from contentful for dynamic routes
export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const query = ctx.params?.slug as string;
  const [slug, id] = query?.split("-");
  console.log(slug, "slug");
  console.log(id, "id");
  let data: [];
  try {
    const entries = await client.getEntries({
      content_type: "productDemo",
      //i have a field called subject which is a reference to the subject content type
      //so i am querying the productDemo content type where the subject.slug is equal to the slug
      // "fields.subject.fields.slug": slug,
      "fields.subject.sys.id": id,
      order: ["sys.createdAt"],
    });
    data = entries.items as [];
    console.log(entries, "entries");
  } catch (error) {
    data = [];
    console.log(error);
  }
  console.log(data, "data");
  return {
    props: {
      data,
    },
  };
};

const Chapter = ({ chapter }: { chapter: SoftCopyChapter }) => {
  const { isCartOpen, softcopy_items: items } = useSelector(
    (state: RootState) => state.cart,
  );
  const isInCart = items?.some((item) => item.sys.id === chapter.sys.id);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const thumbnail = chapter.fields.chapterThumbnail.fields.file.url.startsWith(
    "//",
  )
    ? "https:" + chapter.fields.chapterThumbnail.fields.file.url
    : chapter.fields.chapterThumbnail.fields.file.url;
  const link = `/subjects/${chapter.fields.subject.fields.slug}/${chapter.sys.id}`;

  const handleAddToCart = () => {
    if (!isCartOpen) {
      dispatch(toggleCart());
    }
    if (isInCart) {
      dispatch(removeItem(chapter.sys.id));
      return;
    }
    dispatch(addItem(chapter));
  };
  return (
    <div className="flex flex-col items-start justify-start gap-3 rounded-2xl bg-zinc-100 p-3 *:w-full">
      <Image
        src={thumbnail}
        alt="chapter"
        width={500}
        height={500}
        className="h-[200px] w-full rounded-xl object-cover shadow-small"
      />
      <div className="p-1.5">
        <h3 className="font-work-sans text-2xl font-medium text-slate-950">
          {chapter.fields.chapterName}
        </h3>
        <div className="mt-3 flex w-full gap-3">
          <Button
            color="primary"
            radius="sm"
            className="w-full flex-1 bg-violet-500 px-2 font-medium"
            onClick={() => router.push(link)}
          >
            View
          </Button>
          <Button
            color="primary"
            radius="sm"
            className="w-full flex-1 bg-white px-2 font-medium text-zinc-950"
            onClick={handleAddToCart}
          >
            {isInCart ? "Remove from cart" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
