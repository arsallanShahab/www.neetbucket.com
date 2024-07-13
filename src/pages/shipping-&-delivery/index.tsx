import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <FlexContainer variant="column-start" gap="xl" className="max-w-3xl">
        <Heading variant="h3">Shipping & Delivery</Heading>
        <Heading>
          For International buyers, orders are shipped and delivered through
          registered international courier companies and/or International speed
          post only.
        </Heading>
        <Heading>
          For domestic buyers, orders are shipped through registered domestic
          courier companies and /or speed post only.
        </Heading>
        <Heading>
          Orders are shipped within 6-8 days or as per the delivery date agreed
          at the time of order confirmation and delivering of the shipment
          subject to Courier Company / post office norms.
        </Heading>
        <Heading>
          Neet Bucket is not liable for any delay in delivery by the courier
          company / postal authorities and only guarantees to hand over the
          consignment to the courier company or postal authorities within 6-8
          days from the date of the order and payment or as per the delivery
          date agreed at the time of order confirmation.
        </Heading>
        <Heading>
          Delivery of all orders will be to the address provided by the buyer.
          Delivery of our services will be confirmed on your mail ID as
          specified during registration.
        </Heading>
        <Heading>
          For any issues in utilizing our services you may contact our helpdesk
          on 7890020158 or ayaan@neetbucket.com
        </Heading>
      </FlexContainer>
    </Wrapper>
  );
};

export default Index;
