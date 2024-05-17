import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import NextButton from "@/components/NextButton";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { formatImageLink } from "@/lib/utils";
import { HardcopyEntry } from "@/types/contentful/hardcopy";
import { EntryCollection } from "contentful";
import Image from "next/image";
import React from "react";

type Props = {
  data: HardcopyEntry[];
};

const Index = (props: Props) => {
  console.log(props.data);
  return (
    <Wrapper>
      <FlexContainer variant="column-start">
        <Heading variant="h3">Hard Copy</Heading>
        <GridContainer>
          {props?.data?.map((item) => {
            const thumbnail = formatImageLink(
              item?.fields?.chapterThumbnail?.fields?.file?.url,
            );
            return (
              <FlexContainer
                variant="column-start"
                key={item.sys.id}
                className="p-3"
              >
                <Heading variant="subtitle1">{item.fields.heading}</Heading>
                <Image
                  src={thumbnail}
                  alt={item.fields.heading}
                  width={400}
                  height={400}
                  className="h-full max-h-[350px] w-full rounded-xl object-cover"
                />
                <FlexContainer variant="row-end">
                  <NextButton colorScheme="primary">Buy</NextButton>
                </FlexContainer>
              </FlexContainer>
            );
          })}
        </GridContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export const getStaticProps = async () => {
  let entries;
  let hardcopy;
  try {
    entries = (await client.getEntries({
      content_type: "hardCopy",
    })) as EntryCollection<HardcopyEntry>;
    hardcopy = entries.items;
  } catch (error) {
    hardcopy = null;
  }
  return {
    props: {
      data: hardcopy,
    },
  };
};

export default Index;
