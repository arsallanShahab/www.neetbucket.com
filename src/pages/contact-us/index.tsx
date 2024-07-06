import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <FlexContainer variant="column-start">
        <Heading variant="h2">Contact Us</Heading>
        <Heading>You may contact us using the information below: </Heading>
        <Heading variant="subtitle2">
          Merchant Legal entity name: Neet Bucket Registered
        </Heading>
        <Heading variant="subtitle2">
          Address: 34 Taltala Lane Kolkata 700016 Kolkata WEST BENGAL 700016
        </Heading>
        <Heading variant="subtitle2">Telephone No: +91 81005 17624</Heading>
        <Heading variant="subtitle2">E-Mail ID: ayaan@neetbucket.com</Heading>
      </FlexContainer>
    </Wrapper>
  );
};

export default Index;
