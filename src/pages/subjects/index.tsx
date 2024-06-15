import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { Subject } from "@/lib/types";
import { convertToHttpsLink } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { EntryCollection } from "contentful";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IndexProps {
  subjects: Subject[];
}

const Index = ({ subjects }: IndexProps) => {
  console.log(subjects);
  return (
    <Wrapper>
      <FlexContainer variant="column-start" gap="xl">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Subjects</BreadcrumbItem>
        </Breadcrumbs>
        <Heading variant="h2">Subjects</Heading>
        <GridContainer className="mt-2.5">
          {" "}
          {subjects.map((subject) => {
            const image_url =
              subject.fields.teacherImage.fields.file.url.startsWith("//")
                ? "https:" + subject.fields.teacherImage.fields.file.url
                : subject.fields.teacherImage.fields.file.url;

            const imgUrl = convertToHttpsLink(
              subject.fields.teacherImage.fields.file.url,
            );
            return (
              <Link
                href={`/subjects/${subject.fields.slug}-${subject.sys.id}`}
                key={subject.sys.id}
              >
                <div className="to-zinc-0 group flex w-full items-center justify-start gap-5 rounded-2xl bg-gradient-to-b from-zinc-50 to-transparent p-7 font-sora text-3xl font-medium text-white shadow-small duration-100 active:scale-95">
                  <Image
                    src={image_url}
                    alt={subject.fields.teacherName}
                    width={500}
                    height={500}
                    className="h-16 w-16 rounded-[64px] object-cover"
                  />
                  <div className="flex flex-col items-start justify-start *:w-full">
                    <h3 className="text-left font-work-sans text-lg text-zinc-600">
                      {subject.fields.teacherName}
                    </h3>
                    <p className="flex items-start justify-start text-left text-xl font-medium text-black duration-200 group-hover:translate-x-2 group-hover:text-indigo-500 sm:text-2xl">
                      {subject.fields.subjectName}{" "}
                      <ChevronRight className="mt-0.5 h-7 w-7 -translate-x-2 scale-50 stroke-[2.5px] text-indigo-500 opacity-0 duration-200 group-hover:translate-x-1 group-hover:scale-100 group-hover:opacity-100" />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </GridContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export const getStaticProps = async () => {
  const data = await client.getEntries({
    content_type: "subject",
    order: ["sys.createdAt"],
  });
  return {
    props: {
      subjects: data.items,
    },
  };
};

export default Index;
